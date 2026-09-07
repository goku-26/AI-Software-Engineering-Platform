import React from 'react';

export const Card = ({ children, className = '', hoverable = false, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-surface/80 border border-surface-border rounded-xl p-5 shadow-lg ${
        hoverable ? 'glass-panel-hover cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
