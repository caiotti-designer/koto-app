import React, { useState } from 'react';

const TestModal: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="p-4">
      <button 
        onClick={() => setShowModal(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Open Test Modal
      </button>
      
      {showModal && (
        <div 
          className="fixed inset-0 bg-red-500 z-[9999] flex items-center justify-center"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 99999,
            backgroundColor: 'red'
          }}
          onClick={() => setShowModal(false)}
        >
          <div className="text-white text-4xl font-bold">
            TEST MODAL IS VISIBLE - CLICK TO CLOSE
          </div>
        </div>
      )}
    </div>
  );
};

export default TestModal;