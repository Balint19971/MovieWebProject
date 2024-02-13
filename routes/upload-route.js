import express from 'express';
import {
  getSessionUserName, getUserRole, getUserIDByUserName, uploadMovie,
} from '../database-function.js';

const router = express.Router();

/* Route handler for rendering the upload page. */
router.get('/upload', async (req, res) => {
  const { username } = getSessionUserName(req.session.user);
  const userRole = await getUserRole(username);
  res.render('upload', { userName: username, userRole });
});

/* Route handler for processing movie uploads. */
router.post('/upload', async (req, res) => {
  if (!req.session.user) {
    res.status(401).send('not authorized to acces the page');
    return;
  }
  let userID;
  try {
    if (!req.body.userName) {
      const { username } = getSessionUserName(req.session.user);
      userID = await getUserIDByUserName(username);
    } else {
      userID = await getUserIDByUserName(req.body.userName);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('An error occured during the request');
  }

  try {
    const response = await uploadMovie(userID, req.body);

    if (response.rowsAffected[0] === 1) {
      res.status(200).send('The upload to the server was successful.');
    } else {
      res.status(400).send('The upload to the server was unsuccessful.');
    }
  } catch (error) {
    console.error('error:', error);
    res.status(500).send('An error occured during the request');
  }
});

export default router;
