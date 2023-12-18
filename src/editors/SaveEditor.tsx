import React, { useContext } from 'react';
import BackButton from '../components/BackButton';
import Button from '../components/Button';
import Section from '../controls/Section';
import NumberField from '../controls/NumberField';
import { SaveContext } from '../util/Context';
import Load from '../actions/Load';
import Download from '../actions/Download';

const SaveEditor: React.FC = () => {
    const {data} = useContext(SaveContext);
    return <main className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl mb-8">Save Editor</h1>
        {data.save.loaded ? <>
            <div className="flex gap-4 mb-8">
                <BackButton />
                <Download fileName="Save.sav" save="save" />
                <Button label="Save template" page="template-save" />
                <Button label="Load template" page="template-load" />
            </div>
            <Section name="Stats">
                <NumberField save="save" section="Save1" option="Gold" label="Gold" />
                <NumberField save="save" section="Save1" option="EXP" label="EXP" />
                <NumberField save="save" section="Save1" option="LV" label="LV" />
                <NumberField save="save" section="Save1" option="DFP" label="DF (Primary)" />
                <NumberField save="save" section="Save1" option="DFS" label="DF (Secondary)" />
                <NumberField save="save" section="Save1" option="AT - Primary" label="AT (Primary)" />
                <NumberField save="save" section="Save1" option="AT - Secondary" label="AT (Secondary)" />
                <NumberField save="save" section="Save1" option="MAXHP" label="Max HP" />
                <NumberField save="save" section="Save1" option="HP" label="Current HP" />
            </Section>
        </> : <Load fileName="Save.sav" save="save" />}
    </main>;
};

export default SaveEditor;
