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
import accessoryMapping from '../mappings/accessories.json';
import ammoMapping from '../mappings/ammo.json';
import armorMapping from '../mappings/armor.json';
import directionMapping from '../mappings/direction.json';
import fastTravelMapping from '../mappings/fast-travel.json';
import followerMapping from '../mappings/follower.json';
import funValueMapping from '../mappings/fun.json';
import itemsMapping from '../mappings/items.json';
import mailMapping from '../mappings/mail.json';
import roomsMapping from '../mappings/rooms.json';
import spriteMapping from '../mappings/sprite.json';
import weaponMapping from '../mappings/weapons.json';
import LoadScreen from './LoadScreen';
import Footer from '../components/Footer';
import RoomViewer from '../controls/RoomViewer';
import ListField from '../controls/ListField';
import SteamworksIdEditor from '../controls/SteamworksIdEditor';

const reduceEquipmentMapping = (mapping: Record<string, {label: string}>) =>
    Object.fromEntries(
        Object
            .entries(mapping)
            .map(([key, {label}]) => [key, label])
    );

const SaveEditor: React.FC = () => {
    const {data} = useContext(SaveContext);
    const ppHelp = 'PP (protection points): how many hits does the SOUL remain invulnerable (effect applied by Golden Pear and Ceroba).';
    const spHelp = 'SP (speed points): how many turns does the SOUL become faster (effect applied by Golden Coffee).';
    const rpHelp = 'RP (restoration points): how many turns does the SOUL keep regaining HP (effect applied by Golden Cactus).';
    const roomsMappingOnlySaves = Object.fromEntries(
        Object
            .entries(roomsMapping)
            .filter(([_, name]) => name.endsWith(' [SAVE]'))
            .map(([key, value]) => [key, value.replace(/ \[SAVE\]$/, '')])
    );
    const reducedAccessoryMapping = reduceEquipmentMapping(accessoryMapping);
    const reducedAmmoMapping = reduceEquipmentMapping(ammoMapping);
    const reducedArmorMapping = reduceEquipmentMapping(armorMapping);
    const reducedWeaponMapping = reduceEquipmentMapping(weaponMapping);
    const [roomsMappingState, setRoomsMappingState] = useState<Record<string, string>>(roomsMappingOnlySaves);
    const allItemsMapping = {
        ...itemsMapping,
        Armor: reducedArmorMapping,
        Accessories: reducedAccessoryMapping,
        Weapons: reducedWeaponMapping,
        Ammo: reducedAmmoMapping
    };
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
                the <em className="text-yellow-400">Download</em> button, or
                save it as a template for future use using
                the <em className="text-yellow-400">Save template</em> button.
                If you want to load a different save file, you can use
                the <em className="text-yellow-400">Load&nbsp;</em>
                or <em className="text-yellow-400">Load template</em> buttons.
            </p>
            <div className="flex max-sm:flex-col gap-4 mb-8 justify-center w-full">
                <DownloadButton fileName="Save.sav" save="save" />
                <SaveTemplateButton save="save" />
                <LoadButton fileName="Save.sav" save="save" />
                <LoadTemplateButton save="save" />
                <BackButton />
            </div>
            <Section name="Battle stats">
                <NumberField save="save" section="Save1" option="AT - Primary" label="AT (Weapon)" />
                <NumberField save="save" section="Save1" option="AT - Secondary" label="AT (Ammo)" />
                <NumberField save="save" section="Save1" option="DFP" label="DF (Armor)" />
                <NumberField save="save" section="Save1" option="DFS" label="DF (Accessory)" />
                <NumberField save="save" section="Save1" option="HP" label="Current HP" />
                <NumberField save="save" section="Save1" option="MAXHP" label="Max HP" />
                <NumberField save="save" section="Save1" option="PP" label="Current PP" help={ppHelp} />
                <NumberField save="save" section="Save1" option="MAXPP" label="Max PP" help={ppHelp} />
                <NumberField save="save" section="Save1" option="SP" label="Current SP" help={spHelp} />
                <NumberField save="save" section="Save1" option="MAXSP" label="Max SP" help={spHelp} />
                <NumberField save="save" section="Save1" option="RP" label="Current RP" help={rpHelp} />
                <NumberField save="save" section="Save1" option="MAXRP" label="Max RP" help={rpHelp} />
                <NumberField save="save" section="Save1" option="EXP" label="EXP" />
                <NumberField save="save" section="Save1" option="LV" label="LV" />
                <NumberField save="save" section="Save1" option="Gold" label="Gold" />
            </Section>
            <Section name="Equipment">
                <SelectField save="save" section="Save1" option="Armor" label="Armor" mapping={reducedArmorMapping} />
                <SelectField save="save" section="Save1" option="Accessory" label="Accessory" mapping={reducedAccessoryMapping} />
                <SelectField save="save" section="Save1" option="Weapon" label="Weapon" mapping={reducedWeaponMapping} />
                <SelectField save="save" section="Save1" option="Ammo" label="Ammo" mapping={reducedAmmoMapping} />
            </Section>
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
            <Section name="Routes">
                {/* TODO */}
            </Section>
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
                    defaultValue={itemsMapping['Nothing']}
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
                    defaultValue={fastTravelMapping['Snowdin - Forest']}
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
                    defaultValue={mailMapping['Intro Letter']}
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
                    defaultValue={mailMapping['Intro Letter']}
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
                    defaultValue={mailMapping['Intro Letter']}
                />
            </Section>
            <Section name="Shops">
                {/* TODO */}
            </Section>
            <Section name="Ruins">
                {/* TODO */}
            </Section>
            <Section name="Steamworks">
                <SteamworksIdEditor save="save" section="SworksFlags" option="sworks_id" />
            </Section>
            <Section name="Play statistics">
                <NumberField save="save" section="Playtime" option="Seconds" label="Playtime (seconds)" />
                <NumberField
                    save="save"
                    section="Deaths"
                    option="00"
                    label="Total death count against certain bosses"
                    help="The bosses are Decibat, Dalv, Micro Froggit, Martlet (Pacifist or Genocide) and Flowey. This value is only saved by Flowey, so it may not be present on Pacifist or Genocide runs."
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
            <Section name="Flowey">
                {/* TODO */}
            </Section>
        </> : <LoadScreen fileName="Save.sav" save="save" showTemplate={true} />}
        <Footer />
    </main>;
};

export default SaveEditor;
