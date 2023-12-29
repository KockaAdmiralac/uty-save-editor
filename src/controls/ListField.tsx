import React, {MouseEvent, useCallback, useContext} from 'react';
import {SaveContext} from '../util/Context';
import {SaveFileName} from '../util/save';
import {IniList} from '../util/ini';
import Button from '../components/Button';

type OnChangeFunc = (value: string | number, index: number) => void | Promise<void>;

interface Props {
    save: SaveFileName;
    section: string;
    option: string;
    countOption?: string;
    item: (value: string | number, onChange: OnChangeFunc, index: number) => React.ReactElement;
    defaultValue: string | number;
};

const ListField: React.FC<Props> = ({save, section, option, countOption, item, defaultValue}) => {
    const {data, dispatch} = useContext(SaveContext);
    const list = data[save].data.data[section]?.data[option] as IniList;
    const onChange: OnChangeFunc = useCallback((value, index) => {
        dispatch({
            type: 'change',
            save,
            section,
            option,
            index,
            value
        });
    }, [dispatch, option, save, section]);
    const onAdd = useCallback(() => {
        const newListLength = list.length + 1;
        dispatch({
            type: 'add',
            save,
            section,
            option,
            value: defaultValue
        });
        if (countOption) {
            dispatch({
                type: 'change',
                save,
                section,
                option: countOption,
                value: newListLength
            });
        }
    }, [dispatch, save, section, option, countOption, list.length, defaultValue]);
    const onRemove = useCallback((e: MouseEvent<HTMLButtonElement>) => {
        const splitId = e.currentTarget.id.split('-');
        const newListLength = list.length - 1;
        dispatch({
            type: 'remove',
            save,
            section,
            option,
            index: Number(splitId[splitId.length - 1])
        });
        if (countOption) {
            dispatch({
                type: 'change',
                save,
                section,
                option,
                value: newListLength
            });
        }
    }, [dispatch, save, section, option, countOption, list.length]);
    return <ul className="text-center">{[
        ...list.map((value, index) => <p key={index} className="flex justify-center gap-4 mb-2">
            {item(value.value, onChange, index)}
            <button
                className="text-red-500 text-3xl"
                aria-label="Remove item"
                onClick={onRemove}
                id={`${save}-${section}-${option}-${index}`}
            >×</button>
        </p>),
        <Button key={-1} label="Add new" onClick={onAdd} />
    ]}</ul>;
};

export default ListField;
