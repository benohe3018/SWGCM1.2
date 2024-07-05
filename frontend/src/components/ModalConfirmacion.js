import React from 'react';
import './ModalConfirmacion.css';

const ModalConfirmacion = ({ isOpen, onClose, onConfirm, mensaje }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Confirmación</h2>
        <p>{mensaje}</p>
        <div className="modal-actions">
          <button onClick={onConfirm} className="confirm-button">Confirmar</button>
          <button onClick={onClose} className="cancel-button">Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmacion;