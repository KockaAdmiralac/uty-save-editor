import { ChangeEvent, MouseEvent, useCallback, useContext, useEffect, useState } from "react";
import Button from "../components/Button";
import {SaveContext} from "../util/Context";
import {SaveFileName} from "../util/save";
import Modal from "../components/Modal";
import builtinTemplates from '../mappings/templates.json';
import { IniFile, parseIni } from "../util/ini";

interface Props {
    save: SaveFileName;
    text?: string;
}

function addSworksId(file: IniFile) {
    return {
        ...file,
        data: {
            ...file.data,
            SworksFlags: {
                data: {
                    sworks_id: Array(147)
                        .fill([])
                        .map(() => Array(208)
                            .fill({})
                            .map(() => ({
                                type: 0,
                                value: 0
                            }))),
                    ...file.data.SworksFlags.data
                },
                order: [
                    'sworks_id',
                    ...file.data.SworksFlags.order
                ]
            }
        }
    };
}

async function fetchBuiltinTemplate(save: SaveFileName, template: string): Promise<IniFile> {
    const response = await fetch(`../saves/${save}/${template}.sav`);
    const iniText = await response.text();
    const value = parseIni(iniText);
    return value;
}

const LoadTemplateButton: React.FC<Props> = ({ save, text }) => {
    const [error, setError] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [selectedIsBuiltin, setSelectedIsBuiltin] = useState(true);
    const [userTemplates, setUserTemplates] = useState<Record<string, IniFile>>({});
    const {dispatch} = useContext(SaveContext);
    const onModalOpen = useCallback(() => {
        setModalIsOpen(true);
    }, [setModalIsOpen]);
    const onChangeTemplate = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        if (e.currentTarget.checked) {
            setSelectedTemplate(e.currentTarget.value);
            setSelectedIsBuiltin(e.currentTarget.id.includes('-builtin-'));
        }
    }, [setSelectedTemplate, setSelectedIsBuiltin]);
    const onSelect = useCallback(async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!selectedTemplate) {
            setError('Select a template first!');
        }
        try {
            const value = selectedIsBuiltin ?
                (await fetchBuiltinTemplate(save, selectedTemplate)) :
                userTemplates[selectedTemplate];
            dispatch({
                type: 'load',
                save,
                value
            });
            setModalIsOpen(false);
        } catch (error: any) {
            setError(error.message);
        }
    }, [save, selectedTemplate, dispatch, userTemplates, selectedIsBuiltin]);
    const builtins = builtinTemplates[save];
    useEffect(() => {
        const allUserTemplates = JSON.parse(localStorage.getItem('user-templates') || '{}');
        const saveUserTemplates = Object.entries(allUserTemplates[save] || {})
            .map(([name, file]) => [name, addSworksId(file as IniFile)]);
        setUserTemplates(Object.fromEntries(saveUserTemplates));
    }, [save, modalIsOpen]);
    return <>
        <Button label={text || 'Load template'} onClick={onModalOpen} />
        <Modal
            isOpen={modalIsOpen}
            setIsOpen={setModalIsOpen}
            title="Load a template save"
        >
            <>
                {/* TODO: Make this message better. */}
                <p>
                    You can select one of the template save files from below to
                    start editing from.
                </p>
                <p className="text-red-500">{error}</p>
                <form className="flex flex-col w-1/2 m-auto justify-center mt-4">
                    <ul className="mb-4">
                        {builtins.map((tmpl, idx) =>
                            <li key={`builtin-${idx}`}>
                                <input
                                    type="radio"
                                    name="load-template-select"
                                    id={`load-template-select-builtin-${idx}`}
                                    value={tmpl}
                                    className="mr-2"
                                    onChange={onChangeTemplate}
                                ></input>
                                <label htmlFor={`load-template-select-builtin-${idx}`}>{tmpl}</label>
                            </li>)
                        }
                        {Object.keys(userTemplates).map((tmpl, idx) =>
                            <li key={`user-${idx}`}>
                                <input
                                    type="radio"
                                    name="load-template-select"
                                    id={`load-template-select-user-${idx}`}
                                    value={tmpl}
                                    className="mr-2"
                                    onChange={onChangeTemplate}
                                ></input>
                                <label htmlFor={`load-template-select-user-${idx}`}>{tmpl}</label>
                            </li>)}
                    </ul>
                    <Button label="Select template" onClick={onSelect} />
                </form>
            </>
        </Modal>
    </>;
};

export default LoadTemplateButton;
