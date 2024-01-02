import {useCallback, useContext, ChangeEvent} from 'react';
import {SaveContext} from '../util/Context';
import {SaveFileName} from '../util/save';

interface Props {
    min: number;
    max: number;
    step: number;
    save: SaveFileName;
    section: string;
    option: string;
    label: string;
    help?: string;
};

const SliderField: React.FC<Props> = ({min, max, step, save, section, option, label, help}) => {
    const {data, dispatch} = useContext(SaveContext);
    const value = data[save].data.data[section]?.data[option];
    const fieldName = `${save}-${section}-${option}`;
    const onChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        dispatch({
            type: 'change',
            save,
            section,
            option,
            value: Number(event.currentTarget.value)
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
        } (<em>{String(value)}</em>)</label>
        <input
            className="text-black p-1"
            type="range"
            name={fieldName}
            id={fieldName}
            value={Number(value || 0)}
            onChange={onChange}
            min={min}
            max={max}
            step={step}
        ></input>
    </p>
};

export default SliderField;
