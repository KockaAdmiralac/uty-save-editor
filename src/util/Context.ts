import {createContext} from 'react';
import {IniFile, IniValue} from './ini';

interface SaveFile {
    data: IniFile;
    loaded: boolean;
}

interface SaveContextData {
    save: SaveFile;
    save02: SaveFile;
    controls: SaveFile;
    tempsave: SaveFile;
};

export type SaveFileName = keyof SaveContextData;

type SaveContextAction = {
    type: 'change',
    save: SaveFileName;
    section: string;
    option: string;
    value: IniValue;
} | {
    type: 'add';
    save: SaveFileName;
    section: string;
    option: string;
    value: IniValue;
} | {
    type: 'load';
    save: SaveFileName;
    value: IniFile;
};

export function contextReducer(state: SaveContextData, action: SaveContextAction): SaveContextData {
    // For a lack of a better deep-copy method.
    const newState: SaveContextData = JSON.parse(JSON.stringify(state));
    if (action.type === 'load') {
        newState[action.save].loaded = true;
        newState[action.save].data = action.value;
        return newState;
    }
    const {save, section, option} = action;
    if (!state[save].loaded) {
        // This should not happen.
        return state;
    }
    if (!newState[save].data.order.includes(section)) {
        newState[save].data.order.push(section);
    }
    const sectionData = newState[save].data.data[section] || {
        data: {},
        order: []
    };
    switch (action.type) {
        case 'change':
            if (!sectionData.order.includes(option)) {
                sectionData.order.push(option);
            }
            sectionData.data[option] = action.value;
            console.log(sectionData.data[option]);
            return newState;
        case 'add':
            if (!sectionData.order.includes(option) || !Array.isArray(sectionData.data[option])) {
                sectionData.order.push(option);
                sectionData.data[option] = [];
            }
            (sectionData.data[option] as IniValue[]).push(action.value);
            return state;
        default:
            return state;
    }
}

const emptySave: SaveFile = {
    data: {
        data: {},
        order: []
    },
    loaded: false
};

export const emptySaves: SaveContextData = {
    save: emptySave,
    save02: emptySave,
    controls: emptySave,
    tempsave: emptySave
};

interface SaveContextWithDispatch {
    data: SaveContextData;
    dispatch: (action: SaveContextAction) => void;
};

export const SaveContext = createContext<SaveContextWithDispatch>({
    data: emptySaves,
    dispatch: () => {}
});
