import React from 'react';
import BackButton from '../components/BackButton';

const ControlsEditor: React.FC = () => {
    return <main className="flex flex-col items-center justify-center min-h-screen md:ml-20 md:mr-20 lg:ml-80 lg:mr-80 max-sm:ml-4 max-sm:mr-4">
        <h1 className="text-4xl mb-8">Controls Editor</h1>
        <p className="mb-4">Work in progress.</p>
        <BackButton />
    </main>;
};

export default ControlsEditor;
