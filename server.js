/* Importing express and express session */
import express from 'express';
import session from 'express-session';
/* Importing connectPool and pool for the database connection. */
import { connectPool, pool } from './database-connection.js';

/* Importing routes */
import uploadRoute from './routes/upload-route.js';
import movieRoute from './routes/movie-route.js';
import descriptionRoute from './routes/description-route.js';
import queueMovieRoute from './routes/queue-movie-route.js';
import queueLinkRoute from './routes/queue-link-route.js';
import usersRoute from './routes/users-route.js';
import authRoute from './routes/auth-route.js';

/* Connect to MSSQL database */
connectPool(pool);

const app = express();
/* Set the view engine and views directory */
app.set('view engine', 'ejs');
app.set('views', './views');

/* Configures middleware for the Express.js application. */
// Serves static files from the './public' directory.
app.use(express.static('./public'));
// Parses URL-encoded data and JSON data from incoming requests.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Sets up session management with a secret key 'akalamago1'.
app.use(
  session({
    secret: 'akalamago1',
    resave: false,
    saveUninitialized: false,
  }),
);
// Maps different routes to their respective route handlers.
app.use('/', uploadRoute);
app.use('/', movieRoute);
app.use('/', descriptionRoute);
app.use('/', queueMovieRoute);
app.use('/', queueLinkRoute);
app.use('/', usersRoute);
app.use('/', authRoute);

/* Starts the Express.js server and listens on port 8080. */
app.listen(8080, () => {
  console.log('Server is running on port 8080');
});
