import React from 'react';
import './DeleteCheckModal.css'; // 스타일을 위한 CSS 파일



const DeleteCheckModal = ({ isOpen, onClose, onDelete }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>삭제 확인</h2>
                <p>정말로 이 항목을 삭제하시겠습니까?</p>
                <button onClick={onDelete}>삭제</button>
                <button onClick={onClose}>취소</button>
            </div>
        </div>
    );
};

export default DeleteCheckModal;
