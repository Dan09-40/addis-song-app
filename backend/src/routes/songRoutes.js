const express = require('express');
const router = express.Router();
const {
  createSong,
  getSongs,
  getSongById,
  updateSong,
  deleteSong,
  getStats,
  seedSongs
} = require('../controllers/songController');

router.post('/', createSong);
router.get('/', getSongs);
router.get('/stats', getStats);
router.post('/seed', seedSongs);
router.get('/:id', getSongById);
router.put('/:id', updateSong);
router.delete('/:id', deleteSong);

module.exports = router;