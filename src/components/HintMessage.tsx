interface Props {
    children: React.ReactElement | string;
}

const HintMessage: React.FC<Props> = ({ children }) => 
    <p className="text-sm text-yellow-400">{children}</p>;

export default HintMessage;
