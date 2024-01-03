import accessoryMapping from '../mappings/accessories.json';
import ammoMapping from '../mappings/ammo.json';
import armorMapping from '../mappings/armor.json';
import itemsMapping from '../mappings/items.json';
import weaponMapping from '../mappings/weapons.json';

const reduceEquipmentMapping = (mapping: Record<string, {label: string}>) =>
    Object.fromEntries(
        Object
            .entries(mapping)
            .map(([key, {label}]) => [key, label])
    );

export const reducedAccessoryMapping = reduceEquipmentMapping(accessoryMapping);
export const reducedAmmoMapping = reduceEquipmentMapping(ammoMapping);
export const reducedArmorMapping = reduceEquipmentMapping(armorMapping);
export const reducedWeaponMapping = reduceEquipmentMapping(weaponMapping);

export const allItemsMapping = {
    ...itemsMapping,
    Armor: reducedArmorMapping,
    Accessories: reducedAccessoryMapping,
    Weapons: reducedWeaponMapping,
    Ammo: reducedAmmoMapping
};
