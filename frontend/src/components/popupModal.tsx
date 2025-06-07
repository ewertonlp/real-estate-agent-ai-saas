// frontend/src/components/ConfirmModal.tsx
import React from 'react';

interface popupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const PopupModal: React.FC<popupModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-card p-6 rounded-lg shadow-xl max-w-sm w-full relative border border-border">
        <h2 className="text-xl font-semibold text-text text-center mb-6">{title}</h2>
        <p className="text-text mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-card text-text rounded-md hover:bg-card-light transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupModal;