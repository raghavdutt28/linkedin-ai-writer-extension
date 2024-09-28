import React, { useEffect, useRef } from 'react';

interface ModalProps {
    onClose: () => void;
    lastFocusedDiv: HTMLElement | null;
}

//for last sent prompt and its reply
interface AiSuggestion {
    prompt: string;
    reply: string;
}

const Modal: React.FC<ModalProps> = ({ lastFocusedDiv, onClose }) => {
    const [inputValue, setInputValue] = useState("");
    //only storing last Ai Suggestion
    const [promptHistory, setPromptHistory] = useState<AiSuggestion>({ prompt: "", reply: "" });
    // Incase we choose some external tool to manipulate with core colors.
    const [primaryColor, setprimaryColor] = useState('#3B82F6');
    const [secondaryColor, setSecondaryColor] = useState('#DBEAFE');


    const handleBackgroundClick = (event: React.MouseEvent<HTMLDivElement>) => {
        // Closes modal only if the click is on the background
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    const handleGenerate = () => {

        if (inputValue) {
            //placeholder for now, we might send req to backend later as mentioned.
            const outputValue = "Thank you for the opportunity! If you have any more questions or if there's anything else I can help you with, feel free to ask.";
            setPromptHistory({ prompt: inputValue, reply: outputValue });
            setInputValue("");
        } else {
            alert("Please enter a prompt");
        }
    };

    const handleInsert = () => {
        //since it is just for linkedin using the target element directly.
        if (lastFocusedDiv) {
            const pTag = lastFocusedDiv.querySelector('p');
            if (pTag) {
                pTag.textContent = promptHistory.reply || '';
            }
        }
        //handling linkedin's placeholder logic
        const parentOfLastFocusedDiv = lastFocusedDiv?.parentElement;
        if (parentOfLastFocusedDiv) {
            const placeholderDiv = parentOfLastFocusedDiv.querySelector('.msg-form__placeholder');
            if (placeholderDiv) {
                placeholderDiv.classList.remove('msg-form__placeholder');
            }
        }

        onClose();
    }



    return (
        <div onClick={handleBackgroundClick} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 transition duration-300 ease-in-out">
            <div className="bg-white flex flex-col p-6 rounded-2xl shadow-lg gap-6 w-full max-w-screen-sm m-4 transition duration-300 ease-in-out">
                {promptHistory.prompt ? (
                    <div className="space-y-4">
                        <div className='space-y-4 max-h-60 overflow-y-auto'>
                            <div className="space-y-4">
                                <div className="flex justify-end">
                                    <div className="bg-gray-100 text-gray-500 p-4 rounded-xl max-w-2xl w-full">
                                        {promptHistory.prompt}
                                    </div>
                                </div>
                                <div className="flex justify-start">
                                    <div style={{ backgroundColor: secondaryColor }} className="text-gray-500 p-4 rounded-xl max-w-2xl">
                                        {promptHistory.reply}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <input
                            type="text"
                            placeholder='Your prompt'
                            className='border border-gray-200 placeholder-gray-300 rounded-lg mt-2 w-full p-2 text-gray-500'
                            value={inputValue}
                            onChange={(e) => { setInputValue(e.target.value) }}
                        />
                        {/* Input field after submitting */}

                        <div className="flex justify-end gap-6">
                            <button
                                onClick={handleInsert}
                                className="w-min px-6 py-3 gap-3 text-gray-500 border-2 border-gray-500 rounded-lg flex items-center text-2xl"
                            >
                                <svg className='w-auto h-6' viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.1 12.3666V1.43331C6.1 1.05553 6.228 0.739087 6.484 0.483976C6.74 0.228865 7.05644 0.100864 7.43333 0.0999756C7.81111 0.0999756 8.128 0.227976 8.384 0.483976C8.64 0.739976 8.76756 1.05642 8.76667 1.43331V12.3666L12.6333 8.49998C12.8778 8.25553 13.1889 8.13331 13.5667 8.13331C13.9444 8.13331 14.2556 8.25553 14.5 8.49998C14.7444 8.74442 14.8667 9.05553 14.8667 9.43331C14.8667 9.81109 14.7444 10.1222 14.5 10.3666L8.36667 16.5C8.1 16.7666 7.78889 16.9 7.43333 16.9C7.07778 16.9 6.76667 16.7666 6.5 16.5L0.366666 10.3666C0.122222 10.1222 0 9.81109 0 9.43331C0 9.05553 0.122222 8.74442 0.366666 8.49998C0.611111 8.25553 0.922222 8.13331 1.3 8.13331C1.67778 8.13331 1.98889 8.25553 2.23333 8.49998L6.1 12.3666Z" fill="#666D80" />
                                </svg>
                                Insert
                            </button>
                            <button
                                onClick={handleGenerate}
                                style={{ backgroundColor: primaryColor }}
                                className="w-min px-6 py-3 gap-3 text-white rounded-lg flex items-center text-2xl"
                            >
                                <svg className='w-auto h-6' viewBox="0 0 17 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.5 3.24541V0L4.25 4.32724L8.5 8.65459V5.40903C12.006 5.40903 14.875 8.32995 14.875 11.9C14.875 12.9818 14.6094 14.0098 14.131 14.929L15.6719 16.4978C16.5217 15.1454 17 13.5766 17 11.9C17 7.14005 13.1749 3.24541 8.5 3.24541ZM8.5 18.391C4.9937 18.391 2.125 15.4698 2.125 11.9C2.125 10.8182 2.39062 9.79046 2.8687 8.87081L1.32812 7.30224C0.478072 8.60041 0 10.2232 0 11.9C0 16.6599 3.82511 20.5546 8.5 20.5546V23.8L12.75 19.4728L8.5 15.1454V18.391Z" fill="white" />
                                </svg>

                                Regenerate
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Input field before submitting */}
                        <input
                            type="text"
                            placeholder='Your prompt'
                            className="border border-gray-200 placeholder-gray-300 rounded-lg mt-2 w-full p-2"
                            value={inputValue}
                            onChange={(e) => { setInputValue(e.target.value) }}
                        />
                        <button
                            onClick={handleGenerate}
                            style={{ backgroundColor: primaryColor }}
                            className="ml-auto w-min px-6 py-3 gap-3 text-white rounded-lg flex items-center text-2xl"
                        >
                            <svg className='w-auto h-6' viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M24.456 11.6075L2.45599 0.607504C2.28356 0.521271 2.08988 0.486719 1.89827 0.508009C1.70665 0.529299 1.52528 0.605523 1.37599 0.727504C1.23341 0.846997 1.12699 1.00389 1.0687 1.18055C1.0104 1.35721 1.00254 1.54662 1.04599 1.7275L4.00599 12.4975L1.00599 23.2375C0.965214 23.3886 0.960455 23.5471 0.992092 23.7003C1.02373 23.8535 1.09088 23.9972 1.18815 24.1198C1.28541 24.2423 1.41008 24.3403 1.55212 24.4059C1.69416 24.4715 1.84962 24.5029 2.00599 24.4975C2.16253 24.4966 2.31667 24.4589 2.45599 24.3875L24.456 13.3875C24.6198 13.3036 24.7573 13.1761 24.8532 13.0191C24.9492 12.862 25 12.6816 25 12.4975C25 12.3135 24.9492 12.133 24.8532 11.9759C24.7573 11.8189 24.6198 11.6914 24.456 11.6075ZM3.55599 21.6075L5.76599 13.4975H15.006V11.4975H5.76599L3.55599 3.3875L21.766 12.4975L3.55599 21.6075Z" fill="white" />
                            </svg>

                            Generate
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};


export default Modal;