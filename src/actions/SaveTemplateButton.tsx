import {ChangeEvent, MouseEvent, useCallback, useContext, useState} from "react";
import Button from "../components/Button";
import {SaveFileName} from "../util/save";
import Modal from "../components/Modal";
import { SaveContext } from "../util/Context";

interface Props {
    save: SaveFileName;
    text?: string;
}

const SaveTemplateButton: React.FC<Props> = ({ save, text }) => {
    const [error, setError] = useState('');
    const [templateName, setTemplateName] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const {data} = useContext(SaveContext);
    const onModalOpen = useCallback(() => {
        setModalIsOpen(true);
    }, [setModalIsOpen]);
    const onChangeTemplateName = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setTemplateName(e.currentTarget.value);
    }, [setTemplateName]);
    const onSave = useCallback((e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try {
            const allUserTemplates = JSON.parse(localStorage.getItem('user-templates') || '{}');
            allUserTemplates[save] = allUserTemplates[save] || {};
            allUserTemplates[save][templateName] = data[save].data;
            localStorage.setItem('user-templates', JSON.stringify(allUserTemplates));
            setModalIsOpen(false);
        } catch (error: any) {
            if (error instanceof DOMException) {
                // TODO: Allow users to delete their templates.
                setError('Exceeded quota for user templates!');
            } else {
                setError(error.message);
            }
        }
    }, [data, save, templateName]);
    return <>
        <Button label={text || 'Save template'} onClick={onModalOpen} />
        <Modal
            isOpen={modalIsOpen}
            setIsOpen={setModalIsOpen}
            title="Save as a template"
        >
            <>
                {/* TODO: Make this message better. */}
                <p>
                    You can select one of the template save files from below to
                    start editing from.
                </p>
                <p className="text-red-500">{error}</p>
                <form className="flex flex-col w-1/2 m-auto justify-center mt-4">
                    <input
                        type="text"
                        name="save-template-name"
                        id="save-template-name"
                        onChange={onChangeTemplateName}
                        className="mb-4 text-black"
                    ></input>
                    <Button label="Save template" onClick={onSave} />
                </form>
            </>
        </Modal>
    </>;
};

export default SaveTemplateButton;
