import {useCallback, useContext, ChangeEvent} from 'react';
import {SaveContext} from '../util/Context';
import {SaveFileName} from '../util/save';
import {IniValue} from '../util/ini';

interface Props {
    save: SaveFileName;
    section: string;
    option: string;
    label: string;
    mapping: Record<string, string | Record<string, string>>;
    isNumber?: boolean;
    onChange?: (value: string | number) => void | Promise<void>;
};

interface DropdownProps {
    mapping: Record<string, string | Record<string, string>>;
    fieldName?: string;
    value: IniValue;
    index: number;
    isNumber?: boolean;
    onChange: (value: string | number, index: number) => void | Promise<void>;
}

export const SelectDropdown: React.FC<DropdownProps> = ({mapping, fieldName, value, index, isNumber, onChange}) => {
    const onChangeWrapper = useCallback(async (event: ChangeEvent<HTMLSelectElement>) => {
        const value = isNumber ?
            Number(event.currentTarget.value) :
            event.currentTarget.value;
        await onChange(value, index);
    }, [onChange, index, isNumber]);
    return <select
        className="text-black p-1 max-w-full"
        name={fieldName}
        id={fieldName}
        onChange={onChangeWrapper}
        value={String(value)}
    >{Object
        .entries(mapping)
        .map(([value, label]) => typeof label === 'object' ?
            <optgroup label={value} key={value}>{Object
                .entries(label)
                .map(([value2, label2]) =>
                    <option value={value2} key={value2}>{label2}</option>)
            }</optgroup> :
            <option value={value} key={value}>{label}</option>)
    }</select>;
};

const SelectField: React.FC<Props> = ({save, section, option, label, mapping, isNumber, onChange}) => {
    const {data, dispatch} = useContext(SaveContext);
    const value = data[save].data.data[section]?.data[option];
    const onSelectionChange = useCallback((value: string | number) => {
        dispatch({
            type: 'change',
            save,
            section,
            option,
            value
        });
        if (onChange) {
            onChange(value);
        }
    }, [dispatch, option, save, section, onChange]);
    const fieldName = `${save}-${section}-${option}`;
    return <p className="flex flex-col mb-2">
        <label htmlFor={fieldName}>{label}</label>
        <SelectDropdown
            mapping={mapping}
            fieldName={fieldName}
            value={value}
            onChange={onSelectionChange}
            index={0}
            isNumber={isNumber}
        />
    </p>;
};

export default SelectField;
