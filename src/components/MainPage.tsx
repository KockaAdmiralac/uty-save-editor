import React from 'react';
import Button from './Button';
import Footer from './Footer';
import HintMessage from './HintMessage';

const MainPage: React.FC = () => {
    return <main className="flex flex-col items-center justify-center min-h-screen md:ml-20 md:mr-20 lg:ml-80 lg:mr-80 max-sm:ml-4 max-sm:mr-4">
        <h1 className="text-4xl mb-8">Undertale Yellow Save Editor</h1>
        <p className="mb-4">Which save file would you like to edit?</p>
        <div className="grid grid-cols-2 gap-4 mb-4">
            <Button label="Save.sav" page="save" />
            <Button label="Save02.sav" page="save02" />
            <Button label="Controls.sav" page="controls" />
            <Button label="tempsave.sav" page="tempsave" />
        </div>
        <HintMessage>Not sure? You probably want Save.sav.</HintMessage>
        <Footer />
    </main>;
};

export default MainPage;
