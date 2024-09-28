import React, { useState } from 'react';
import FloatingIcon from './FloatingIcon';
import Modal from './Modal';

interface AppProps {
    lastFocusedDiv: HTMLElement | null;
    onUnmount: () => void;
}

const  App: React.FC<AppProps> = ({lastFocusedDiv, onUnmount}) => {
    //basic logic for modal opening
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleClickIcon = () => {
        setIsModalOpen(true);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
        //unmounts the app on modal closing
        onUnmount();
    };

    return (
        <div>
            {!isModalOpen && (
                <FloatingIcon onClick={handleClickIcon} />
            )}
            {isModalOpen && <Modal lastFocusedDiv= {lastFocusedDiv} onClose={handleCloseModal}/>}
        </div>
    );
};

export default App;
