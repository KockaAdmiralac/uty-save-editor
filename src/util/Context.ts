import {createContext} from 'react';
import {IniFile, IniValue} from './ini';
import { SaveFileName, SaveFiles, emptySaves } from './save';

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

export function contextReducer(state: SaveFiles, action: SaveContextAction): SaveFiles {
    // For a lack of a better deep-copy method.
    const newState: SaveFiles = JSON.parse(JSON.stringify(state));
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

interface SaveContextWithDispatch {
    data: SaveFiles;
    dispatch: (action: SaveContextAction) => void;
};

export const SaveContext = createContext<SaveContextWithDispatch>({
    data: emptySaves,
    dispatch: () => {}
});
