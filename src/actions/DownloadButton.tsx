import React, { useCallback, useContext, useRef, useState } from 'react';
import Button from '../components/Button';
import { SaveContext } from '../util/Context';
import { stringifyIni } from '../util/ini';
import Modal from '../components/Modal';
import { SaveFileName } from '../util/save';
import ErrorMessage from '../components/ErrorMessage';
import os from 'platform-detect/os.mjs';
import windowsMoveSaveFile from '../instructions/windows-move-save-file.png';
import windowsFindSaveFolder from '../instructions/windows-find-save-folder-2.png';
import pkg from '../../package.json';

const unknownOS = !os.linux && !os.windows;

interface Props {
    fileName: string;
    save: SaveFileName;
}

const DownloadButton: React.FC<Props> = ({fileName, save}) => {
    const {data} = useContext(SaveContext);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [error, setError] = useState('');
    const downloadRef = useRef<HTMLAnchorElement>(null);
    const osFileName = os.linux ? fileName.toLowerCase() : fileName;
    const onModalOpen = useCallback(() => {
        setModalIsOpen(true);
    }, [setModalIsOpen]);
    const onDownload = useCallback(() => {
        if (!downloadRef.current) {
            return;
        }
        try {
            const blob = new Blob([stringifyIni(data[save].data)]);
            const blobUrl = URL.createObjectURL(blob);
            downloadRef.current.href = blobUrl;
            downloadRef.current.click();
            URL.revokeObjectURL(blobUrl);
            setModalIsOpen(false);
        } catch (error: any) {
            setError(error.message);
        }
    }, [data, save]);
    return <>
        <Button label="Download" onClick={onModalOpen} />
        <Modal
            isOpen={modalIsOpen}
            setIsOpen={setModalIsOpen}
            title="Download file"
        >
            <p>
                Now that you're done editing, you can download your modified
                save file here.
            </p>
            {unknownOS && <p>
                You appear to use an operating system for which we don't have
                specific instructions on how the save files should be saved, so
                you're on your own for that. If you know where should save files
                be placed for Undertale Yellow on your operating system, let us
                know through <a href={pkg.bugs.url}>GitHub Issues</a>!
                For reference, on Windows the save files are located
                under <code>%LOCALAPPDATA%/Undertale_Yellow</code>, so you just
                press the Download button below and move the file you downloaded
                over there.
            </p>}
            {os.windows && <>
                <p>
                    You can apply your changes to the save file in the following
                    way:
                </p>
                <ol>
                    <li>
                        Click the 'Download' button below to download your
                        modified save file.
                    </li>
                    <li>Hit <kbd>Windows Button+R</kbd>.</li>
                    <li>
                        In the box that appears,
                        enter <code>%LOCALAPPDATA%/Undertale_Yellow</code> and
                        then hit OK, like in the following screenshot:
                        <img className="block" src={windowsFindSaveFolder} alt="Finding the save file folder on Windows." />
                    </li>
                    <li>
                        To the folder that appeared (shown right in the
                        screenshot) you can move the save file you downloaded
                        (shown left in the screenshot):
                        <img className="block" src={windowsMoveSaveFile} alt="Finding the save file file on Windows." />
                    </li>
                    <li>If asked to replace a file, you should replace it.</li>
                </ol>
            </>}
            {os.linux && <>
                <p>
                    If you're running the game by adding a GameMaker runner
                    executable, this is how you can apply your changes to the
                    save file:
                </p>
                <ol>
                    <li>
                        Click the 'Download' button below to download your
                        modified save file.
                    </li>
                    <li>Open your Home directory.</li>
                    <li>Turn the 'Show hidden files' option on.</li>
                    <li>Enter the <code>.config</code> folder.</li>
                    <li>Enter the <code>Undertale_Yellow</code> folder.</li>
                    <li>
                        Move the {osFileName} file from your downloads folder
                        to this folder you just opened, replacing any existing
                        save files in the process.
                    </li>
                </ol>
                <p>
                    If you're running the game with Wine, the directories you
                    should be entering are instead your Wine directory
                    (probably <code>~/.wine</code>), and
                    then <code>drive_c/users/(user)/Local Settings/Undertale_Yellow</code>.
                </p>
            </>}
            <ErrorMessage message={error} />
            <div className="flex justify-center mt-4">
                <Button label="Download" onClick={onDownload} />
                <a
                    className="hidden"
                    href="/"
                    ref={downloadRef}
                    download={osFileName}
                >Placeholder</a>
            </div>
        </Modal>
    </>;
};

export default DownloadButton;
