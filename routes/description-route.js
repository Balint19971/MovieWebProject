import express from 'express';
import {
  deleteMovieByID,
  getSessionUserName,
  getUserIDByUserName,
  addCommentToUserAndMovie,
  getUserNamesAndCommentsByMovieID,
  deleteCommentByMovieIDAndUserName,
  deleteFromLinksByLinkID,
  getLinkByMovieID,
} from '../database-function.js';

const router = express.Router();

/* Route handler for removing a link. */
router.delete('/remove-link', async (req, res) => {
  if (!req.session.user) {
    res.status(401).send('not authorized to acces the page');
    return;
  }
  try {
    const deleteResult = await deleteFromLinksByLinkID(req.body.linkID);
    if (deleteResult.rowsAffected[0] > 0) {
      const selectResult = await getLinkByMovieID(req.body.movieID);
      res.json(selectResult.recordset);
    } else {
      res.status(400).send('Unsuccessful delete from Links');
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('An error occurred while processing your request');
  }
});
/* Route handler for deleting a movie by its ID. */
router.delete('/delete/:id', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json('Login required for movie delete');
  }
  try {
    await deleteMovieByID(req.params.id);
    res.status(200).send('Succesfull delete');
  } catch (error) {
    console.log(error);
    res.status(500).send('An error occured during the delete process');
  }
});

/* Route handler for adding comments to a movie. */
router.post('/comment', async (req, res) => {
  if (!req.session.user) {
    res.status(401).send('not authorized to acces the page');
    return;
  }
  try {
    const { username } = getSessionUserName(req.session.user);
    const userID = await getUserIDByUserName(username);
    const { movieID, comment } = req.body;
    const respons = await addCommentToUserAndMovie(userID, movieID, comment);
    if (respons.rowsAffected[0] === 1) {
      const result = await getUserNamesAndCommentsByMovieID(movieID);
      res.json(result.recordset);
    } else {
      res.status(401).send('You already wrot a comment');
    }
    // res.redirect(`/movie/${movieID}`);
  } catch (error) {
    console.log(error);
    res.status(500).send('An error occured during the db request');
  }
});
/* Route handler for deleting a user's comment from a movie. */
router.delete('/delete-comment', async (req, res) => {
  const { movieID, userName } = req.body;
  try {
    const response = await deleteCommentByMovieIDAndUserName(movieID, userName);
    if (response.rowsAffected[0] > 0 && response.rowsAffected[1] > 0) {
      res.status(200).send('delete succesfull');
    } else {
      res.status(500).send('delete unsuccesfull');
    }
  } catch (error) {
    console.error('Error in delete-comment route:', error);
    res.status(500).send('An error occurred while processing your request');
  }
});

export default router;
