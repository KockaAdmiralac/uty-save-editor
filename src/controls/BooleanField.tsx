import {useCallback, useContext, ChangeEvent} from 'react';
import {SaveContext} from '../util/Context';
import {SaveFileName} from '../util/save';

interface Props {
    save: SaveFileName;
    section: string;
    option: string;
    label: string;
};

const BooleanField: React.FC<Props> = ({save, section, option, label}) => {
    const {data, dispatch} = useContext(SaveContext);
    const value = data[save].data.data[section]?.data[option];
    const fieldName = `${save}-${section}-${option}`;
    const onChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        dispatch({
            type: 'change',
            save,
            section,
            option,
            value: Number(event.currentTarget.checked)
        });
    }, [dispatch, option, save, section]);
    return <p className="grid grid-cols-2 gap-4 mb-2">
        <label htmlFor={fieldName}>{label}</label>
        <input
            type="checkbox"
            name={fieldName}
            id={fieldName}
            checked={Boolean(value)}
            onChange={onChange}
        ></input>
    </p>;
};

export default BooleanField;
