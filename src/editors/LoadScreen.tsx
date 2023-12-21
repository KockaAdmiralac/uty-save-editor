import LoadButton from "../actions/LoadButton";
import LoadTemplateButton from "../actions/LoadTemplateButton";
import BackButton from "../components/BackButton";
import { SaveFileName } from "../util/save";

interface Props {
    fileName: string;
    save: SaveFileName;
    showTemplate?: boolean;
}

const LoadScreen: React.FC<Props> = ({ fileName, save, showTemplate }) => {
    return <>
        <p className="mb-4">
            Save file {fileName} not loaded. You can either choose to load one
            of your own save files, or a template save file.
        </p>
        <div className="flex max-sm:flex-col gap-4">
            <LoadButton fileName={fileName} save={save} text="Load my save file" />
            {showTemplate && <LoadTemplateButton save={save} text="Load a template save" />}
            <BackButton />
        </div>
    </>;
};

export default LoadScreen;
