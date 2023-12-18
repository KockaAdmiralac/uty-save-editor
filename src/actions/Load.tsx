import { useCallback, useContext, useRef, useState } from "react";
import BackButton from "../components/BackButton";
import Button from "../components/Button";
import { parseIni } from "../util/ini";
import { SaveContext, SaveFileName } from "../util/Context";

interface Props {
    fileName: string;
    save: SaveFileName;
}

function readFile(file: File): Promise<string> {
    const reader = new FileReader();
    reader.readAsText(file, 'utf-8');
    return new Promise(resolve => reader
        .addEventListener('load', e => resolve(String(e.target?.result))));
}

const Load: React.FC<Props> = ({ fileName, save }) => {
    const loadRef = useRef<HTMLInputElement>(null);
    const {dispatch} = useContext(SaveContext);
    const [error, setError] = useState<string>('');
    const onLoad = useCallback(() => {
        loadRef.current?.click();
    }, [loadRef]);
    const fileLoaded = useCallback(async () => {
        if (
            !loadRef.current ||
            !loadRef.current.files ||
            !loadRef.current.files[0]
        ) {
            return;
        }
        const file = loadRef.current.files[0];
        const contents = await readFile(file);
        try {
            const value = parseIni(contents);
            dispatch({
                type: 'load',
                save,
                value
            })
        } catch (error: any) {
            setError(error.message);
        }
    }, [loadRef, save, dispatch]);
    return <>
        <p>Save file {fileName} not loaded.</p>
        {error && <p className="text-red-600 text-lg">{error}</p>}
        <div className="flex gap-4">
            <Button label="Load my save file" onClick={onLoad} />
            <Button label="Load a template save" page="template-load" />
            <BackButton />
        </div>
        <input
            type="file"
            id="load-save"
            name="load-save"
            accept=".sav"
            className="hidden"
            ref={loadRef}
            onChange={fileLoaded}
        ></input>
    </>;
};

export default Load;
