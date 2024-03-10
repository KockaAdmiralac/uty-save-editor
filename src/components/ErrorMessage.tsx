import HintMessage from "./HintMessage";
import pkg from '../../package.json';

interface Props {
    message: string;
}

const ErrorMessage: React.FC<Props> = ({ message }) => <>
    {message && <p className="text-red-600 text-lg">{message}</p>}
    {message && <HintMessage>
        Confused about this error message? Leave a question
        on <a href={pkg.bugs.url}>GitHub Issues</a> with steps to reproduce your
        issue!
    </HintMessage>}
</>;

export default ErrorMessage;
