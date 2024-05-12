import React, { useState } from 'react';
import Modal from './component/Components/Modal';
import FeedDemo from './component/Feed/FeedDemo';




const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="App">
      <button onClick={handleOpenModal} className="p-4 bg-blue-500 text-white">
        Open Modal
      </button>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default App;
