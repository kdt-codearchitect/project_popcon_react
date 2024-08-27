import React from 'react';
import './Loading.css'; // 스타일을 위한 CSS 파일

const Loading = () => {
  return (
    <div className="loading-container">
      <div className="loading-spinner"/>
      <p>불러오는중...</p>
    </div>
  );
};

export default Loading;
