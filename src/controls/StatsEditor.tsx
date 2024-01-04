import { useCallback, useContext } from 'react';
import {
    reducedAccessoryMapping,
    reducedAmmoMapping,
    reducedArmorMapping,
    reducedWeaponMapping
} from '../mappings/items';
import accessoryMapping from '../mappings/accessories.json';
import ammoMapping from '../mappings/ammo.json';
import statsMapping from '../mappings/stats.json';
import NumberField from "./NumberField";
import Section from "./Section";
import SelectField from "./SelectField";
import { SaveContext } from '../util/Context';
import { SaveFileName } from '../util/save';
import SliderField from './SliderField';

const PP_HELP = 'PP (protection points): how many hits does the SOUL remain invulnerable (effect applied by Golden Pear and Ceroba).';
const SP_HELP = 'SP (speed points): how many turns does the SOUL become faster (effect applied by Golden Coffee).';
const RP_HELP = 'RP (restoration points): how many turns does the SOUL keep regaining HP (effect applied by Golden Cactus).';

interface Props {
    save: SaveFileName;
}

const StatsEditor: React.FC<Props> = ({save}) => {
    const {dispatch} = useContext(SaveContext);
    const onEquipmentChange = useCallback((option: string, property: string, mapping: Record<string, object>, value: string | number) => {
        const key = String(value);
        const armorData = mapping[key];
        dispatch({
            type: 'change',
            save,
            section: 'Save1',
            option: 'DFS',
            value: armorData[property as keyof typeof armorData]
        });
    }, [dispatch, save]);
    const onAccessoryChange = onEquipmentChange.bind(null, 'DFS', 'defense', accessoryMapping);
    const onAmmoChange = onEquipmentChange.bind(null, 'AT - Secondary', 'attack', ammoMapping);
    const onLVChange = useCallback((lv: number) => {
        dispatch({
            type: 'change',
            save,
            section: 'Save1',
            option: 'AT - Primary',
            value: statsMapping[lv - 1].at
        });
        dispatch({
            type: 'change',
            save,
            section: 'Save1',
            option: 'DFP',
            value: statsMapping[lv - 1].df
        });
        dispatch({
            type: 'change',
            save,
            section: 'Save1',
            option: 'MAXHP',
            value: statsMapping[lv - 1].hp
        });
        dispatch({
            type: 'change',
            save,
            section: 'Save1',
            option: 'HP',
            value: statsMapping[lv - 1].hp
        });
    }, [dispatch, save]);
    return <>
        <Section name="Battle stats">
            <NumberField save={save} section="Save1" option="AT - Primary" label="AT (Primary)" />
            <NumberField save={save} section="Save1" option="AT - Secondary" label="AT (Ammo)" />
            <NumberField save={save} section="Save1" option="DFP" label="DF (Primary)" />
            <NumberField save={save} section="Save1" option="DFS" label="DF (Accessory)" />
            <NumberField save={save} section="Save1" option="HP" label="Current HP" />
            <NumberField save={save} section="Save1" option="MAXHP" label="Max HP" />
            <NumberField save={save} section="Save1" option="PP" label="Current PP" help={PP_HELP} />
            <NumberField save={save} section="Save1" option="MAXPP" label="Max PP" help={PP_HELP} />
            <NumberField save={save} section="Save1" option="SP" label="Current SP" help={SP_HELP} />
            <NumberField save={save} section="Save1" option="MAXSP" label="Max SP" help={SP_HELP} />
            <NumberField save={save} section="Save1" option="RP" label="Current RP" help={RP_HELP} />
            <NumberField save={save} section="Save1" option="MAXRP" label="Max RP" help={RP_HELP} />
            <SliderField save={save} section="Save1" option="LV" label="LV" min={1} max={20} step={1} onChange={onLVChange} />
            <NumberField save={save} section="Save1" option="EXP" label="EXP" />
            <NumberField save={save} section="Save1" option="Gold" label="Gold" />
        </Section>
        <Section name="Equipment">
            <SelectField save={save} section="Save1" option="Armor" label="Armor" mapping={reducedArmorMapping} />
            <SelectField save={save} section="Save1" option="Accessory" label="Accessory" mapping={reducedAccessoryMapping} onChange={onAccessoryChange} />
            <SelectField save={save} section="Save1" option="Weapon" label="Weapon" mapping={reducedWeaponMapping} />
            <SelectField save={save} section="Save1" option="Ammo" label="Ammo" mapping={reducedAmmoMapping} onChange={onAmmoChange} />
        </Section>
    </>;
};

export default StatsEditor;
