import { useCallback, useContext, useRef, useState } from "react";
import Button from "../components/Button";
import { parseIni } from "../util/ini";
import { SaveContext } from "../util/Context";
import Modal from "../components/Modal";
import { SaveFileName, identifySaveFile } from "../util/save";

interface Props {
    fileName: string;
    save: SaveFileName;
    text?: string;
}

function readFile(file: File): Promise<string> {
    const reader = new FileReader();
    reader.readAsText(file, 'utf-8');
    return new Promise(resolve => reader
        .addEventListener('load', e => resolve(String(e.target?.result))));
}

const LoadButton: React.FC<Props> = ({ fileName, save, text }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [error, setError] = useState<string>('');
    const loadRef = useRef<HTMLInputElement>(null);
    const {dispatch} = useContext(SaveContext);
    const onModalOpen = useCallback(() => {
        setModalIsOpen(true);
    }, [setModalIsOpen]);
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
            const fileType = identifySaveFile(value);
            if (fileType !== save) {
                throw new Error(`
                    You selected a wrong type of save file! The save file being
                    edited here is usually named ${fileName}. If you'd like to
                    edit a different type of save file, please go back to the
                    main screen and select the save file type you want to be
                    editing.
                `);
            }
            dispatch({
                type: 'load',
                save,
                value
            })
        } catch (error: any) {
            setError(error.message);
        }
    }, [loadRef, save, dispatch, fileName]);
    return <>
        <Button label={text || 'Load'} onClick={onModalOpen} />
        <Modal
            isOpen={modalIsOpen}
            setIsOpen={setModalIsOpen}
            title="Load save file"
        >
            <>
                {/* TODO: Make this message better. */}
                <p>
                    This option allows you to load your own save file from the
                    game and edit it.
                </p>
                <p>
                    Your save file is located
                    under <code>%LOCALAPPDATA%/Undertale_Yellow</code> on
                    Windows or <code>~/.config/Undertale_Yellow</code> on Linux.
                    Click the button below and select the
                    <code>{fileName}</code> file from that directory.
                </p>
                {error && <p className="text-red-600 text-lg">{error}</p>}
                <div className="flex justify-center mt-4">
                    <Button label="Load" onClick={onLoad} />
                    <input
                        type="file"
                        id="load-save"
                        name="load-save"
                        accept=".sav"
                        className="hidden"
                        ref={loadRef}
                        onChange={fileLoaded}
                    ></input>
                </div>
            </>
        </Modal>
    </>;
};

export default LoadButton;
