import {ChangeEvent, useCallback, useContext, useEffect, useState} from 'react';
import NumberField from './NumberField';
import RoomViewer from './RoomViewer';
import SelectField from './SelectField';
import TextField from './TextField';
import roomsMapping from '../mappings/rooms.json';
import {SaveFileName} from '../util/save';
import {SaveContext} from '../util/Context';

interface Props {
    save: SaveFileName;
}

const trimSave = (room: string) => room.replace(/ \[SAVE\]$/, '');

const roomsMappingOnlySaves = Object.fromEntries(
    Object
        .entries(roomsMapping)
        .map(([areaName, rooms]) => [areaName, Object
            .entries(rooms)
            .filter(([_, name]) => name.endsWith(' [SAVE]'))
            .map(([key, value]) => [key, trimSave(value)])
        ])
        .filter(([_, rooms]) => rooms.length > 0)
        .map(([areaName, rooms]) => [
            String(areaName),
            typeof rooms === 'string' ?
                {[rooms]: '???'} :
                Object.fromEntries(rooms)
        ])
);

const flatRoomsMapping = Object.fromEntries(
    Object
        .entries(roomsMapping)
        .map(([_, rooms]) => Object.entries(rooms))
        .flat()
);

const saveRoomNames = Object
    .entries(roomsMappingOnlySaves)
    .map(([_, rooms]) => Object.keys(rooms))
    .flat();

const LocationEditor: React.FC<Props> = ({save}) => {
    const {data, dispatch} = useContext(SaveContext);
    const [onlySaves, setOnlySaves] = useState(true);
    const room = String(data[save].data.data['Save1'].data['room']);
    useEffect(() => {
        // Turn off "Show only SAVE locations" if the current room does not have
        // a SAVE.
        if (onlySaves && !saveRoomNames.includes(room)) {
            setOnlySaves(false);
        }
    }, [room, onlySaves]);
    const effectiveRoomsMapping = onlySaves ?
            roomsMappingOnlySaves :
            roomsMapping;
    const changeRoomsMapping = useCallback(
        (event: ChangeEvent<HTMLInputElement>) =>
            setOnlySaves(event.currentTarget.checked),
        []
    );
    const onChangeRoom = useCallback((value: string | number) => {
        const room = String(value);
        const newRoomName = trimSave(flatRoomsMapping[room]);
        dispatch({
            type: 'change',
            save,
            section: 'Save1',
            option: 'rmName',
            value: newRoomName
        });
        const newMapImage = new Image();
        newMapImage.addEventListener('load', e => {
            dispatch({
                type: 'change',
                save,
                section: 'Save1',
                option: 'pX',
                value: Math.floor(newMapImage.width / 2)
            });
            dispatch({
                type: 'change',
                save,
                section: 'Save1',
                option: 'pY',
                value: Math.floor(newMapImage.height / 2)
            });
        });
        newMapImage.src = `../rooms/${room}.png`;
    }, [dispatch, save]);
    return <>
        <SelectField
            save={save}
            section="Save1"
            option="room"
            label="Current room"
            mapping={effectiveRoomsMapping}
            onChange={onChangeRoom}
        />
        <p className="grid grid-cols-2 gap-4 mb-2">
            <label htmlFor="only-saves">Show only SAVE locations</label>
            <input
                type="checkbox"
                name="only-saves"
                id="only-saves"
                checked={onlySaves}
                onChange={changeRoomsMapping}
            ></input>
        </p>
        <RoomViewer save={save} section="Save1" roomOption="room" xOption="pX" yOption="pY" />
        <TextField save={save} section="Save1" option="rmName" label="Room name on the title screen" />
        <NumberField save={save} section="Save1" option="pX" label="X coordinate" />
        <NumberField save={save} section="Save1" option="pY" label="Y coordinate" />
    </>;
};

export default LocationEditor;
