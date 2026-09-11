const Song = require('../models/Song');

exports.createSong = async (req, res) => {
  try {
    const { title, artist, album, genre } = req.body;
    if (!title || !artist || !album || !genre) {
      return res.status(400).json({ error: 'All fields (title, artist, album, genre) are required.' });
    }
    const song = await Song.create({
      title: title.trim(),
      artist: artist.trim(),
      album: album.trim(),
      genre: genre.trim()
    });
    res.status(201).json(song);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getSongs = async (req, res) => {
  try {
    const { genre, search } = req.query;
    let query = {};

    if (genre && genre.trim() !== '') {
      query.genre = { $regex: new RegExp(`^${genre.trim()}$`, 'i') };
    }

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { artist: searchRegex },
        { album: searchRegex },
        { genre: searchRegex }
      ];
    }

    const songs = await Song.find(query).sort({ createdAt: -1 });
    res.json(songs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSongById = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).json({ error: 'Song not found' });
    }
    res.json(song);
  } catch (err) {
    res.status(400).json({ error: 'Invalid Song ID' });
  }
};

exports.updateSong = async (req, res) => {
  try {
    const { title, artist, album, genre } = req.body;
    const updateData = {};
    if (title) updateData.title = title.trim();
    if (artist) updateData.artist = artist.trim();
    if (album) updateData.album = album.trim();
    if (genre) updateData.genre = genre.trim();

    const song = await Song.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!song) {
      return res.status(404).json({ error: 'Song not found' });
    }
    res.json(song);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteSong = async (req, res) => {
  try {
    const song = await Song.findByIdAndDelete(req.params.id);
    if (!song) {
      return res.status(404).json({ error: 'Song not found' });
    }
    res.json({ message: 'Song deleted successfully', id: req.params.id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const totalSongs = await Song.countDocuments();

    const distinctCounts = await Song.aggregate([
      {
        $group: {
          _id: null,
          artists: { $addToSet: '$artist' },
          albums: { $addToSet: '$album' },
          genres: { $addToSet: '$genre' }
        }
      },
      {
        $project: {
          totalArtists: { $size: '$artists' },
          totalAlbums: { $size: '$albums' },
          totalGenres: { $size: '$genres' }
        }
      }
    ]);

    const genreStats = await Song.aggregate([
      { $group: { _id: '$genre', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const artistStats = await Song.aggregate([
      {
        $group: {
          _id: '$artist',
          totalSongs: { $sum: 1 },
          albums: { $addToSet: '$album' }
        }
      },
      {
        $project: {
          _id: '$_id',
          artist: '$_id',
          totalSongs: 1,
          totalAlbums: { $size: '$albums' }
        }
      },
      { $sort: { totalSongs: -1 } }
    ]);

    const albumStats = await Song.aggregate([
      { $group: { _id: '$album', totalSongs: { $sum: 1 } } },
      { $sort: { totalSongs: -1 } }
    ]);

    const topArtist = artistStats.length > 0 ? artistStats[0].artist : 'N/A';
    const topGenre = genreStats.length > 0 ? genreStats[0]._id : 'N/A';

    res.json({
      totals: {
        songs: totalSongs,
        artists: distinctCounts[0]?.totalArtists || 0,
        albums: distinctCounts[0]?.totalAlbums || 0,
        genres: distinctCounts[0]?.totalGenres || 0,
      },
      topArtist,
      topGenre,
      genreStats,
      artistStats,
      albumStats
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.seedSongs = async (req, res) => {
  try {
    const sampleSongs = [
      { title: 'Tizita', artist: 'Aster Aweke', album: 'Ebo', genre: 'Ethiopian Pop' },
      { title: 'Ethiopia', artist: 'Teddy Afro', album: 'Ethiopia', genre: 'Reggae/Pop' },
      { title: 'Cul de Sac', artist: 'Rophnan', album: 'Netsebrak', genre: 'EDM / Ethio Fusion' },
      { title: 'Fiqir Kebebedegn', artist: 'Tilahun Gessesse', album: 'Greatest Hits', genre: 'Traditional' },
      { title: 'Yene Habesha', artist: 'Teddy Afro', album: 'Tikur Sew', genre: 'Reggae/Pop' },
      { title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', genre: 'Synthwave' },
      { title: 'Kab Dahir', artist: 'Mahmoud Ahmed', album: 'Ethiogroove', genre: 'Ethio-Jazz' },
      { title: 'Chereqa', artist: 'Rophnan', album: 'Sost', genre: 'EDM / Ethio Fusion' },
      { title: 'Starboy', artist: 'The Weeknd', album: 'Starboy', genre: 'R&B / Pop' },
      { title: 'Checheho', artist: 'Aster Aweke', album: 'Checheho', genre: 'Ethiopian Pop' }
    ];

    await Song.deleteMany({});
    const insertedSongs = await Song.insertMany(sampleSongs);
    res.status(201).json({ message: 'Sample songs seeded successfully', count: insertedSongs.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};