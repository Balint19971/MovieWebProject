import path from 'path';
import bcrypt from 'bcrypt';
import express from 'express';
import { registerUser, getUserPasswordByUserName } from '../database-function.js';

const router = express.Router();
/* middlewear for checking if the user name start with uppercase letter. */
function checkNameCase(req, res, next) {
  const { name } = req.body;
  if (/^[A-Z]/.test(name)) {
    next();
  } else {
    res.status(400).send(`
      The name must start with an uppercase letter.
      <a href="javascript:history.back()">Go back</a>
    `);
  }
}

function validatePassword(req, res, next) {
  const { password } = req.body;

  if (!/[a-z]/.test(password)) {
    return res.status(400).send(`
      The password must contain at least one lowercase letter.
      <a href="/register">Go back</a>
      `);
  }

  if (!/[A-Z]/.test(password)) {
    return res.status(400).send(`
      The password must contain at least one uppercase letter.
      <a href="/register">Go back</a>
      `);
  }

  if (!/\d/.test(password)) {
    return res.status(400).send(`
      The password must contain at least one digit.
      <a href="/register">Go back</a>
      `);
  }

  next();
}

function comparePasswords(req, res, next) {
  const { password } = req.body;
  const { confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).send(`
      Passwords do not match.
      <a href="/register">Go back</a>
    `);
  }

  next();
}

/* Route handler for rendering the user registration page. */
router.get('/register', (req, res) => {
  if (req.session.user) {
    res.status(401).send('logout befor accesing this page.');
    return;
  }
  const filePath = path.join(process.cwd(), 'public/html', 'register.html');
  res.sendFile(filePath);
});

/* Route handler for user registration form submission. */
router.post('/register', checkNameCase, validatePassword, comparePasswords, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await registerUser(req.body.name, req.body.email, hashedPassword);
    res.redirect('/login');
  } catch (error) {
    res.redirect('/register');
  }
});

/* Route handler for the login page. */
router.get('/login', (req, res) => {
  if (req.session.user) {
    res.status(401).send('logout befor accesing this page.');
    return;
  }
  const filePath = path.join(process.cwd(), 'public/html', 'login.html');
  res.sendFile(filePath);
});

/* Route handler for user login. */
router.post('/login', checkNameCase, async (req, res) => {
  try {
    const result = await getUserPasswordByUserName(req.body.name);
    if (result.rowsAffected[0] === 1) {
      if (req.body.name && req.body.password) {
        if (req.session.authenticated) {
          res.json(req.session);
        } else {
          const match = await bcrypt.compare(req.body.password, result.recordset[0].userPassword);
          if (match) {
            req.session.authenticated = true;
            const username = req.body.name;
            req.session.user = {
              username,
            };
            res.redirect('/movies');
          } else {
            res.redirect('/login');
          }
        }
      } else {
        res.status(404).send('wrong user name or password');
      }
    } else {
      res.redirect('/login');
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('error occured during database select');
  }
});
/* Route handler for user logout. */
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).send(`Session reset error: ${err.message}`);
    } else {
      res.redirect('/movies');
    }
  });
});

export default router;
