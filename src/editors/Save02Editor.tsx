import React from 'react';
import BackButton from '../components/BackButton';
import Footer from '../components/Footer';

const Save02Editor: React.FC = () => {
    return <main className="flex flex-col items-center justify-center min-h-screen md:ml-20 md:mr-20 lg:ml-80 lg:mr-80 max-sm:ml-4 max-sm:mr-4">
        <h1 className="text-4xl mb-8">Persistent Save (Save02) Editor</h1>
        <p className="mb-4">Work in progress.</p>
        <BackButton />
        <Footer />
    </main>;
};

export default Save02Editor;
