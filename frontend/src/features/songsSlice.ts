import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Song, Stats, ToastNotification } from '../types';

interface SongsState {
  songs: Song[];
  stats: Stats | null;
  loading: boolean;
  error: string | null;
  selectedGenre: string;
  searchTerm: string;
  editingSong: Song | null;
  isModalOpen: boolean;
  toast: ToastNotification | null;
}

const initialState: SongsState = {
  songs: [],
  stats: null,
  loading: false,
  error: null,
  selectedGenre: '',
  searchTerm: '',
  editingSong: null,
  isModalOpen: false,
  toast: null,
};

const songsSlice = createSlice({
  name: 'songs',
  initialState,
  reducers: {
    fetchSongsStart: (state, _action: PayloadAction<{ genre?: string; search?: string } | string | undefined>) => {
      state.loading = true;
      state.error = null;
    },
    fetchSongsSuccess: (state, action: PayloadAction<Song[]>) => {
      state.songs = action.payload;
      state.loading = false;
    },
    fetchSongsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    createSongStart: (state, _action: PayloadAction<Song>) => {
      state.loading = true;
      state.error = null;
    },
    createSongSuccess: (state) => {
      state.loading = false;
      state.isModalOpen = false;
      state.editingSong = null;
    },
    updateSongStart: (state, _action: PayloadAction<Song>) => {
      state.loading = true;
      state.error = null;
    },
    updateSongSuccess: (state) => {
      state.loading = false;
      state.isModalOpen = false;
      state.editingSong = null;
    },
    deleteSongStart: (state, _action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
    },
    deleteSongSuccess: (state) => {
      state.loading = false;
    },
    fetchStatsStart: () => {},
    fetchStatsSuccess: (state, action: PayloadAction<Stats>) => {
      state.stats = action.payload;
    },
    seedSongsStart: (state) => {
      state.loading = true;
    },
    seedSongsSuccess: (state) => {
      state.loading = false;
    },
    setSelectedGenre: (state, action: PayloadAction<string>) => {
      state.selectedGenre = action.payload;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setEditingSong: (state, action: PayloadAction<Song | null>) => {
      state.editingSong = action.payload;
      state.isModalOpen = action.payload !== null;
    },
    openModal: (state) => {
      state.isModalOpen = true;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
      state.editingSong = null;
    },
    setToast: (state, action: PayloadAction<ToastNotification | null>) => {
      state.toast = action.payload;
    },
  },
});

export const {
  fetchSongsStart,
  fetchSongsSuccess,
  fetchSongsFailure,
  createSongStart,
  createSongSuccess,
  updateSongStart,
  updateSongSuccess,
  deleteSongStart,
  deleteSongSuccess,
  fetchStatsStart,
  fetchStatsSuccess,
  seedSongsStart,
  seedSongsSuccess,
  setSelectedGenre,
  setSearchTerm,
  setEditingSong,
  openModal,
  closeModal,
  setToast,
} = songsSlice.actions;

export default songsSlice.reducer;