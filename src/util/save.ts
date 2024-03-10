import { IniFile } from "./ini";

export interface SaveFile {
    data: IniFile;
    loaded: boolean;
}

export interface SaveFiles {
    save: SaveFile;
    save02: SaveFile;
    controls: SaveFile;
    tempsave: SaveFile;
}

export type SaveFileName = keyof SaveFiles;

const emptySave: SaveFile = {
    data: {
        data: {},
        order: []
    },
    loaded: false
};

export const emptySaves: SaveFiles = {
    save: emptySave,
    save02: emptySave,
    controls: emptySave,
    tempsave: emptySave
};

export function identifySaveFile(file: IniFile): SaveFileName {
    if (file.order.includes('Controls')) {
        return 'controls';
    }
    if (file.order.includes('00')) {
        return 'save02';
    }
    if (file.order.includes('Mail')) {
        return 'save';
    }
    if (file.order.includes('Save1')) {
        // We ruled out Save.sav by now.
        return 'tempsave';
    }
    throw new Error('Cannot identify type of save file.');
}

export function checkAxisBroken(file: IniFile): boolean {
    const route = Number(file.data['Route']?.data['00']);
    const flag28 = Number(file.data['SworksFlags']?.data['28']);
    const genoComplete = Number(file.data['GenoComplete']?.data['4']);
    const encounters = file.data['Encounters']?.data['0'];
    if (!Array.isArray(encounters)) {
        return false;
    }
    // If we are on the Genocide Route...
    return route === 3 &&
           // ...and we have reached the control room...
           flag28 > 0 &&
           // ...but there are no encounters...
           encounters.length === 0 &&
           // ...and we haven't finished our Genocide Route yet...
           genoComplete === 0;
           // ...then we must have aborted the Genocide Route before Axis!
}
