import HintMessage from "./HintMessage";

interface Props {
    message: string;
}

const ErrorMessage: React.FC<Props> = ({ message }) => <>
    {message && <p className="text-red-600 text-lg">{message}</p>}
    {message && <HintMessage>
        Confused about this error message? Leave a question
        on <a href="https://github.com/KockaAdmiralac/uty-save-editor/issues">GitHub
        Issues</a> with steps to reproduce your issue!
    </HintMessage>}
</>;

export default ErrorMessage;
