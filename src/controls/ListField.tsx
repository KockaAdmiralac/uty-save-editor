import React, {useCallback, useContext} from 'react';
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
}

interface RemoveButtonProps {
    save: SaveFileName;
    section: string;
    option: string;
    countOption?: string;
    index: number;
}

const RemoveButton: React.FC<RemoveButtonProps> = ({save, section, option, countOption, index}) => {
    const {data, dispatch} = useContext(SaveContext);
    const list = data[save].data.data[section]?.data[option] as IniList;
    const onRemove = useCallback(() => {
        const newListLength = list.length - 1;
        dispatch({
            type: 'remove',
            save,
            section,
            option,
            index
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
    }, [dispatch, save, section, option, countOption, list.length, index]);
    return <button
        className="text-red-500 text-3xl"
        aria-label="Remove item"
        onClick={onRemove}
    >×</button>;
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
    return <ul className="text-center">{[
        ...list.map((value, index) => <p key={index} className="flex justify-center gap-4 mb-2">
            {item(value.value, onChange, index)}
            <RemoveButton
                save={save}
                section={section}
                option={option}
                countOption={countOption}
                index={index}
                key={index}
            />
        </p>),
        <Button key={-1} label="Add new" onClick={onAdd} />
    ]}</ul>;
};

export default ListField;
