import React, { useCallback, useContext, useRef, useState } from 'react';
import Button from '../components/Button';
import { SaveContext, SaveFileName } from '../util/Context';
import { stringifyIni } from '../util/ini';
import Modal from '../components/Modal';

interface Props {
    fileName: string;
    save: SaveFileName;
}

const Download: React.FC<Props> = ({fileName, save}) => {
    const {data} = useContext(SaveContext);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const downloadRef = useRef<HTMLAnchorElement>(null);
    const onModalOpen = useCallback(() => {
        setModalIsOpen(true);
    }, [setModalIsOpen]);
    const onDownload = useCallback(() => {
        if (!downloadRef.current) {
            return;
        }
        const blob = new Blob([stringifyIni(data[save].data)]);
        const blobUrl = URL.createObjectURL(blob);
        downloadRef.current.href = blobUrl;
        downloadRef.current.download = fileName;
        downloadRef.current.click();
        URL.revokeObjectURL(blobUrl);
    }, [data, fileName, save]);
    return <>
        <Button label="Download" onClick={onModalOpen} />
        <Modal
            isOpen={modalIsOpen}
            setIsOpen={setModalIsOpen}
            title="Download file"
        >
            <>
                {/* TODO: Make this message better. */}
                <p>
                    After downloading, place this file in
                    <code>%LOCALAPPDATA%/Undertale_Yellow</code> on Windows
                    or <code>~/.config/Undertale_Yellow</code> on Linux.
                </p>
                <div className="flex justify-center mt-4">
                    <Button label="Download" onClick={onDownload} />
                    <a className="hidden" href="/" ref={downloadRef}>Placeholder</a>
                </div>
            </>
        </Modal>
    </>;
};

export default Download;
