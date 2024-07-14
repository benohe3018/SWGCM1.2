import React from 'react';
import './ModalConfirmacion.css';

const ModalConfirmacion = ({ mensaje, onConfirm, onCancel }) => {
    return (
        <div className="modal">
            <div className="modal-content">
                <p>{mensaje}</p>
                <div className="modal-actions">
                    <button onClick={onConfirm} className="confirm-button">Confirmar</button>
                    <button onClick={onCancel} className="cancel-button">Cancelar</button>
                </div>
            </div>
        </div>
    );
};

export default ModalConfirmacion;
