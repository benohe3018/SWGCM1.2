import React from 'react';
import './ModalConfirmacion.css';

const ModalConfirmacion = ({ onConfirm, onCancel }) => {
  return (
      <div className="modal-overlay">
          <div className="modal">
              <p>¿Estás seguro de que deseas eliminar este estudio?</p>
              <div className="modal-actions">
                  <button className="confirmar-button" onClick={onConfirm}>Confirmar</button>
                  <button className="cancelar-button" onClick={onCancel}>Cancelar</button>
              </div>
          </div>
      </div>
  );
};

export default ModalConfirmacion;