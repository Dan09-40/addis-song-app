import axios from 'axios';
import { Song, Stats } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/songs';

export interface FetchParams {
  genre?: string;
  search?: string;
}

export const fetchSongsApi = (params?: FetchParams | string) => {
  let genre: string | undefined;
  let search: string | undefined;

  if (typeof params === 'string') {
    genre = params;
  } else if (params) {
    genre = params.genre;
    search = params.search;
  }

  const queryParams = new URLSearchParams();
  if (genre) queryParams.append('genre', genre);
  if (search) queryParams.append('search', search);

  const url = queryParams.toString() ? `${API_URL}?${queryParams.toString()}` : API_URL;
  return axios.get<Song[]>(url).then(res => res.data);
};

export const createSongApi = (song: Song) => 
  axios.post<Song>(API_URL, song).then(res => res.data);

export const updateSongApi = (song: Song) => 
  axios.put<Song>(`${API_URL}/${song._id}`, song).then(res => res.data);

export const deleteSongApi = (id: string) => 
  axios.delete<{ message: string; id: string }>(`${API_URL}/${id}`).then(res => res.data);

export const fetchStatsApi = () => 
  axios.get<Stats>(`${API_URL}/stats`).then(res => res.data);

export const seedSongsApi = () =>
  axios.post<{ message: string; count: number }>(`${API_URL}/seed`).then(res => res.data);