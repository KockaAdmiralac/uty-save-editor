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
