import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useDispatch } from 'react-redux';
import { createSongStart, updateSongStart } from '../features/songsSlice';
import { Song } from '../types';

const FormContainer = styled.form`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

interface Props {
  editSong?: Song | null;
  clearEdit?: () => void;
}

export const SongForm: React.FC<Props> = ({ editSong, clearEdit }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<Song>(editSong || { title: '', artist: '', album: '', genre: '' });

  React.useEffect(() => {
    if (editSong) setFormData(editSong);
  }, [editSong]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData._id) {
      dispatch(updateSongStart(formData));
      if (clearEdit) clearEdit();
    } else {
      dispatch(createSongStart(formData));
    }
    setFormData({ title: '', artist: '', album: '', genre: '' });
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <Input placeholder="Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
      <Input placeholder="Artist" value={formData.artist} onChange={e => setFormData({ ...formData, artist: e.target.value })} required />
      <Input placeholder="Album" value={formData.album} onChange={e => setFormData({ ...formData, album: e.target.value })} required />
      <Input placeholder="Genre" value={formData.genre} onChange={e => setFormData({ ...formData, genre: e.target.value })} required />
      <Button type="submit">{formData._id ? 'Update' : 'Add'} Song</Button>
    </FormContainer>
  );
};