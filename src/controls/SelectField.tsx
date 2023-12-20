import {useCallback, useContext, ChangeEvent} from 'react';
import {SaveContext, SaveFileName} from '../util/Context';

interface Props {
    save: SaveFileName;
    section: string;
    option: string;
    label: string;
    mapping: Record<string, string>;
    isNumber?: boolean;
};

const SelectField: React.FC<Props> = ({save, section, option, label, mapping, isNumber}) => {
    const {data, dispatch} = useContext(SaveContext);
    const value = data[save].data.data[section]?.data[option];
    const fieldName = `${save}-${section}-${option}`;
    const onChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
        dispatch({
            type: 'change',
            save,
            section,
            option,
            value: isNumber ?
                Number(event.currentTarget.value) :
                event.currentTarget.value
        });
    }, [dispatch, option, save, section, isNumber]);
    return <p className="flex flex-col mb-2">
        <label htmlFor={fieldName}>{label}</label>
        <select
            className="text-black p-1"
            name={fieldName}
            id={fieldName}
            onChange={onChange}
            value={String(value)}
        >{Object
            .entries(mapping)
            .map(([value, label]) => <option value={value} key={value}>
                {label}
            </option>)}</select>
    </p>;
};

export default SelectField;
