import React, {MouseEvent} from 'react';
import {Link} from 'react-router-dom';

type ButtonProps = {
    label: string;
    page: string;
} | {
    label: string;
    onClick: (e: MouseEvent<HTMLButtonElement>) => void
};

const Button: React.FC<ButtonProps> = (props) => {
    if ('page' in props) {
        return <Link
            className="text-white hover:text-yellow-400 py-3 border-white hover:border-yellow-400 border-8 px-6 text-center no-underline"
            to={props.page}
        >{props.label}</Link>;
    } else {
        return <button
            type="button"
            className="text-white hover:text-yellow-400 py-3 border-white hover:border-yellow-400 border-8 px-6 text-center"
            onClick={props.onClick}    
        >{props.label}</button>
    }
};

export default Button;
