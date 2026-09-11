import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setToast } from '../features/songsSlice';

const ToastContainer = styled.div<{ type: 'success' | 'error' | 'info' }>`
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: ${props =>
    props.type === 'success'
      ? '#064e3b'
      : props.type === 'error'
      ? '#7f1d1d'
      : '#1e3a8a'};
  color: #ffffff;
  border: 1px solid
    ${props =>
      props.type === 'success'
        ? '#10b981'
        : props.type === 'error'
        ? '#ef4444'
        : '#3b82f6'};
  padding: 14px 20px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 2000;
  font-weight: 500;
  font-size: 0.9rem;
  animation: slideUp 0.3s ease-out;

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const ToastIcon = styled.span`
  font-size: 1.2rem;
`;

const CloseBtn = styled.button`
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  font-size: 1rem;
  margin-left: 8px;

  &:hover {
    color: #ffffff;
  }
`;

export const NotificationToast: React.FC = () => {
  const dispatch = useDispatch();
  const toast = useSelector((state: RootState) => state.songs.toast);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        dispatch(setToast(null));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, dispatch]);

  if (!toast) return null;

  const icon = toast.type === 'success' ? '✅' : toast.type === 'error' ? '⚠️' : 'ℹ️';

  return (
    <ToastContainer type={toast.type}>
      <ToastIcon>{icon}</ToastIcon>
      <div>{toast.message}</div>
      <CloseBtn onClick={() => dispatch(setToast(null))}>✕</CloseBtn>
    </ToastContainer>
  );
};
