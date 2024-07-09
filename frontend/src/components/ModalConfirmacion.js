import React from 'react';
import './ModalConfirmacion.css';

const ModalConfirmacion = ({ onConfirm, onCancel, mensaje }) => {
  return (
      <div className="modal-overlay">
          <div className="modal-content">
              <p>{mensaje}</p>
              <div className="modal-actions">
                  <button className="confirm-button" onClick={onConfirm}>Confirmar</button>
                  <button className="cancel-button" onClick={onCancel}>Cancelar</button>
              </div>
          </div>
      </div>
  );
};

export default ModalConfirmacion;
