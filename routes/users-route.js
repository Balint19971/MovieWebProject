import express from 'express';
import {
  getSessionUserName,
  getUserRole,
  getUsersExceptOwnderAndDeletedUser,
  getSearchedUsersExceptOwnderAndDeletedUser,
  updateUserRoleByUserID,
  getuserNameByUserID,
  deleteUserByUserIDAndUserName,
} from '../database-function.js';

const router = express.Router();

/* Route handler for displaying user management page. */
router.get('/users', async (req, res) => {
  if (!req.session.user) {
    res.status(401).send('not authorized to acces the page');
    return;
  }
  let userRole;
  try {
    userRole = await getUserRole(req.session.user.username);
  } catch (error) {
    console.error('error:', error);
    res.status(500).send('problem to select userRole from users');
  }

  if (userRole > 2) {
    res.status(401).send('not authorized to acces the page');
  } else {
    const { username } = getSessionUserName(req.session.user);
    let result;
    try {
      result = await getUsersExceptOwnderAndDeletedUser();
    } catch (error) {
      console.error('error:', error);
      res.status(500).send('problem with select from users');
    }
    const users = [];
    result.recordset.forEach((user) => {
      let userPrivilege;
      if (user.userRole === 1) {
        userPrivilege = 'Super-Admin';
      } else if (user.userRole === 2) {
        userPrivilege = 'Admin';
      } else {
        userPrivilege = 'User';
      }
      const updatedUser = { ...user, userPrivilege };
      users.push(updatedUser);
    });
    res.render('users.ejs', { users, userName: username, userRole });
  }
});

/* Route handler for searching users on the user management page. */
router.post('/users', async (req, res) => {
  if (!req.session.user) {
    res.status(401).send('not authorized to acces the page');
    return;
  }
  const { username } = getSessionUserName(req.session.user);
  const userRole = await getUserRole(username);
  const { searchedUser } = req.body;
  try {
    const result = await getSearchedUsersExceptOwnderAndDeletedUser(searchedUser);
    const users = [];
    result.forEach((user) => {
      let userPrivilege;
      if (user.userRole === 1) {
        userPrivilege = 'Super-Admin';
      } else if (user.userRole === 2) {
        userPrivilege = 'Admin';
      } else {
        userPrivilege = 'User';
      }
      const updatedUser = { ...user, userPrivilege };
      users.push(updatedUser);
    });
    res.render('users.ejs', { users, userName: username, userRole });
  } catch (error) {
    console.error('error:', error);
    res.status(500).send('problem in database');
  }
});
/* Route handler for updating user roles. */
router.put('/change-role', async (req, res) => {
  if (!req.session.user) {
    res.status(401).send('not authorized to acces the page');
    return;
  }
  if (Number(req.body.userID) === 5) {
    res.status(400).send('you can not change the owner role');
    return;
  }
  const changeResponse = await updateUserRoleByUserID(req.body.userID, req.body.userRole);
  if (changeResponse.rowsAffected[0] > 0) {
    res.status(200).send('the change was succesfull');
  } else {
    res.status(500).send('error occured in database upload');
  }
});
/* Route handler for deleting a user. */
router.delete('/delete-user', async (req, res) => {
  if (!req.session.user) {
    res.status(401).send('not authorized to acces the page');
    return;
  }
  if (Number(req.body.userID) === 5) {
    res.status(400).send('you can not delete the owner');
    return;
  }
  try {
    const userName = await getuserNameByUserID(req.body.userID);
    if (userName != null) {
      const deleteResponse = await deleteUserByUserIDAndUserName(req.body.userID, userName);
      if (deleteResponse.rowsAffected[5] > 0) {
        res.status(200).send('you deleted the user succesfully');
      } else {
        res.status(400).send('probleme occured in database delete');
      }
    } else {
      res.status(400).send('the user not exist');
    }
  } catch (error) {
    console.error('error:', error);
    res.status(500).send('An error occured during the request');
  }
});

export default router;
