import React, {ChangeEvent, useCallback, useContext, useState} from 'react';
import DownloadButton from '../actions/DownloadButton';
import LoadButton from '../actions/LoadButton';
import LoadTemplateButton from '../actions/LoadTemplateButton';
import SaveTemplateButton from '../actions/SaveTemplateButton';
import BackButton from '../components/BackButton';
import Section from '../controls/Section';
import NumberField from '../controls/NumberField';
import SelectField, { SelectDropdown } from '../controls/SelectField';
import BooleanField from '../controls/BooleanField';
import TextField from '../controls/TextField';
import {SaveContext} from '../util/Context';
import directionMapping from '../mappings/direction.json';
import fastTravelMapping from '../mappings/fast-travel.json';
import flagsMapping from '../mappings/flags.json';
import floweyMapping from '../mappings/flowey.json';
import followerMapping from '../mappings/follower.json';
import funValueMapping from '../mappings/fun.json';
import {allItemsMapping} from '../mappings/items';
import mailMapping from '../mappings/mail.json';
import roomsMapping from '../mappings/rooms.json';
import spriteMapping from '../mappings/sprite.json';
import LoadScreen from './LoadScreen';
import Footer from '../components/Footer';
import RoomViewer from '../controls/RoomViewer';
import ListField from '../controls/ListField';
import SteamworksIdEditor from '../controls/SteamworksIdEditor';
import StatsEditor from '../controls/StatsEditor';

const sworksCode2Mapping = Object.fromEntries(
    Array(16)
        .fill([])
        .map((_, idx) => [idx, `${
            String.fromCharCode('A'.charCodeAt(0) + Math.floor(idx / 4))
        }${
            idx % 4 + 1
        }`])
);

const SaveEditor: React.FC = () => {
    const {data} = useContext(SaveContext);
    const roomsMappingOnlySaves = Object.fromEntries(
        Object
            .entries(roomsMapping)
            .map(([areaName, rooms]) => [areaName, Object
                .entries(rooms)
                .filter(([_, name]) => name.endsWith(' [SAVE]'))
                .map(([key, value]) => [key, value.replace(/ \[SAVE\]$/, '')])
            ])
            .filter(([_, rooms]) => rooms.length > 0)
            .map(([areaName, rooms]) => [
                String(areaName),
                typeof rooms === 'string' ?
                    {[rooms]: '???'} :
                    Object.fromEntries(rooms)
            ])
    );
    const [roomsMappingState, setRoomsMappingState] = useState<Record<string, Record<string, string>>>(roomsMappingOnlySaves);
    const changeRoomsMapping = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setRoomsMappingState(event.currentTarget.checked ?
            roomsMappingOnlySaves :
            roomsMapping);
    }, [roomsMappingOnlySaves, setRoomsMappingState]);
    const fastTravelEnabled = Boolean(data.save.data?.data['Save1']?.data['FTravel']);
    return <main className="flex flex-col items-center justify-center min-h-screen md:ml-20 md:mr-20 lg:ml-80 lg:mr-80 max-sm:ml-4 max-sm:mr-4">
        <h1 className="text-4xl mb-8">Save Editor</h1>
        {data.save.loaded ? <>
            <p className="mb-4">
                Here you can edit various aspects of your save file. Once you
                are done editing, you can download the save file using 
                the <em>Download</em> button, or save it as a template for
                future use using the <em>Save template</em> button. If you want
                to load a different save file, you can use
                the <em>Load</em> or <em>Load template</em> buttons.
            </p>
            <div className="flex max-sm:flex-col gap-4 mb-8 justify-center w-full">
                <DownloadButton fileName="Save.sav" save="save" />
                <SaveTemplateButton save="save" />
                <LoadButton fileName="Save.sav" save="save" />
                <LoadTemplateButton save="save" />
                <BackButton />
            </div>
            <StatsEditor save="save" />
            <Section name="Overworld state">
                <SelectField save="save" section="Save1" option="room" label="Current room" mapping={roomsMappingState} />
                <RoomViewer save="save" section="Save1" roomOption="room" xOption="pX" yOption="pY" />
                <TextField save="save" section="Save1" option="rmName" label="Room name on the title screen" />
                <p className="grid grid-cols-2 gap-4 mb-2">
                    <label htmlFor="only-saves">Show only SAVE locations</label>
                    <input
                        type="checkbox"
                        name="only-saves"
                        id="only-saves"
                        defaultChecked={true}
                        onChange={changeRoomsMapping}
                    ></input>
                </p>
                <NumberField save="save" section="Save1" option="pX" label="X coordinate" />
                <NumberField save="save" section="Save1" option="pY" label="Y coordinate" />
                <SelectField save="save" section="Save1" option="dir" label="Facing direction" mapping={directionMapping} />
                <SelectField save="save" section="Save1" option="playerSprite" label="Player sprite" mapping={spriteMapping} />
                <BooleanField save="save" section="Save1" option="playerCanRun" label="Running allowed" />
                <SelectField save="save" section="Save1" option="Follower" label="Follower" mapping={followerMapping} />
            </Section>
            <Section name="Items">{
                Array(8)
                    .fill(0)
                    .map((_, idx) =>
                        <SelectField
                            save="save"
                            section="Items"
                            option={String(idx).padStart(2, '0')}
                            label={`Slot ${idx + 1}`}
                            mapping={allItemsMapping}
                            key={idx}
                        />)
            }</Section>
            <Section name="Dimensional Box">
                <ListField
                    save="save"
                    section="DBox"
                    option="0"
                    item={(value, onChange, index) => <SelectDropdown
                        mapping={allItemsMapping}
                        value={value}
                        index={index}
                        onChange={onChange}
                    />}
                    defaultValue={'Nothing'}
                />
            </Section>
            <Section name="Fun value">
                <SelectField
                    save="save"
                    section="Save1"
                    option="FUN"
                    label="Fun value"
                    isNumber={true}
                    mapping={funValueMapping}
                />
                <BooleanField save="save" section="Fun Events" option="0" label="Chair Man appeared in Saloon" />
                <BooleanField save="save" section="Fun Events" option="1" label="Chair Man appeared in Honeydew Resort" />
            </Section>
            <Section name="Fast Travel">
                <BooleanField save="save" section="Save1" option="FTravel" label="Fast Travel enabled" />
                {fastTravelEnabled && <h3 className="text-xl">Locations</h3>}
                {fastTravelEnabled && <ListField
                    save="save"
                    section="FastTravel"
                    option="0"
                    item={(value, onChange, index) => <SelectDropdown
                        mapping={fastTravelMapping}
                        value={value}
                        index={index}
                        onChange={onChange}
                    />}
                    defaultValue={'Snowdin - Forest'}
                />}
            </Section>
            <Section name="Mail">
                <NumberField
                    save="save"
                    section="Mail"
                    option="2"
                    label="Number of pinned mails"
                    help="If X is the number of pinned mails, the game considers top X mails in the list of all mails to be pinned."
                />
                <h3 className="text-xl">All mail</h3>
                <ListField
                    save="save"
                    section="Mail"
                    option="0"
                    countOption="1"
                    item={(value, onChange, index) => <SelectDropdown
                        mapping={mailMapping}
                        value={value}
                        index={index}
                        onChange={onChange}
                    />}
                    defaultValue={'Intro Letter'}
                />
                <h3 className="text-xl">Read mail</h3>
                <p>
                    If not in this list, the mail will be considered unread.
                    (The game adds mail to this list every time you read it,
                    even if you have previously read it.)
                </p>
                <ListField
                    save="save"
                    section="Mail"
                    option="3"
                    item={(value, onChange, index) => <SelectDropdown
                        mapping={mailMapping}
                        value={value}
                        index={index}
                        onChange={onChange}
                    />}
                    defaultValue={'Intro Letter'}
                />
                <h3 className="text-xl">Unclaimed mail</h3>
                <p>
                    If mail is in this list, Mail Whale will deliver it on a
                    UGPS station.
                </p>
                <ListField
                    save="save"
                    section="MailUnclaimed"
                    option="0"
                    item={(value, onChange, index) => <SelectDropdown
                        mapping={mailMapping}
                        value={value}
                        index={index}
                        onChange={onChange}
                    />}
                    defaultValue={'Intro Letter'}
                />
            </Section>
            <Section name="Routes">
                <SelectField save="save" section="Route" option="00" label="Current route" mapping={flagsMapping.route} />
            </Section>
            <Section name="Ruins">
                <SelectField save="save" section="Flags" option="15" label="Decibat fight" mapping={flagsMapping.decibat} />
                <SelectField save="save" section="Flags" option="17" label="Dalv fight" mapping={flagsMapping.dalv} />
            </Section>
            <Section name="Snowdin">
                <SelectField save="save" section="SnowdinFlags" option="13" label="Martlet fight" mapping={flagsMapping.martlet} />
                <SelectField save="save" section="SnowdinFlags" option="15" label="Clover's name" mapping={flagsMapping.name} />
            </Section>
            <Section name="Dunes">
                <SelectField save="save" section="DunesFlags" option="26" label="El Bailador fight" mapping={flagsMapping.bailador} />
                <SelectField save="save" section="DunesFlags" option="24" label="Starlo fight" mapping={flagsMapping.encounter} />
                <SelectField save="save" section="DunesFlags" option="40" label="Ceroba (Genocide) fight" mapping={flagsMapping.genocidebossencounter} />
            </Section>
            <Section name="Steamworks">
                <SelectField save="save" section="SworksFlags" option="20" label="Guardener fight" mapping={flagsMapping.guardener} />
                <SelectField save="save" section="SworksFlags" option="31" label="Axis fight" mapping={flagsMapping.axis} />
                <SteamworksIdEditor save="save" section="SworksFlags" option="sworks_id" />
                <TextField save="save" section="SworksFlags" option="code" label="First passcode" />
                <p>Second passcode</p>
                <ListField
                    save="save"
                    section="SworksFlags"
                    option="code2"
                    defaultValue={0}
                    item={(value, onChange, index) => <SelectDropdown
                        onChange={onChange}
                        index={index}
                        value={value}
                        mapping={sworksCode2Mapping}
                    />}
                />
                <TextField save="save" section="SworksFlags" option="code3" label="Third passcode" />
                </Section>
            <Section name="Flowey">
                <SelectField save="save" section="Misc2" option="10" label="Current battle phase" mapping={floweyMapping.ffight} />
                <NumberField save="save" section="FloweyFlags" option="savecount" label="Save count" />
                <SelectField save="save" section="FloweyFlags" option="savenumber" label="Maximum save number in the area" mapping={floweyMapping.savenumber} />
            </Section>
            <Section name="Play statistics">
                <NumberField save="save" section="Playtime" option="Seconds" label="Playtime (seconds)" />
                <NumberField
                    save="save"
                    section="Deaths"
                    option="00"
                    label="Total death count"
                    help="This value is generally wrong due to a bug. This value is only saved by Flowey, so it may not be present on Pacifist or Genocide runs."
                />
                <NumberField
                    save="save"
                    section="Deaths"
                    option="01"
                    label="Death count against Decibat"
                    help="This value is only saved by Flowey, so it may not be present on Pacifist or Genocide runs."
                />
                <NumberField
                    save="save"
                    section="Deaths"
                    option="02"
                    label="Death count against Dalv"
                    help="This value is only saved by Flowey, so it may not be present on Pacifist or Genocide runs."
                />
            </Section>
        </> : <LoadScreen fileName="Save.sav" save="save" showTemplate={true} />}
        <Footer />
    </main>;
};

export default SaveEditor;
