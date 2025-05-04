import express from 'express'
import { addProblemToPlaylist, createPlaylist, deletePlaylist, getAllListDetails, getPlayListDetails, removeProblemFromPlaylist } from '../controllers/playlist.controller';

const playlistRoutes = express.Router();

playlistRoutes.get('/', getAllListDetails);
playlistRoutes.get('/:playlistId', getPlayListDetails);
playlistRoutes.post('/create-playlist', createPlaylist);
playlistRoutes.post('/:playlistId/add-problem', addProblemToPlaylist);
playlistRoutes.delete('/:playlistId', deletePlaylist);
playlistRoutes.delete('/:playlistId/remove-problem', removeProblemFromPlaylist)



export default playlistRoutes;