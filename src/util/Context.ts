import {createContext} from 'react';
import {GMValueType, IniFile, IniGrid, IniList, IniValue} from './ini';
import { SaveFileName, SaveFiles, emptySaves } from './save';

type SaveContextAction = {
    type: 'change';
    save: SaveFileName;
    section: string;
    option: string;
    value: IniValue;
    index?: number | [number, number];
} | {
    type: 'add';
    save: SaveFileName;
    section: string;
    option: string;
    value: string | number | boolean;
} | {
    type: 'load';
    save: SaveFileName;
    value: IniFile;
} | {
    type: 'remove';
    save: SaveFileName;
    section: string;
    option: string;
    index: number;
} | {
    type: 'draw';
    save: SaveFileName;
    section: string;
    option: string;
    x: number;
    y: number;
    width: number;
    height: number;
    color: number;
};

export function contextReducer(state: SaveFiles, action: SaveContextAction): SaveFiles {
    if (action.type === 'load') {
        return {
            ...state,
            [action.save]: {
                data: action.value,
                loaded: true
            }
        };
    }
    const {save, section, option} = action;
    if (!state[save].loaded) {
        // This should not happen.
        return state;
    }
    const sectionData = state[save].data.data[section] || {
        data: {},
        order: []
    };
    if (!state[save].data.data[section]) {
        state[save].data.order.push(section);
    }
    const optionData = sectionData.data[option];
    if (!optionData) {
        sectionData.order.push(option);
    }
    // For a lack of a better deep-copy method.
    let newOptionData: IniValue = JSON.parse(JSON.stringify(optionData));
    switch (action.type) {
        case 'change':
            if (typeof action.index === 'number') {
                (newOptionData as IniList)[action.index]
                    .value = (action.value as string | number);
            } else {
                newOptionData = action.value;
            }
            break;
        case 'add':
            if (!Array.isArray(newOptionData)) {
                return state;
            }
            (newOptionData as IniList).push(
                typeof action.value === 'string' ?
                    {
                        type: GMValueType.STRING,
                        value: action.value
                    } :
                    typeof action.value === 'boolean' ?
                        {
                            type: GMValueType.BOOL,
                            value: Number(action.value)
                        } :
                        {
                            type: GMValueType.REAL,
                            value: action.value
                        }
            );
            break;
        case 'remove':
            if (!Array.isArray(newOptionData)) {
                return state;
            }
            (newOptionData as IniList).splice(action.index, 1);
            break;
        case 'draw':
            const grid = newOptionData as IniGrid;
            const gridWidth = grid[0].length;
            const gridHeight = grid.length;
            const {x, y, width, height, color} = action;
            for (let dx = x; dx > 0 && dx < gridWidth && dx < x + width; ++dx) {
                for (let dy = y; dy > 0 && dy < gridHeight && dy < y + height; ++dy) {
                    grid[dy][dx].value = color;
                }
            }
            return state;
        default:
            return state;
    }
    return {
        ...state,
        [save]: {
            ...state[save],
            data: {
                ...state[save].data,
                data: {
                    ...state[save].data.data,
                    [section]: {
                        ...sectionData,
                        data: {
                            ...sectionData.data,
                            [option]: newOptionData
                        }
                    }
                }
            }
        }
    };
}

interface SaveContextWithDispatch {
    data: SaveFiles;
    dispatch: (action: SaveContextAction) => void;
};

export const SaveContext = createContext<SaveContextWithDispatch>({
    data: emptySaves,
    dispatch: () => {}
});
