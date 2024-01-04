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
    onChange?: (value: number) => void | Promise<void>;
};

const SliderField: React.FC<Props> = ({min, max, step, save, section, option, label, help, onChange}) => {
    const {data, dispatch} = useContext(SaveContext);
    const value = data[save].data.data[section]?.data[option];
    const fieldName = `${save}-${section}-${option}`;
    const onValueChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const value = Number(event.currentTarget.value);
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
            onChange={onValueChange}
            min={min}
            max={max}
            step={step}
        ></input>
    </p>
};

export default SliderField;
