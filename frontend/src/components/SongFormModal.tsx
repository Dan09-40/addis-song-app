import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { closeModal, createSongStart, updateSongStart } from '../features/songsSlice';
import { Song } from '../types';

const Overlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(8px);
  display: ${props => (props.isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContent = styled.div`
  background: #1e293b;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  width: 100%;
  max-width: 520px;
  padding: 28px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.35rem;
  font-weight: 700;
  color: #f8fafc;
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.05);
  border: none;
  color: #94a3b8;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #ffffff;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 600;
  color: #cbd5e1;
`;

const Input = styled.input`
  padding: 12px 16px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: #f8fafc;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
  }

  &::placeholder {
    color: #64748b;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 12px;
`;

const CancelBtn = styled.button`
  padding: 10px 18px;
  background: transparent;
  color: #94a3b8;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #ffffff;
  }
`;

const SubmitBtn = styled.button`
  padding: 10px 24px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);

  &:hover {
    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.6);
  }
`;

export const SongFormModal: React.FC = () => {
  const dispatch = useDispatch();
  const { isModalOpen, editingSong } = useSelector((state: RootState) => state.songs);

  const [formData, setFormData] = useState<Song>({
    title: '',
    artist: '',
    album: '',
    genre: '',
  });

  useEffect(() => {
    if (editingSong) {
      setFormData(editingSong);
    } else {
      setFormData({ title: '', artist: '', album: '', genre: '' });
    }
  }, [editingSong, isModalOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.artist || !formData.album || !formData.genre) return;

    if (formData._id) {
      dispatch(updateSongStart(formData));
    } else {
      dispatch(createSongStart(formData));
    }
  };

  const handleClose = () => {
    dispatch(closeModal());
  };

  return (
    <Overlay isOpen={isModalOpen} onClick={handleClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{editingSong ? '✏️ Edit Song Details' : '🎵 Add New Track'}</ModalTitle>
          <CloseButton onClick={handleClose}>✕</CloseButton>
        </ModalHeader>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Song Title</Label>
            <Input
              type="text"
              placeholder="e.g. Tizita, Blinding Lights..."
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Artist Name</Label>
            <Input
              type="text"
              placeholder="e.g. Aster Aweke, The Weeknd..."
              value={formData.artist}
              onChange={e => setFormData({ ...formData, artist: e.target.value })}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Album</Label>
            <Input
              type="text"
              placeholder="e.g. Ebo, After Hours..."
              value={formData.album}
              onChange={e => setFormData({ ...formData, album: e.target.value })}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Genre</Label>
            <Input
              type="text"
              placeholder="e.g. Ethiopian Pop, Synthwave, Jazz..."
              value={formData.genre}
              onChange={e => setFormData({ ...formData, genre: e.target.value })}
              required
            />
          </FormGroup>

          <ButtonGroup>
            <CancelBtn type="button" onClick={handleClose}>Cancel</CancelBtn>
            <SubmitBtn type="submit">{editingSong ? 'Save Changes' : 'Create Song'}</SubmitBtn>
          </ButtonGroup>
        </Form>
      </ModalContent>
    </Overlay>
  );
};
