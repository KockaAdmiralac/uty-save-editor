import React, { useReducer } from 'react';
import MainPage from './MainPage';
import RoutingError from './RoutingError';
import {
    createBrowserRouter,
    RouterProvider,
} from 'react-router-dom';
import ControlsEditor from '../editors/ControlsEditor';
import Save02Editor from '../editors/Save02Editor';
import SaveEditor from '../editors/SaveEditor';
import TempSaveEditor from '../editors/TempSaveEditor';
import { contextReducer, emptySaves, SaveContext } from '../util/Context';

const App: React.FC = () => {
    const [data, dispatch] = useReducer(contextReducer, emptySaves);
    return <React.StrictMode>
        <SaveContext.Provider value={{ data, dispatch }}>
            <RouterProvider router={createBrowserRouter([
                {
                    path: '/',
                    element: <MainPage />,
                    errorElement: <RoutingError />
                },
                {
                    path: '/controls',
                    element: <ControlsEditor />
                },
                {
                    path: '/save02',
                    element: <Save02Editor />
                },
                {
                    path: '/save',
                    element: <SaveEditor />
                },
                {
                    path: '/tempsave',
                    element: <TempSaveEditor />
                }
            ])} />
        </SaveContext.Provider>
    </React.StrictMode>;

};

export default App;
