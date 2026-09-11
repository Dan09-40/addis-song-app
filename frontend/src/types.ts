export interface Song {
  _id?: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GenreStat {
  _id: string;
  count: number;
}

export interface ArtistStat {
  _id: string;
  artist: string;
  totalSongs: number;
  totalAlbums: number;
}

export interface AlbumStat {
  _id: string;
  totalSongs: number;
}

export interface Stats {
  totals: {
    songs: number;
    artists: number;
    albums: number;
    genres: number;
  };
  topArtist?: string;
  topGenre?: string;
  genreStats: GenreStat[];
  artistStats: ArtistStat[];
  albumStats: AlbumStat[];
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}