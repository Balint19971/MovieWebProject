import express from 'express';
import {
  getMoviesFromDb,
  getSessionUserName,
  getUserRole,
  getMovieParamsByMovieID,
  getCommentsAndUserNamesByMovieID,
  getLinksByMovieID,
  getMoviesByUsername,
  getMoviesByCategoriy,
  getMoviesBySearchParam,
} from '../database-function.js';

const router = express.Router();

/* Route handler for rendering the main movies page. */
router.get(['/', '/movies'], async (req, res) => {
  try {
    const movies = await getMoviesFromDb();
    const { username } = getSessionUserName(req.session.user);
    const userRole = await getUserRole(username);
    res.render('movies.ejs', { movies, userName: username, userRole });
  } catch (error) {
    console.error('error:', error);
    res.status(500).send('An error occured during the request');
  }
});

/* Route handler for displaying movie details. */
router.get('/movie/:id', async (req, res) => {
  try {
    const { username } = getSessionUserName(req.session.user);
    const userRole = await getUserRole(username);
    const movieID = req.params.id;
    const movie = await getMovieParamsByMovieID(movieID);
    const comments = await getCommentsAndUserNamesByMovieID(movieID);
    const links = await getLinksByMovieID(movieID);
    if (!movie) {
      res.status(404).send('Nincs ilyen film.');
    } else {
      res.render('description.ejs', {
        movie,
        links,
        comments,
        userName: username,
        userRole,
      });
    }
  } catch (error) {
    console.error('error:', error);
    res.status(500).send('An error occured during the request');
  }
});

/* Route handler for displaying movies by category. */
router.get('/categories/:category', async (req, res) => {
  try {
    const { username } = getSessionUserName(req.session.user);
    const userRole = await getUserRole(username);
    if (req.params.category === 'Mymovies' && username != null) {
      const result = await getMoviesByUsername(username);
      const movies = result.recordset;
      res.render('movies.ejs', { movies, userName: username, userRole });
    } else if (req.params.category === 'Allmovies') {
      res.redirect('/movies');
    } else {
      const result = await getMoviesByCategoriy(req.params.category);
      const movies = result.recordset;
      res.render('movies.ejs', { movies, userName: username, userRole });
    }
  } catch (error) {
    console.error('error:', error);
    res.status(500).send('An error occured during the request');
  }
});

/* Route handler for handling movie search requests. */
router.post('/movie-search', async (req, res) => {
  try {
    const { username } = getSessionUserName(req.session.user);
    const userRole = await getUserRole(username);
    const result = await getMoviesBySearchParam(req.body.searchedMovie);
    const movies = result.recordset;
    res.render('movies.ejs', { movies, userName: username, userRole });
  } catch (error) {
    console.error('error:', error);
    res.status(500).send('An error occured during the request');
  }
});

export default router;
