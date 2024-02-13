import express from 'express';
import {
  getSessionUserName,
  getUserRole,
  getMovieNameById,
  moderatedAddLink,
  getModerationLinks,
  addLinkToMovie,
  deleteFromLinkModerationQueueByLinkQueueID,
  getLinkModerationQueueFromDb,
} from '../database-function.js';

const router = express.Router();

/* Route handler for adding a link to the moderation queue. */
router.post('/link-moderation-queue', async (req, res) => {
  if (!req.session.user) {
    res.status(401).send('not authorized to acces the page');
    return;
  }
  try {
    const { username } = getSessionUserName(req.session.user);
    const movieTitle = await getMovieNameById(req.body.movieID);
    const response = await moderatedAddLink(username, movieTitle, req.body);
    if (response.rowsAffected[0] > 0) {
      res.status(200).send('The insert to database was successful.');
    } else {
      res.status(400).send('The insert to database was unsuccessful.');
    }
  } catch (error) {
    console.log(error);
  }
});

/* Route handler for displaying the link moderation queue page. */
router.get('/link-moderation-queue', async (req, res) => {
  if (!req.session.user) {
    res.status(401).send('not authorized to acces the page');
    return;
  }
  try {
    const { username } = getSessionUserName(req.session.user);
    const userRole = await getUserRole(username);
    const links = await getModerationLinks();
    if (userRole <= 2) {
      res.render('link_moderation_queue.ejs', {
        links,
        userName: username,
        userRole,
      });
    } else {
      res.status(401).send('not authorized to acces the page');
    }
  } catch (error) {
    console.log(error);
  }
});
/* Route handler for adding a link to a movie. */
router.post('/add-link-to-movie', async (req, res) => {
  if (!req.session.user) {
    res.status(401).send('not authorized to acces the page');
    return;
  }
  try {
    const { username } = getSessionUserName(req.session.user);
    const userRole = await getUserRole(username);
    if (userRole < 3) {
      const response = await addLinkToMovie(req.body);
      if (response.rowsAffected[0] > 0) {
        res.status(200).send('The insert to database was successful.');
      } else {
        res.status(400).send('The insert to database was unsuccessful.');
      }
    } else {
      res.status(401).send('not authorized to acces the page');
    }
  } catch (error) {
    console.error('error:', error);
    res.status(500).send('An error occured during the request');
  }
});
/* Route handler for deleting a link from the moderation queue. */
router.delete('/delete-queue-link', async (req, res) => {
  if (!req.session.user) {
    res.status(401).send('not authorized to acces the page');
    return;
  }
  try {
    const deleteResult = await deleteFromLinkModerationQueueByLinkQueueID(req.body.linkID);
    if (deleteResult.rowsAffected[0] > 0) {
      const selectResult = await getLinkModerationQueueFromDb();
      res.json(selectResult.recordset);
    } else {
      res.status(400).send('Unsuccessful delete from Link_Moderation_Queue');
    }
  } catch (error) {
    console.error('error:', error);
    res.status(500).send('An error occured during the request');
  }
});

export default router;
