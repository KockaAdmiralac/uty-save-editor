import React, { useCallback, useContext, useRef, useState } from 'react';
import Button from '../components/Button';
import { SaveContext } from '../util/Context';
import { stringifyIni } from '../util/ini';
import Modal from '../components/Modal';
import { SaveFileName } from '../util/save';
import ErrorMessage from '../components/ErrorMessage';

interface Props {
    fileName: string;
    save: SaveFileName;
}

const Download: React.FC<Props> = ({fileName, save}) => {
    const {data} = useContext(SaveContext);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [error, setError] = useState('');
    const downloadRef = useRef<HTMLAnchorElement>(null);
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
            downloadRef.current.download = fileName;
            downloadRef.current.click();
            URL.revokeObjectURL(blobUrl);
            setModalIsOpen(false);
        } catch (error: any) {
            setError(error.message);
        }
    }, [data, fileName, save]);
    return <>
        <Button label="Download" onClick={onModalOpen} />
        <Modal
            isOpen={modalIsOpen}
            setIsOpen={setModalIsOpen}
            title="Download file"
        >
            {/* TODO: Make this message better. */}
            <p>
                After downloading, place this file
                in <code>%LOCALAPPDATA%/Undertale_Yellow</code> on Windows
                or <code>~/.config/Undertale_Yellow</code> on Linux.
            </p>
            <ErrorMessage message={error} />
            <div className="flex justify-center mt-4">
                <Button label="Download" onClick={onDownload} />
                <a className="hidden" href="/" ref={downloadRef}>Placeholder</a>
            </div>
        </Modal>
    </>;
};

export default Download;
