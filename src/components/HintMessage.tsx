import { AnyElement } from "../util/types";

interface Props {
    children: AnyElement;
}

const HintMessage: React.FC<Props> = ({ children }) => 
    <p className="text-sm text-yellow-400">{children}</p>;

export default HintMessage;
