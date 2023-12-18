import { useRouteError } from "react-router-dom";
import BackButton from "./BackButton";

export default function RoutingError() {
    const error = useRouteError();
    console.error(error);
    const errorMessage = (typeof error === 'object' && error && 'data' in error) ?
        String(error.data) :
        String(error);

    return <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl mb-8">Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p className="mb-4"><em>{errorMessage}</em></p>
        <p><BackButton /></p>
    </div>;
}
