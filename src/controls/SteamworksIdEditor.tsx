import { MouseEvent, SyntheticEvent, TouchEvent, useCallback, useContext, useEffect, useRef, useState } from "react";
import { SaveFileName } from "../util/save";
import { IniGrid } from "../util/ini";
import { SaveContext } from "../util/Context";

const WIDTH = 208;
const HEIGHT = 147;
const BRUSH_WIDTH = 3;
const BRUSH_HEIGHT = 3;

const COLORS = [
    [0,     0,      0,      0],
    [213,   222,    231,    255],
    [137,   163,    187,    255],
    [62,    55,     207,    255],
    [40,    195,    72,     255],
    [237,   221,    53,     255],
    [207,   34,     67,     255],
    [141,   37,     17,     255],
    [68,    6,      6,      255]
];

interface Props {
    save: SaveFileName;
    section: string;
    option: string;
}

interface ColorButtonProps {
    color: number;
    currentColor: number;
    setColor: (color: number) => void;
}

const ColorButton: React.FC<ColorButtonProps> = ({color, currentColor, setColor}) => {
    const selectColor = useCallback(() => setColor(color), [setColor, color]);
    const isSelected = currentColor === color;
    const [r, g, b, a] = COLORS[color];
    return <button
        style={{
            backgroundColor: `rgba(${r}, ${g}, ${b}, ${a})`
        }}
        className={`w-6 h-6 border-2 ${isSelected ?
            'border-yellow-400' :
            'border-white'
        }`}
        onClick={selectColor}
    />
};

const SteamworksIdEditor: React.FC<Props> = ({save, section, option}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const {data} = useContext(SaveContext);
    const grid = data[save].data.data[section]?.data[option] as IniGrid;
    const [color, setColor] = useState(0);
    const [drawing, setDrawing] = useState(false);
    const {dispatch} = useContext(SaveContext);
    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) {
            return;
        }
        const dataArray = Uint8ClampedArray
            .from(grid
                .map(row => row
                    .map(value => COLORS[Number(value.value)]))
                .flat(2));
        const imageData = new ImageData(dataArray, WIDTH, HEIGHT);
        ctx.putImageData(imageData, 0, 0);
    }, [grid]);
    const startDrawing = useCallback((e: SyntheticEvent) => {
        e.preventDefault();
        setDrawing(true);
    }, [setDrawing]);
    const stopDrawing = useCallback((e: SyntheticEvent) => {
        e.preventDefault();
        setDrawing(false);
    }, [setDrawing]);
    const moveCallback = useCallback((e: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>) => {
        if (!drawing) {
            return;
        }
        const rect = e.currentTarget.getBoundingClientRect();
        const clientX = ('touches' in e) ?
            e.touches[0].clientX :
            e.clientX;
        const clientY = ('touches' in e) ?
            e.touches[0].clientY :
            e.clientY;
        const x = Math.round(clientX - rect.left);
        const y = Math.round(clientY - rect.top);
        dispatch({
            type: 'draw',
            save,
            section,
            option,
            x,
            y,
            width: BRUSH_WIDTH,
            height: BRUSH_HEIGHT,
            color
        });
        if (!canvasRef.current) {
            return;
        }
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) {
            return;
        }
        if (color === 0) {
            ctx.save();
            ctx.globalCompositeOperation = 'destination-out';
            ctx.fillRect(x, y, BRUSH_WIDTH, BRUSH_HEIGHT);
            ctx.restore();
        } else {
            const [r, g, b, a] = COLORS[color];
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
            ctx.fillRect(x, y, BRUSH_WIDTH, BRUSH_HEIGHT);
        }
    }, [drawing, dispatch, save, section, option, color]);
    return <div className="flex flex-col justify-center items-center">
        <div className="flex gap-2 mb-2">{COLORS
            .map((_, idx) => <ColorButton
                key={idx}
                color={idx}
                currentColor={color}
                setColor={setColor}
            />)
        }</div>
        <div className="relative">
            <img
                src="../steamworks/id.png"
                width={WIDTH}
                height={HEIGHT}
                alt="Steamworks ID card template"
                className="select-none absolute"
            />
            <canvas
                width={WIDTH}
                height={HEIGHT}
                className="relative touch-none"
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={moveCallback}
                onMouseUp={stopDrawing}
                onMouseOut={stopDrawing}
                onTouchStart={startDrawing}
                onTouchEnd={stopDrawing}
                onTouchMove={moveCallback}
            />
        </div>
    </div>;
};

export default SteamworksIdEditor;
