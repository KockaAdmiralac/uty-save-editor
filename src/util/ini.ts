type KeyType = string | number;
interface OrderPreservingMap<K extends KeyType, V> {
    data: Record<K, V>;
    order: K[];
}

type GMReal = number;
type GMString = string;
// https://github.com/YoYoGames/GMEXT-Steamworks/blob/54192eb/source/Steamworks_vs/Steamworks/YYRValue.h
enum GMValueType {
    REAL = 0,
    STRING = 1,
    ARRAY = 2,
    PTR = 3,
    // Deprecated
    VEC3 = 4,
    UNDEFINED = 5,
    OBJECT = 6,
    INT32 = 7,
    // Deprecated
    VEC4 = 8,
    // Deprecated
    VEC44 = 9,
    INT64 = 10,
    ACCESSOR = 11,
    NULL = 12,
    BOOL = 13,
    ITERATOR = 14,
    REF = 15
};
type GMValue = {
    type: GMValueType.REAL | GMValueType.BOOL;
    value: GMReal;
} | {
    type: GMValueType.STRING;
    value: GMString;
};

type IniReal = number;
type IniString = string;
type IniSimpleValue = IniReal | IniString;
type IniList = GMValue[];
type IniGrid = GMValue[][];
type IniMap = OrderPreservingMap<IniSimpleValue, GMValue>;
export type IniValue = IniSimpleValue | IniList | IniGrid | IniMap;
export type IniFile = OrderPreservingMap<string, OrderPreservingMap<string, IniValue>>;

const INI_SECTION = /^\[(.*)\]$/;
const INI_PAIR = /^([^=]+)\s*=\s*"(.*)"$/;

function orderedEntries<K extends KeyType, V>(
    map: OrderPreservingMap<K, V>
): [K, V][] {
    return map.order.map(key => [key, map.data[key]]);
}

function parseInt32LE(str: string, ptr: number): [number, number] {
    const num = parseInt(Array(4)
        .fill('00')
        .map((_, idx) => str.substring(ptr + 6 - idx * 2, ptr + 8 - idx * 2))
        .join(''), 16);
    return [ptr + 8, num];
}

function parseGMReal(str: string, ptr: number): [number, GMReal] {
    const [ptr2, lo] = parseInt32LE(str, ptr);
    const [ptr3, hi] = parseInt32LE(str, ptr2);
    const p32 = 0x100000000;
    const p52 = 0x10000000000000;
    const exp = (hi >> 20) & 0x7ff;
    const sign = (hi >> 31);
    let m = ((hi & 0xfffff) * p32 + lo) / p52;
    m = exp ? (m + 1) : (m * 2.0);
    return [ptr3, (sign ? -1 : 1) * m * Math.pow(2, exp - 1023)];
}

function parseGMString(str: string, ptr: number): [number, GMString] {
    const [ptr2, strLength] = parseInt32LE(str, ptr);
    const value = Array(strLength)
        .fill('\0')
        .map((_, idx) => String.fromCharCode(parseInt(str.substring(ptr2 + idx * 2, ptr2 + (idx + 1) * 2), 16)))
        .join('');
    return [ptr2 + strLength * 2, value];
}

function parseGMValue(str: string, ptr: number): [number, GMValue] {
    const [ptr2, type] = parseInt32LE(str, ptr);
    if (type === GMValueType.REAL || type === GMValueType.BOOL) {
        const [ptr3, value] = parseGMReal(str, ptr2);
        return [ptr3, {type, value}];
    }
    if (type === GMValueType.STRING) {
        const [ptr3, value] = parseGMString(str, ptr2);
        return [ptr3, {type, value}];
    }
    throw new Error(`INI parse error: Unknown GM value type ${type}.`);
}

function parseDSList(value: string): IniList {
    let val = null;
    let [ptr, length] = parseInt32LE(value, 0);
    const list = [];
    while (--length >= 0) {
        [ptr, val] = parseGMValue(value, ptr);
        list.push(val);
    }
    return list;
}

function parseDSMap(value: string): IniMap {
    let val = null;
    let key = null;
    let [ptr, length] = parseInt32LE(value, 0);
    const map: IniMap = {
        data: {},
        order: []
    };
    while (--length >= 0) {
        [ptr, key] = parseGMValue(value, ptr);
        [ptr, val] = parseGMValue(value, ptr);
        // Hopefully, the keys won't be of type BOOL!
        map.data[key.value] = val;
        map.order.push(key.value);
    }
    return map;
}

function parseDSGrid(value: string): IniGrid {
    let [ptr, width] = parseInt32LE(value, 0);
    let height = 0;
    let val = null;
    [ptr, height] = parseInt32LE(value, ptr);
    const grid: IniGrid = [];
    for (let y = 0; y < height; ++y) {
        grid.push([]);
        for (let x = 0; x < width; ++x) {
            [ptr, val] = parseGMValue(value, ptr);
            grid[y].push(val);
        }
    }
    return grid;
}

function parseIniValue(value: string): IniValue {
    if (!isNaN(Number(value)) && value.includes('.')) {
        return Number(value);
    }
    if (value.startsWith('93010000')) {
        return parseDSMap(value.substring(8));
    }
    if (value.startsWith('2F010000')) {
        return parseDSList(value.substring(8));
    }
    if (value.startsWith('5B020000')) {
        return parseDSGrid(value.substring(8));
    }
    return value;
}

export function parseIni(contents: string): IniFile {
    const lines = contents.split('\n').map(l => l.trim());
    let currentSection = '';
    const iniFile: IniFile = {
        data: {},
        order: []
    };
    for (const [lineNumber, line] of lines.entries()) {
        const sectionMatch = INI_SECTION.exec(line);
        const pairMatch = INI_PAIR.exec(line);
        if (sectionMatch) {
            currentSection = sectionMatch[1];
            iniFile.data[currentSection] = {
                data: {},
                order: []
            };
            iniFile.order.push(currentSection);
        } else if (pairMatch) {
            const [, key, value] = pairMatch;
            if (!currentSection) {
                throw new Error(`INI parse error: Key pair without a section on line ${lineNumber}: key=${key}, value=${value}.`);
            }
            const trimmedKey = key.trim();
            const trimmedValue = value.trim();
            iniFile.data[currentSection].data[trimmedKey] = parseIniValue(trimmedValue);
            iniFile.data[currentSection].order.push(trimmedKey);
        } else if (line) {
            throw new Error(`INI parse error: Invalid content on line ${lineNumber}.`);
        }
    }
    return iniFile;
}

function stringifyInt32LE(value: number): string {
    const buffer = new ArrayBuffer(4);
    const num = new Int32Array(buffer);
    num[0] = value;
    return Array
        .from(new Uint8Array(buffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
        .toUpperCase();
}

function stringifyGMReal(value: GMReal) {
    const buffer = new ArrayBuffer(8);
    const longNum = new Float64Array(buffer);
    longNum[0] = value;
    return Array
        .from(new Uint8Array(buffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
        .toUpperCase();
}

function stringifyGMString(value: string) {
    return `${stringifyInt32LE(value.length)}${value
        .split('')
        .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
        .toUpperCase()}`;
}

function stringifyGMValue(value: GMValue | IniSimpleValue) {
    if (typeof value === 'number') {
        // Hopefully, we won't use this when the type is BOOL!
        return `${stringifyInt32LE(GMValueType.REAL)}${stringifyGMReal(value)}`;
    }
    if (typeof value === 'string') {
        return `${stringifyInt32LE(GMValueType.STRING)}${stringifyGMString(value)}`;
    }
    if (typeof value === 'object') {
        if (value.type === GMValueType.REAL || value.type === GMValueType.BOOL) {
            return `${stringifyInt32LE(value.type)}${stringifyGMReal(value.value)}`;
        }
        if (value.type === GMValueType.STRING) {
            return `${stringifyInt32LE(value.type)}${stringifyGMString(value.value)}`;
        }
        throw new Error(`INI stringify error: Unknown GM value type ${value.type}.`);
    }
    throw new Error(`INI stringify error: Cannot stringify value ${value} to GM.`);
}

function stringifyGrid(value: IniGrid): string {
    const width = value[0].length;
    const height = value.length;
    return `5B020000${stringifyInt32LE(width)}${stringifyInt32LE(height)}${value
        .map(row => row
            .map(val => stringifyGMValue(val))
            .join(''))
        .join('')}`;
}

function stringifyList(value: IniList): string {
    return `2F010000${stringifyInt32LE(value.length)}${value
        .map(v => stringifyGMValue(v))
        .join('')}`;
}

function stringifyIniMap(value: IniMap): string {
    const entries = orderedEntries(value);
    return `93010000${stringifyInt32LE(entries.length)}${entries
        .map(([k, v]) => `${stringifyGMValue(k)}${stringifyGMValue(v)}`)
        .join('')}`;
}

function stringifyIniValue(value: IniValue): string {
    if (typeof value === 'number') {
        return value.toFixed(6);
    }
    if (typeof value === 'string') {
        return value;
    }
    if (Array.isArray(value)) {
        if (Array.isArray(value[0])) {
            return stringifyGrid(value as IniGrid);
        } else {
            return stringifyList(value as IniList);
        }
    }
    if (typeof value === 'object') {
        return stringifyIniMap(value);
    }
    throw new Error(`INI stringify error: Cannot stringify value ${value}.`);
}

export function stringifyIni(file: IniFile): string {
    return `${orderedEntries(file)
        .map(([section, pairs]) => `[${section}]\r\n${
            orderedEntries(pairs)
                .map(([key, value]) => `${key}="${stringifyIniValue(value)}"`)
                .join('\r\n')
        }`)
        .join('\r\n')}\r\n`;
}
