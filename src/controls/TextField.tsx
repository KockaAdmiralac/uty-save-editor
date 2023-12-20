import {useCallback, useContext, ChangeEvent} from 'react';
import {SaveContext, SaveFileName} from '../util/Context';

interface Props {
    save: SaveFileName;
    section: string;
    option: string;
    label: string;
    help?: string;
};

const TextField: React.FC<Props> = ({save, section, option, label, help}) => {
    const {data, dispatch} = useContext(SaveContext);
    const value = data[save].data.data[section]?.data[option];
    const fieldName = `${save}-${section}-${option}`;
    const onChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        dispatch({
            type: 'change',
            save,
            section,
            option,
            value: event.currentTarget.value
        });
    }, [dispatch, option, save, section]);
    return <p className="grid grid-cols-2 gap-4 mb-2">
        <label htmlFor={fieldName} title={help}>{
            help ?
                <abbr title={help}>
                    {label}
                    <sup className="text-yellow-200">(?)</sup>
                </abbr> :
                label
        }</label>
        <input
            className="text-black p-1"
            type="text"
            name={fieldName}
            id={fieldName}
            value={String(value || '')}
            onChange={onChange}
        ></input>
    </p>
};

export default TextField;
