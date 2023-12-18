import React from 'react';
import {useNavigate} from 'react-router-dom';
import Button from './Button';

const BackButton: React.FC = () => {
    const navigate = useNavigate();
    return <Button label="Back" onClick={() => navigate(-1)} />;
};

export default BackButton;
