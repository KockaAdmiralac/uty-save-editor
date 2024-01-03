import { useCallback, useContext, useRef, useState } from "react";
import Button from "../components/Button";
import { parseIni } from "../util/ini";
import { SaveContext } from "../util/Context";
import Modal from "../components/Modal";
import { SaveFileName, identifySaveFile } from "../util/save";
import ErrorMessage from "../components/ErrorMessage";
import os from 'platform-detect/os.mjs';
import windowsFindSaveFile from '../instructions/windows-find-save-file.png';
import windowsFindSaveFolder from '../instructions/windows-find-save-folder.png';

const unknownOS = !os.linux && !os.windows;

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
    const [error, setError] = useState('');
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
            });
            setModalIsOpen(false);
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
            {/* TODO: Make this message better. */}
            <p>
                This option allows you to load your own save file from the
                game and edit it.
            </p>
            {unknownOS && <p>
                You appear to use an operating system for which we don't have
                specific instructions on how the save files should be loaded, so
                you're on your own for that. If you know where should save files
                be placed for Undertale Yellow on your operating system, let us
                know through <a href="https://github.com/KockaAdmiralac/uty-save-editor/issues">GitHub Issues</a>!
                For reference, on Windows the save files are located
                under <code>%LOCALAPPDATA%/Undertale_Yellow</code> and the file
                you need to load here is <code>{fileName}</code>.
            </p>}
            {os.windows && <p>
                You can find your save file in the following way:
                <ol>
                    <li>Click the 'Load' button below.</li>
                    <li>
                        Enter <code>%LOCALAPPDATA%/Undertale_Yellow</code> into
                        the file path box, like in the following screenshot:
                        <img className="block" src={windowsFindSaveFolder} alt="Finding the save file folder on Windows." />
                    </li>
                    <li>
                        Hit Enter and you will arrive in the folder with all
                        your save files:
                        <img className="block" src={windowsFindSaveFile} alt="Finding the save file file on Windows." />
                    </li>
                    <li>Pick the one named <code>{fileName}</code>.</li>
                </ol>
            </p>}
            {os.linux && <p>
                If you're running the game by adding a GameMaker runner
                executable, you can find your save file in the following way:
                <ol>
                    <li>Click the 'Load' button below.</li>
                    <li>Navigate to your Home directory.</li>
                    <li>Turn the 'Show hidden files' option on.</li>
                    <li>Enter the <code>.config</code> folder.</li>
                    <li>Enter the <code>Undertale_Yellow</code> folder.</li>
                    <li>
                        Select the <code>{fileName.toLowerCase()}</code> file.
                    </li>
                </ol>
            </p>}
            {os.linux && <p>
                If you're running the game with Wine, the directories you should
                be entering are instead your Wine directory
                (probably <code>~/.wine</code>), and
                then <code>drive_c/users/(user)/Local Settings/Undertale_Yellow</code>.
            </p>}
            <ErrorMessage message={error} />
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
        </Modal>
    </>;
};

export default LoadButton;
