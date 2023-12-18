import React from "react";

interface Props {
    title: string;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    children: React.ReactElement;
}

const Modal: React.FC<Props> = ({title, isOpen, setIsOpen, children}) => {
    return isOpen ? <>
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
                <div className="relative flex flex-col w-full bg-black outline-none focus:outline-none border-white border-2">
                    <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                        <h3 className="text-3xl font-semibold">{title}</h3>
                        <button
                            className="ml-auto text-3xl leading-none"
                            onClick={() => setIsOpen(false)}
                        >
                            <span className="h-6 w-6 block text-red-600">×</span>
                        </button>
                    </div>
                    <div className="relative p-6 flex-auto">{children}</div>
                </div>
            </div>
        </div>
        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </> : null;
}

export default Modal;
