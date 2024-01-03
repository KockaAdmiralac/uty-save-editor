import React, { useContext } from 'react';
import BackButton from '../components/BackButton';
import Footer from '../components/Footer';
import { SaveContext } from '../util/Context';
import LoadScreen from './LoadScreen';
import DownloadButton from '../actions/DownloadButton';
import LoadButton from '../actions/LoadButton';
import Section from '../controls/Section';
import NumberField from '../controls/NumberField';
import SelectField, { SelectDropdown } from '../controls/SelectField';
import {
    allItemsMapping,
    reducedAccessoryMapping,
    reducedAmmoMapping,
    reducedArmorMapping,
    reducedWeaponMapping
} from '../mappings/items';
import floweyMappings from '../mappings/flowey.json';
import spriteMapping from '../mappings/sprite.json';
import ListField from '../controls/ListField';
import BooleanField from '../controls/BooleanField';

const TempSaveEditor: React.FC = () => {
    const {data} = useContext(SaveContext);
    const ppHelp = 'PP (protection points): how many hits does the SOUL remain invulnerable (effect applied by Golden Pear and Ceroba).';
    const spHelp = 'SP (speed points): how many turns does the SOUL become faster (effect applied by Golden Coffee).';
    const rpHelp = 'RP (restoration points): how many turns does the SOUL keep regaining HP (effect applied by Golden Cactus).';
    const floweyPhase = data.tempsave?.data?.data['Save1']?.data['ffight'];
    return <main className="flex flex-col items-center justify-center min-h-screen md:ml-20 md:mr-20 lg:ml-80 lg:mr-80 max-sm:ml-4 max-sm:mr-4">
        <h1 className="text-4xl mb-8">Temporary Save Editor</h1>
        {data.tempsave.loaded ? <>
            <p className="mb-4">
                This save is used when retrying after death in battle. This
                means that if you want to change your stats or affect the battle
                in any other way while you are in battle and do not want to
                listen to the battle intro again, you can modify and replace
                this file, then die. Once you're done editing, use
                the <em>Download</em> button to download the save file.
            </p>
            <div className="flex max-sm:flex-col gap-4 mb-8 justify-center w-full">
                <DownloadButton fileName="tempsave.sav" save="tempsave" />
                <LoadButton fileName="tempsave.sav" save="tempsave" />
                <BackButton />
            </div>
            <Section name="Battle stats">
                <NumberField save="tempsave" section="Save1" option="AT - Primary" label="AT (Weapon)" />
                <NumberField save="tempsave" section="Save1" option="AT - Secondary" label="AT (Ammo)" />
                <NumberField save="tempsave" section="Save1" option="DFP" label="DF (Armor)" />
                <NumberField save="tempsave" section="Save1" option="DFS" label="DF (Accessory)" />
                <NumberField save="tempsave" section="Save1" option="HP" label="Current HP" />
                <NumberField save="tempsave" section="Save1" option="MAXHP" label="Max HP" />
                <NumberField save="tempsave" section="Save1" option="PP" label="Current PP" help={ppHelp} />
                <NumberField save="tempsave" section="Save1" option="MAXPP" label="Max PP" help={ppHelp} />
                <NumberField save="tempsave" section="Save1" option="SP" label="Current SP" help={spHelp} />
                <NumberField save="tempsave" section="Save1" option="MAXSP" label="Max SP" help={spHelp} />
                <NumberField save="tempsave" section="Save1" option="RP" label="Current RP" help={rpHelp} />
                <NumberField save="tempsave" section="Save1" option="MAXRP" label="Max RP" help={rpHelp} />
                <NumberField save="tempsave" section="Save1" option="EXP" label="EXP" />
                <NumberField save="tempsave" section="Save1" option="LV" label="LV" />
                <NumberField save="tempsave" section="Save1" option="Gold" label="Gold" />
            </Section>
            <Section name="Equipment">
                <SelectField save="tempsave" section="Save1" option="Armor" label="Armor" mapping={reducedArmorMapping} />
                <SelectField save="tempsave" section="Save1" option="Accessory" label="Accessory" mapping={reducedAccessoryMapping} />
                <SelectField save="tempsave" section="Save1" option="Weapon" label="Weapon" mapping={reducedWeaponMapping} />
                <SelectField save="tempsave" section="Save1" option="Ammo" label="Ammo" mapping={reducedAmmoMapping} />
            </Section>
            <Section name="Items">{
                Array(8)
                    .fill(0)
                    .map((_, idx) =>
                        <SelectField
                            save="tempsave"
                            section="Items"
                            option={String(idx).padStart(2, '0')}
                            label={`Slot ${idx + 1}`}
                            mapping={allItemsMapping}
                            key={idx}
                        />)
            }</Section>
            <Section name="Flowey">
                <p>
                    These options affect the final Flowey battle. Note that you
                    still need to replace your save file while in battle and die
                    to apply these changes.
                </p>
                <SelectField save="tempsave" section="Save1" option="ffight" label="Flowey fight phase" mapping={floweyMappings.ffight} isNumber={true} />
                {floweyPhase === 1 &&
                    <SelectField save="tempsave" section="Special" option="0" label="Sub-phase" mapping={floweyMappings.subphases} />}
                {floweyPhase === 1 &&
                    <NumberField save="tempsave" section="Special" option="4" label="Attack number" help="Usually between 0 and 11." />}
                {floweyPhase === 1 && <h3 className="text-xl">Attack list</h3>}
                {floweyPhase === 1 && <p>
                    Attacks which are in this list get randomly picked by Flowey
                    on turns in which he's picking his regular attacks. If there
                    are none to pick, he picks the attack 1.
                </p>}
                {floweyPhase === 1 && <ListField
                    save="tempsave"
                    section="Special"
                    option="1"
                    item={(value, onChange, index) => <SelectDropdown
                        mapping={floweyMappings.attacks}
                        value={value}
                        index={index}
                        onChange={onChange}
                        isNumber={true}
                    />}
                    defaultValue={1}
                />}
                {floweyPhase === 1 && <h3 className="text-xl">Stolen attack list</h3>}
                {floweyPhase === 1 && <p>
                    Attacks which are in this list get randomly picked by Flowey
                    on turns in which he's picking attacks by other monsters to
                    imitate. If there are none to pick, he does not imitate
                    anybody.
                </p>}
                {floweyPhase === 1 && <ListField
                    save="tempsave"
                    section="Special"
                    option="2"
                    item={(value, onChange, index) => <SelectDropdown
                        mapping={floweyMappings.stolenAttacks}
                        value={value}
                        index={index}
                        onChange={onChange}
                        isNumber={true}
                    />}
                    defaultValue={1}
                />}
                {floweyPhase === 1 && <h3 className="text-xl">Room list</h3>}
                {floweyPhase === 1 && <p>
                    When Flowey is about to place Clover in a room to run from
                    the vines, he picks a room from this list. If there are no
                    rooms to pick, he does not have a room-based attack.
                </p>}
                {floweyPhase === 1 && <ListField
                    save="tempsave"
                    section="Special"
                    option="3"
                    item={(value, onChange, index) => <SelectDropdown
                        mapping={floweyMappings.rooms}
                        value={value}
                        index={index}
                        onChange={onChange}
                        isNumber={true}
                    />}
                    defaultValue={226}
                />}
                {floweyPhase === 2 && <NumberField save="tempsave" section="petal" option="count" label="Petal count" />}
                {floweyPhase === 2 && Object
                    .entries(floweyMappings.petals)
                    .map(([option, label]) => <BooleanField
                        save="tempsave"
                        section="petal"
                        option={option}
                        label={`${label} alive`}
                        key={option}
                    />)}
            </Section>
            <Section name="Other">
                <SelectField save="save" section="Save1" option="playerSprite" label="Player sprite" mapping={spriteMapping} />
            </Section>
        </> : <LoadScreen fileName="tempsave.sav" save="tempsave" />}
        <Footer />
    </main>;
};

export default TempSaveEditor;
