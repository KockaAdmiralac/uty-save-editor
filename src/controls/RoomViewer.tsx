import {KeyboardEvent, MouseEvent, SyntheticEvent, TouchEvent, useCallback, useContext, useRef, useState} from 'react';
import {SaveContext} from '../util/Context';
import {SaveFileName} from '../util/save';

interface Props {
    save: SaveFileName;
    section: string;
    roomOption: string;
    xOption: string;
    yOption: string;
};

const RoomViewer: React.FC<Props> = ({save, section, roomOption, xOption, yOption}) => {
    const {data, dispatch} = useContext(SaveContext);
    const [moving, setMoving] = useState(false);
    const [prevTouchX, setPrevTouchX] = useState(0);
    const [prevTouchY, setPrevTouchY] = useState(0);
    const imgRef = useRef<HTMLImageElement>(null);
    const room = data[save].data.data[section]?.data[roomOption];
    const x = data[save].data.data[section]?.data[xOption];
    const y = data[save].data.data[section]?.data[yOption];
    const startMoving = useCallback((e: SyntheticEvent) => {
        e.preventDefault();
        imgRef.current?.focus();
        setMoving(true);
    }, [setMoving]);
    const stopMoving = useCallback((e: SyntheticEvent) => {
        e.preventDefault();
        setMoving(false);
        setPrevTouchX(0);
        setPrevTouchY(0);
    }, [setMoving]);
    const changeXY = useCallback((dx: number, dy: number) => {
        if (dx) {
            dispatch({
                type: 'change',
                save,
                section,
                option: xOption,
                value: Number(x) + dx
            });
        }
        if (dy) {
            dispatch({
                type: 'change',
                save,
                section,
                option: yOption,
                value: Number(y) + dy
            });
        }
    }, [dispatch, save, section, x, y, xOption, yOption]);
    const moveCallback = useCallback((e: MouseEvent<HTMLImageElement>) => {
        if (moving) {
            changeXY(-e.movementX, -e.movementY);
        }
    }, [moving, changeXY]);
    const touchMoveCallback = useCallback((e: TouchEvent<HTMLImageElement>) => {
        if (e.touches.length !== 1) {
            return;
        }
        const {pageX: touchX, pageY: touchY} = e.touches[0];
        if (prevTouchX && prevTouchY) {
            const dx = Math.round(touchX - prevTouchX);
            const dy = Math.round(touchY - prevTouchY);
            changeXY(-dx, -dy);
        }
        setPrevTouchX(touchX);
        setPrevTouchY(touchY);
    }, [changeXY, prevTouchX, prevTouchY]);
    const keyCallback = useCallback((e: KeyboardEvent<HTMLImageElement>) => {
        if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) {
            return;
        }
        e.preventDefault();
        switch (e.key) {
            case 'ArrowRight':
                changeXY(20, 0);
                break;
            case 'ArrowLeft':
                changeXY(-20, 0);
                break;
            case 'ArrowUp':
                changeXY(0, -20);
                break;
            case 'ArrowDown':
                changeXY(0, 20);
                break;
        }
    }, [changeXY]);
    return <div className="flex flex-col justify-center items-center">
        <h3 className="text-xl">Drag the map (or click and use arrow buttons) to change location!</h3>
        <div className="w-[640px] h-[480px] max-w-full overflow-hidden mb-4 relative flex items-center justify-center">
            <img
                src={`../rooms/${room}.png`}
                alt={`Map of the room ${room}.`}
                className="max-w-fit absolute touch-none"
                style={{
                    'left': -x + 320,
                    'top': -y + 240
                }}
                tabIndex={0}
                onMouseDown={startMoving}
                onMouseMove={moveCallback}
                onMouseUp={stopMoving}
                onMouseOut={stopMoving}
                onTouchEnd={stopMoving}
                onTouchMove={touchMoveCallback}
                onKeyDown={keyCallback}
                ref={imgRef}
            />
            <div
                className="text-red-400 text-4xl select-none z-10"
            >&times;</div>
        </div>
    </div>;
};

export default RoomViewer;
