import React, { useContext } from 'react';
import BackButton from '../components/BackButton';
import Footer from '../components/Footer';
import { SaveContext } from '../util/Context';
import LoadScreen from './LoadScreen';
import DownloadButton from '../actions/DownloadButton';
import LoadButton from '../actions/LoadButton';
import Section from '../controls/Section';
import SliderField from '../controls/SliderField';
import BooleanField from '../controls/BooleanField';
import gamepadControls from '../mappings/gamepad.json';
import SelectField from '../controls/SelectField';
import TextField from '../controls/TextField';

const ControlsEditor: React.FC = () => {
    const {data} = useContext(SaveContext);
    return <main className="flex flex-col items-center justify-center min-h-screen md:ml-20 md:mr-20 lg:ml-80 lg:mr-80 max-sm:ml-4 max-sm:mr-4">
        <h1 className="text-4xl mb-8">Controls Editor</h1>
        {data.controls.loaded ? <>
            <p>
                This save file just stores configuration accessed from the
                Config screen. Once you're done editing, use
                the <em>Download</em> button.
            </p>
            <div className="flex max-sm:flex-col gap-4 mb-8 justify-center w-full">
                <DownloadButton fileName="Controls.sav" save="controls" />
                <LoadButton fileName="Controls.sav" save="controls" />
                <BackButton />
            </div>
            <Section name="Toggles">
                <SliderField min={0.01} max={0.99} step={0.01} save="controls" section="Controls" option="deadzone" label="Deadzone" />
                <BooleanField save="controls" section="Controls" option="autorun" label="Auto-Sprint" />
                <BooleanField save="controls" section="Controls" option="autoshoot" label="Auto-Fire" />
                <BooleanField save="controls" section="Controls" option="autorhythm" label="Auto-Rhythm" />
                <BooleanField save="controls" section="Controls" option="screenshake" label="Shake on hurt" />
                <BooleanField save="controls" section="Controls" option="retry" label="Always allow retry" />
                <BooleanField save="controls" section="Controls" option="easymode" label="Easy Mode" />
            </Section>
            <Section name="Controls">
                <SelectField save="controls" section="Controls" option="Z" label="CONFIRM gamepad button" mapping={gamepadControls} isNumber={true} />
                <SelectField save="controls" section="Controls" option="X" label="CANCEL gamepad button" mapping={gamepadControls} isNumber={true} />
                <SelectField save="controls" section="Controls" option="C" label="MENU gamepad button" mapping={gamepadControls} isNumber={true} />
            </Section>
            <Section name="Other">
                <p>
                    These option represent text that appears next to button
                    controls on the Joystick Config screen. You can change them
                    for the lols if you want. The CONFIRM and CANCEL lines will
                    have ", RB" and ", LB" appended to them, respectively.
                </p>
                <TextField save="controls" section="ControlsNameIgnore" option="Z" label="Text for CONFIRM" />
                <TextField save="controls" section="ControlsNameIgnore" option="X" label="Text for CANCEL" />
                <TextField save="controls" section="ControlsNameIgnore" option="C" label="Text for MENU" />
            </Section>
        </> : <LoadScreen fileName="Controls.sav" save="controls" />}
        <Footer />
    </main>;
};

export default ControlsEditor;
