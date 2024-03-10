import {useCallback, useContext, useEffect, useState} from "react";
import Button from "../components/Button";
import {SaveContext} from "../util/Context";
import Modal from "../components/Modal";
import {checkAxisBroken} from "../util/save";

const ENCOUNTERS = [
    'jandroid',
    'jandroid duo',
    'goosic',
    'jandroid goosic duo',
    'tellyvis'
];

const AxisFixer: React.FC = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [doNothing, setDoNothing] = useState(false);
    const {data, dispatch} = useContext(SaveContext);
    useEffect(() => {
        if (!doNothing && data.save.loaded && checkAxisBroken(data.save.data)) {
            setModalIsOpen(true);
        }
    }, [data.save, doNothing]);
    const onDoNothing = useCallback(() => {
        setModalIsOpen(false);
        setDoNothing(true);
    }, [setDoNothing, setModalIsOpen]);
    const onReEnable = useCallback(() => {
        for (const encounter of ENCOUNTERS) {
            dispatch({
                type: 'add',
                save: 'save',
                section: 'Encounters',
                option: '0',
                value: encounter
            });
        }
        setModalIsOpen(false);
    }, [dispatch]);
    const onFulfillKillCount = useCallback(() => {
        dispatch({
            type: 'change',
            save: 'save',
            section: 'Kills',
            option: '4',
            value: 0
        });
        dispatch({
            type: 'change',
            save: 'save',
            section: 'GenoComplete',
            option: '4',
            value: 1
        });
        setModalIsOpen(false);
    }, [dispatch]);
    return <>
        <Modal
            isOpen={modalIsOpen}
            setIsOpen={setModalIsOpen}
            title="Detected Axis breakage!"
        >
            <p>
                We detected that your save file is on the Genocide Route, but
                all encounters have been disabled due to entering the room with
                the robot control panel in the Steamworks. Don't worry! This
                save editor can help you fix the issue, by picking one of the
                following actions:
            </p>
            <ul>
                <li>
                    <strong>Enable encounters:</strong> Re-enables
                    encounters in the Steamworks rooms which have them, so
                    that you can easily go back
                    and <span className="text-red-600">kill some monsters.</span>
                </li>
                <li>
                    <strong>Fulfill kill count:</strong> Just makes the game
                    think you killed all the robots, so you can
                    just <span className="text-red-600">proceed.</span>
                </li>
            </ul>
            <p>
                After choosing either option, use the <em>Download</em> button
                to download your new save file.
            </p>
            <div className="flex justify-between mt-4">
                <Button label="Enable encounters" onClick={onReEnable} />
                <Button label="Fulfill kill count" onClick={onFulfillKillCount} />
                <Button label="Do nothing" onClick={onDoNothing} />
            </div>
        </Modal>
    </>;
};

export default AxisFixer;
