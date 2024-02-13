import express from 'express';
import {
  getSessionUserName,
  getUserRole,
  getUserIDByUserName,
  moderatedUploadMovie,
  getModerationMovies,
  deleteFromMovieModerationQueueByMovieQueueID,
  getMovieModerationQueueFromDb,
} from '../database-function.js';

const router = express.Router();

/* Route handler for adding a movie to the movie moderation queue. */
router.post('/movie-moderation-queue', async (req, res) => {
  if (!req.session.user) {
    res.status(401).send('not authorized to acces the page');
    return;
  }
  try {
    const { username } = getSessionUserName(req.session.user);
    const userID = await getUserIDByUserName(username);
    const response = await moderatedUploadMovie(username, userID, req.body);

    if (response.rowsAffected[0] === 1) {
      res.status(200).send('The insert to database was successful.');
    } else {
      res.status(400).send('The insert to database was unsuccessful.');
    }
  } catch (error) {
    console.error('error:', error);
    res.status(500).send('An error occured during the request');
  }
});

/* Route handler for accessing the movie moderation queue page. */
router.get('/movie-moderation-queue', async (req, res) => {
  if (!req.session.user) {
    res.status(401).send('not authorized to acces the page');
    return;
  }
  try {
    const { username } = getSessionUserName(req.session.user);
    const userRole = await getUserRole(username);
    if (userRole <= 2) {
      const queueMovies = await getModerationMovies();
      res.render('movie_moderation_queue.ejs', {
        queueMovies,
        userName: username,
        userRole,
      });
    } else {
      res.status(401).send('not authorized to acces the page');
    }
  } catch (error) {
    console.error('error:', error);
    res.status(500).send('An error occured during the request');
  }
});

/* Route handler for deleting a movie from the movie moderation queue. */
router.delete('/delete-queue-movie', async (req, res) => {
  if (!req.session.user) {
    res.status(401).send('not authorized to acces the page');
    return;
  }
  try {
    const deleteResult = await deleteFromMovieModerationQueueByMovieQueueID(req.body.id);
    if (deleteResult.rowsAffected[0] > 0) {
      const selectResult = await getMovieModerationQueueFromDb();
      res.json(selectResult.recordset);
    } else {
      res.status(500).send('Unsuccessful delete from Movie_Moderation_Queue');
    }
  } catch (error) {
    console.error('error:', error);
    res.status(500).send('An error occured during the request');
  }
});

export default router;
