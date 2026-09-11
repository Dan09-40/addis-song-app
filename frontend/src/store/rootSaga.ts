import { call, put, takeEvery, all, select } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import {
  fetchSongsApi,
  createSongApi,
  updateSongApi,
  deleteSongApi,
  fetchStatsApi,
  seedSongsApi,
  FetchParams
} from '../api/songApi';
import {
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
  setToast
} from '../features/songsSlice';
import { Song, Stats } from '../types';

function* handleFetchSongs(action: PayloadAction<FetchParams | string | undefined>): Generator {
  try {
    const currentGenre = (yield select((state: any) => state.songs.selectedGenre)) as string;
    const currentSearch = (yield select((state: any) => state.songs.searchTerm)) as string;

    let params: FetchParams = { genre: currentGenre, search: currentSearch };

    if (typeof action.payload === 'string') {
      params.genre = action.payload;
    } else if (action.payload) {
      params = { ...params, ...action.payload };
    }

    const songs = (yield call(fetchSongsApi, params)) as Song[];
    yield put(fetchSongsSuccess(songs));
  } catch (err: any) {
    const errorMsg = err.response?.data?.error || err.message || 'Failed to fetch songs';
    yield put(fetchSongsFailure(errorMsg));
    yield put(setToast({ id: Date.now().toString(), type: 'error', message: errorMsg }));
  }
}

function* handleCreateSong(action: PayloadAction<Song>): Generator {
  try {
    yield call(createSongApi, action.payload);
    yield put(createSongSuccess());
    yield put(setToast({ id: Date.now().toString(), type: 'success', message: 'Song added successfully!' }));
    yield put(fetchSongsStart({}));
    yield put(fetchStatsStart());
  } catch (err: any) {
    const errorMsg = err.response?.data?.error || err.message || 'Failed to create song';
    yield put(fetchSongsFailure(errorMsg));
    yield put(setToast({ id: Date.now().toString(), type: 'error', message: errorMsg }));
  }
}

function* handleUpdateSong(action: PayloadAction<Song>): Generator {
  try {
    yield call(updateSongApi, action.payload);
    yield put(updateSongSuccess());
    yield put(setToast({ id: Date.now().toString(), type: 'success', message: 'Song updated successfully!' }));
    yield put(fetchSongsStart({}));
    yield put(fetchStatsStart());
  } catch (err: any) {
    const errorMsg = err.response?.data?.error || err.message || 'Failed to update song';
    yield put(fetchSongsFailure(errorMsg));
    yield put(setToast({ id: Date.now().toString(), type: 'error', message: errorMsg }));
  }
}

function* handleDeleteSong(action: PayloadAction<string>): Generator {
  try {
    yield call(deleteSongApi, action.payload);
    yield put(deleteSongSuccess());
    yield put(setToast({ id: Date.now().toString(), type: 'info', message: 'Song deleted successfully.' }));
    yield put(fetchSongsStart({}));
    yield put(fetchStatsStart());
  } catch (err: any) {
    const errorMsg = err.response?.data?.error || err.message || 'Failed to delete song';
    yield put(fetchSongsFailure(errorMsg));
    yield put(setToast({ id: Date.now().toString(), type: 'error', message: errorMsg }));
  }
}

function* handleFetchStats(): Generator {
  try {
    const stats = (yield call(fetchStatsApi)) as Stats;
    yield put(fetchStatsSuccess(stats));
  } catch (err: any) {
    console.error('Failed to fetch statistics:', err);
  }
}

function* handleSeedSongs(): Generator {
  try {
    const result = (yield call(seedSongsApi)) as { message: string; count: number };
    yield put(seedSongsSuccess());
    yield put(setToast({ id: Date.now().toString(), type: 'success', message: `Seeded ${result.count} sample songs!` }));
    yield put(fetchSongsStart({ genre: '', search: '' }));
    yield put(fetchStatsStart());
  } catch (err: any) {
    const errorMsg = err.response?.data?.error || err.message || 'Failed to seed sample data';
    yield put(fetchSongsFailure(errorMsg));
    yield put(setToast({ id: Date.now().toString(), type: 'error', message: errorMsg }));
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(fetchSongsStart.type, handleFetchSongs),
    takeEvery(createSongStart.type, handleCreateSong),
    takeEvery(updateSongStart.type, handleUpdateSong),
    takeEvery(deleteSongStart.type, handleDeleteSong),
    takeEvery(fetchStatsStart.type, handleFetchStats),
    takeEvery(seedSongsStart.type, handleSeedSongs),
  ]);
}