import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import s from './Modal.module.css';
import PropTypes from 'prop-types';

const modalRoot = document.querySelector('#modal-root');

export default function Modal ({ src, alt, onClose }){
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        // console.log('add')
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            // console.log('remove')
        }
    })
    
    const handleKeyDown = e => {
    if (e.code === 'Escape') {
      onClose();
    }
    };
    
    const handleBackdropClick = event => {
    if (event.currentTarget === event.target) {
        onClose();
    }
  };

    return createPortal (
            <div className={s.overlay} onClick={handleBackdropClick}>
                <div className={s.modal}>
                    <img src={src} alt={alt} />
                </div>
            </div>,
            modalRoot,
        );
}

Modal.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    }

