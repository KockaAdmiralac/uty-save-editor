import React, { useContext } from 'react';
import Footer from '../components/Footer';
import { SaveContext } from '../util/Context';
import LoadScreen from './LoadScreen';
import Section from '../controls/Section';
import NumberField from '../controls/NumberField';
import BooleanField from '../controls/BooleanField';
import DownloadButton from '../actions/DownloadButton';
import LoadButton from '../actions/LoadButton';
import BackButton from '../components/BackButton';

const Save02Editor: React.FC = () => {
    const {data} = useContext(SaveContext);
    return <main className="flex flex-col items-center justify-center min-h-screen md:ml-20 md:mr-20 lg:ml-80 lg:mr-80 max-sm:ml-4 max-sm:mr-4">
        <h1 className="text-4xl mb-8">Persistent Save (Save02) Editor</h1>
        {data.save02.loaded ? <>
            <p>
                This save file contains data that persists across resets, so
                there is not much to see here. Use the <em>Download</em> button
                when you're done editing. If you're looking for the editor of
                regular save files that get deleted after a reset, use
                the <em>Back</em> button and select <em>Save.sav</em>.
            </p>
            <div className="flex max-sm:flex-col gap-4 mb-8 justify-center w-full">
                <DownloadButton fileName="Save02.sav" save="save02" />
                <LoadButton fileName="Save02.sav" save="save02" />
                <BackButton />
            </div>
            <Section name="Flowey">
                <p>
                    Depending on the amount of introductions/fights he has
                    already done in previous playthroughs, Flowey has different
                    dialogue.
                </p>
                <NumberField save="save02" section="00" option="00" label="Flowey introduction count" />
                <NumberField save="save02" section="00" option="01" label="Flowey fight count" />
            </Section>
            <Section name="Routes">
                <p>
                    When one of these is set, the game loads the ending screen
                    allowing you to reset or exit the game. Resetting deletes
                    your save file (<code>Save.sav</code>), but not persistent
                    data (<code>Save02.sav</code>, the one you are editing now).
                </p>
                <BooleanField save="save02" section="00" option="02" label="Finished Pacifist" />
                <BooleanField save="save02" section="00" option="03" label="Finished Flawed Pacifist" />
                <BooleanField save="save02" section="00" option="04" label="Finished Genocide" />
            </Section>
            <Section name="Deaths">
                <p>
                    The "total death count" as saved in this save file is used
                    by Flowey near the end of the game, but it doesn't actually
                    represent the total death count due to a bug.
                </p>
                <NumberField save="save02" section="Deaths" option="00" label="Total death count" />
                <NumberField save="save02" section="Deaths" option="01" label="Death count against Decibat" />
                <NumberField save="save02" section="Deaths" option="02" label="Death count against Dalv" />
            </Section>
        </> :
        <LoadScreen fileName="Save02.sav" save="save02" />}
        <Footer />
    </main>;
};

export default Save02Editor;
