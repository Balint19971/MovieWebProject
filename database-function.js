/* This code imports a pool object from a module called 'database-connection.js'. */
import { pool } from './database-connection.js';
/* This function fetches the user role from a database based on the provided username. */
export async function getUserRole(userName) {
  if (userName) {
    const dataFromDb = await pool.request().input('userName', userName).query(`
        SELECT userRole
        FROM Users
        WHERE userName = @userName
    `);
    return dataFromDb.recordset[0].userRole;
  }
  return null;
}
/* This function retrieves the user's ID from the database using their username as input. */
export async function getUserIDByUserName(userName) {
  if (userName) {
    const dataFromDb = await pool.request().input('userName', userName).query(`
        SELECT userID
        FROM Users
        WHERE userName = @userName
    `);
    return dataFromDb.recordset[0].userID;
  }
  return null;
}
/* This function retrieves the username associated with a user ID from the database. */
export async function getuserNameByUserID(userID) {
  if (userID) {
    const dataFromDb = await pool.request().input('userID', userID).query(`
        SELECT userName
        FROM Users
        WHERE userID = @userID
    `);
    return dataFromDb.recordset[0].userName;
  }
  return null;
}
/* This function handles the moderated upload of a movie to the Movie Moderation Queue
 table in the database, using a transaction for data consistency. */
export async function moderatedUploadMovie(userName, userID, formParams) {
  const result = await pool
    .request()
    .input('userID', userID)
    .input('userName', userName)
    .input('movie_title', formParams.title)
    .input('movie_release', formParams.release)
    .input('movie_description', formParams.description)
    .input('movie_imagePath', formParams.imagePath)
    .input('link_language', formParams.language)
    .input('link_quality', formParams.quality)
    .input('link_source', formParams.source)
    .input('link_url', formParams.link)
    .input('category', formParams.category)
    .query(`
        BEGIN TRANSACTION;
  
        BEGIN TRY
  
            INSERT INTO Movie_Moderation_Queue (userID, userName, movie_title, movie_release, movie_description, movie_imagePath,link_language,link_quality,link_source,link_url,category) 
            VALUES (@userID, @userName, @movie_title, @movie_release, @movie_description, @movie_imagePath,@link_language,@link_quality,@link_source,@link_url,@category)
        
            COMMIT; 
        END TRY
        BEGIN CATCH
            ROLLBACK;
        END CATCH;
      `);
  return result;
}
/* This function handles the moderated addition of a link to the Link Moderation Queue
 table in the database, using a transaction for data consistency. */
export async function moderatedAddLink(userName, movieTitle, formParams) {
  const result = await pool
    .request()
    .input('movieID', formParams.movieID)
    .input('userName', userName)
    .input('movie_title', movieTitle)
    .input('link_language', formParams.language)
    .input('link_quality', formParams.quality)
    .input('link_source', formParams.source)
    .input('link_url', formParams.link)
    .query(`
      BEGIN TRANSACTION;
  
      BEGIN TRY
        INSERT INTO Link_Moderation_Queue (movieID, userName, movie_title, link_language, link_quality, link_source, link_url) 
        VALUES (@movieID, @userName, @movie_title, @link_language, @link_quality, @link_source, @link_url);
      
          COMMIT; 
      END TRY
      BEGIN CATCH
          ROLLBACK;
      END CATCH;
    `);
  return result;
}
/* This function handles the upload of a movie into the database.
 It inserts data into the Movies, Links, Categories, and CategoryOf tables
  while ensuring data consistency using a transaction. */
export async function uploadMovie(userID, formParams) {
  const result = await pool
    .request()
    .input('userID', userID)
    .input('movie_title', formParams.title)
    .input('movie_release', formParams.release)
    .input('movie_description', formParams.description)
    .input('movie_imagePath', formParams.imagePath)
    .input('link_language', formParams.language)
    .input('link_quality', formParams.quality)
    .input('link_source', formParams.source)
    .input('link_url', formParams.link)
    .input('category', formParams.category)
    .query(`
               BEGIN TRANSACTION
  
               BEGIN TRY
                   INSERT INTO Movies (userID ,movie_title, movie_release, movie_description, movie_imagePath) 
                   VALUES (@userID, @movie_title, @movie_release, @movie_description, @movie_imagePath);
                   
                   DECLARE @movieID INT;
                   SET @movieID = SCOPE_IDENTITY();
               
                   INSERT INTO Links (movieID, link_language, link_quality, link_source, link_url) 
                   VALUES (@movieID, @link_language, @link_quality, @link_source, @link_url);
               
                   INSERT INTO Categories (category) VALUES (@category);
               
                   DECLARE @categoryID INT;
                   SET @categoryID = SCOPE_IDENTITY();
               
                   INSERT INTO CategoryOf (movieID, categoryID) VALUES (@movieID, @categoryID);
               
                   COMMIT; 
               END TRY
               BEGIN CATCH
                   ROLLBACK;
               END CATCH;
               `);
  return result;
}
/* This function deletes a movie from the database based on its movieID.
It removes related data from the Links, Categories, Comments, CategoryOf,
 and Link_Moderation_Queue tables, ensuring data consistency within a transaction. */
export async function deleteMovieByID(movieID) {
  const respons = await pool.request().input('id', movieID).query(`
          BEGIN TRANSACTION
  
            BEGIN TRY
              DELETE FROM Links
              WHERE movieID = @id;
              
              DECLARE @categoryID INT;
              
              SET @categoryID = (SELECT categoryID
                              FROM CategoryOf
                              WHERE movieID = @id);
              
              DELETE FROM CategoryOf
              WHERE movieID = @id;
  
              DELETE FROM Comments
              WHERE MovieID = @id
              
              DELETE FROM Movies
              WHERE movieID = @id;
              
              DELETE FROM Categories
              WHERE categoryID = @categoryID;
  
              DELETE FROM Link_Moderation_Queue
              WHERE movieID = @id;
              COMMIT
            END TRY
            BEGIN CATCH
              ROLLBACK
            END CATCH
        `);

  return respons;
}
/* This function registers new users in the database. It adds the provided
 userName, userEmail, and userPassword to the "Users" table in the database. */
export async function registerUser(userName, userEmail, userPassword) {
  const response = await pool
    .request()
    .input('userName', userName)
    .input('userEmail', userEmail)
    .input('userPassword', userPassword)
    .query(`
              INSERT INTO Users (userName, userEmail, userPassword) VALUES (@userName, @userEmail, @userPassword)
          `);

  return response;
}
/* This function retrieves movies associated with a specific
 category from the database and returns the results. */
export async function getMoviesByCategoriy(category) {
  const response = await pool.request().input('category', category).query(`
               SELECT Movies.movieID, movie_title, movie_release, movie_imagePath 
               FROM Movies JOIN CategoryOf
               ON Movies.movieID = CategoryOf.movieID
               JOIN Categories
               ON CategoryOf.categoryID = Categories.categoryID
               WHERE category = @category;
           `);
  return response;
}
/* This function retrieves movies from the database based on a search parameter
 (likely a movie title) and returns the results. It performs a partial match search
  (LIKE) on movie titles using the provided searchParam. */
export async function getMoviesBySearchParam(searchParam) {
  const response = await pool.request().input('movie_title', searchParam).query(`
               SELECT Movies.movieID, movie_title, movie_release, movie_imagePath 
               FROM Movies
               WHERE movie_title LIKE @movie_title + '%'
           `);
  return response;
}
/* This function retrieves movies associated with a specific user
 (identified by their username) from the database and returns the results. */
export async function getMoviesByUsername(userName) {
  const response = await pool.request().input('userName', userName).query(`
               SELECT Movies.movieID, movie_title, movie_release, movie_imagePath 
               FROM Movies JOIN Users
               ON Movies.userID = Users.userID
               WHERE userName = @userName;
           `);
  return response;
}
/* This function retrieves various parameters of a movie based on
 its movieID from the database and returns the result. */
export async function getMovieParamsByMovieID(movieID) {
  const response = await pool.request().input('id', Number(movieID)).query(`
      SELECT Movies.movieID,userID,movie_title,movie_release,movie_description,movie_imagePath,Categories.categoryID, category
      FROM Movies 
      JOIN CategoryOf ON Movies.movieID = CategoryOf.movieID
      JOIN Categories ON CategoryOf.categoryID = Categories.categoryID
      WHERE Movies.movieID = @id
      `);
  return response.recordset[0];
}
/* This function extracts the username from a session user object and returns it.
 If the sessionUser object is available (not null), it retrieves the username property
  from it and returns it as an object with a username property.
   If sessionUser is not available, it returns an object with username set to null. */
export function getSessionUserName(sessionUser) {
  let username = null;
  if (sessionUser) {
    username = sessionUser.username;
  }

  return {
    username,
  };
}
/* This function retrieves movies from a moderation queue in the database
 and returns the results. */
export async function getModerationMovies() {
  const result = await pool.request().query(`
      SELECT * FROM Movie_Moderation_Queue
    `);
  return result.recordset;
}
/* This function retrieves the title of a movie based on its movieID
 from the database and returns the result. */
export async function getMovieNameById(movieID) {
  const result = await pool.request().input('movieID', movieID).query(`
      SELECT movie_title FROM Movies WHERE movieID = @movieID
    `);
  return result.recordset[0].movie_title;
}
/* This function retrieves links from a moderation queue in the database and
 returns the results. */
export async function getModerationLinks() {
  const result = await pool.request().query(`
      SELECT * FROM Link_Moderation_Queue
    `);
  return result.recordset;
}
/* This function adds a link to a movie in the database based on the provided
 parameters. */
export async function addLinkToMovie(params) {
  const response = pool
    .request()
    .input('movieID', params.movieID)
    .input('link_language', params.link_language)
    .input('link_quality', params.link_quality)
    .input('link_source', params.link_source)
    .input('link_url', params.link_url)
    .query(`
      BEGIN TRANSACTION;
  
      BEGIN TRY
          INSERT INTO Links (movieID, link_language, link_quality, link_source, link_url) 
          VALUES (@movieID, @link_language, @link_quality, @link_source, @link_url);
      
          COMMIT; 
      END TRY
      BEGIN CATCH
          ROLLBACK;
      END CATCH;
    `);
  return response;
}
/* This function retrieves all movies from the database and returns the result. */
export async function getMoviesFromDb() {
  const response = await pool.query('SELECT * FROM movies');
  return response.recordset;
}
/* This function retrieves comments and user names associated with a
 specific movie based on its movieID from the database. */
export async function getCommentsAndUserNamesByMovieID(movieID) {
  const result = await pool.request().input('movieID', movieID).query(`
      SELECT Comments.*, Users.userName
      FROM Comments JOIN Users ON Comments.userID = Users.userID
      WHERE movieID = @movieID  
    `);
  return result.recordset;
}
/*
This function retrieves links associated with a specific movie based on its
 movieID from the database. */
export async function getLinksByMovieID(movieID) {
  const result = await pool.request().input('movieID', movieID).query(`
      SELECT * FROM Links WHERE movieID = @movieID
    `);

  return result.recordset;
}
/* This function retrieves the password of a user based on their userName from the database. */
export async function getUserPasswordByUserName(userName) {
  const result = await pool.request().input('userName', userName).query(`
            SELECT userPassword
            FROM Users
            WHERE userName = @userName 
        `);
  return result;
}
/* This function retrieves users from the database except for the owner
 and those with the username 'Deleted-user'. */
export async function getUsersExceptOwnderAndDeletedUser() {
  const result = await pool.request().query(`
                SELECT *
                FROM Users
                WHERE userRole <> 1 and userName <> 'Deleted-user';
            `);
  return result;
}
/* This function retrieves users from the database whose usernames start with a
 specified search string (SearchedUserName), except for the owner and those with
  the username 'Deleted-user'. */
export async function getSearchedUsersExceptOwnderAndDeletedUser(SearchedUserName) {
  const result = await pool.request().input('searcheduser', SearchedUserName).query(`
            SELECT *
            FROM Users
            WHERE userName LIKE @searcheduser + '%' and userRole <> 1 and userName <> 'Deleted-user';
        `);
  return result.recordset;
}
/* This function adds a comment to a specific user and movie in the database.
 It uses a transaction to ensure data integrity. */
export async function addCommentToUserAndMovie(userID, movieID, comment) {
  const respons = await pool.request().input('userID', userID).input('movieID', movieID).input('comment', comment)
    .query(`
      BEGIN TRANSACTION;
        BEGIN TRY
          INSERT INTO Comments (movieID, userID, comment) VALUES (@movieID, @userID, @comment)
          COMMIT;
        END TRY
        BEGIN CATCH
          ROLLBACK;
        END CATCH;
    `);
  return respons;
}
/* This function retrieves user names and comments associated with
 a specific movie based on its movieID from the database. */
export async function getUserNamesAndCommentsByMovieID(movieID) {
  const result = await pool.request().input('movieID', movieID).query(`
      SELECT Users.userName, Comments.comment
      FROM Comments join Users on Comments.userID = Users.userID
      WHERE MovieID = @MovieID
    `);
  return result;
}
/* This function deletes a comment associated with a specific movie and user by their
 respective IDs from the database. It uses a transaction to ensure data consistency. */
export async function deleteCommentByMovieIDAndUserName(movieID, userName) {
  const response = await pool.request().input('movieID', movieID).input('userName', userName).query(`
      DECLARE @userID INT;
      SELECT @userID = userID FROM users WHERE userName = @userName;
      BEGIN TRANSACTION
        BEGIN TRY
          DELETE FROM Comments WHERE userID = @userID AND movieID = @movieID;
          COMMIT;
        END TRY
        BEGIN CATCH
          ROLLBACK
        END CATCH
    `);
  return response;
}
/* This function deletes an entry from the movie moderation queue based on the
 provided movieQueueID from the database. It uses a transaction to ensure data
  integrity during the deletion process. */
export async function deleteFromMovieModerationQueueByMovieQueueID(movieQueueID) {
  const deleteResult = await pool.request().input('movie_queueID', movieQueueID).query(`
    BEGIN TRANSACTION
    BEGIN TRY
      DELETE FROM Movie_Moderation_Queue WHERE movie_queueID = @movie_queueID
      COMMIT
    END TRY
    BEGIN CATCH
      ROLLBACK
    END CATCH
  `);
  return deleteResult;
}
/* This function retrieves entries from the movie moderation queue in the database. */
export async function getMovieModerationQueueFromDb() {
  const selectResult = await pool.request().query(`
      SELECT * FROM Movie_Moderation_Queue
    `);
  return selectResult;
}
/* This function deletes an entry from the link moderation queue based on the provided
 linkQueueID from the database. It uses a transaction to ensure data integrity during
  the deletion process. */
export async function deleteFromLinkModerationQueueByLinkQueueID(linkQueueID) {
  const deleteResult = await pool.request().input('link_queueID', linkQueueID).query(`
    BEGIN TRANSACTION
    BEGIN TRY
      DELETE FROM Link_Moderation_Queue WHERE link_queueID = @link_queueID
      COMMIT
    END TRY
    BEGIN CATCH
      ROLLBACK
    END CATCH
  `);
  return deleteResult;
}
/* This function retrieves entries from the link moderation queue in the database. */
export async function getLinkModerationQueueFromDb() {
  const selectResult = await pool.request().query(`
        SELECT * FROM Link_Moderation_Queue
    `);
  return selectResult;
}
/* This function deletes a link from the database based on the provided linkID.
 It uses a transaction to ensure data integrity during the deletion process. */
export async function deleteFromLinksByLinkID(linkID) {
  const deleteResult = await pool.request().input('linkID', linkID).query(`
  BEGIN TRANSACTION
    BEGIN TRY
      DELETE FROM Links WHERE linkID = @linkID
      COMMIT
    END TRY
    BEGIN CATCH
      ROLLBACK
    END CATCH
`);
  return deleteResult;
}
/* This function retrieves links associated with a specific movie based on its
 movieID from the database. */
export async function getLinkByMovieID(movieID) {
  const selectResult = await pool.request().input('movieID', movieID).query(`
        SELECT * FROM Links WHERE movieID = @movieID;
      `);
  return selectResult;
}
/* This function updates the user role of a user in the database based on their userID. */
export async function updateUserRoleByUserID(userID, newUserRole) {
  const changeResponse = await pool.request().input('userID', userID).input('userRole', newUserRole).query(`
    BEGIN TRANSACTION
      BEGIN TRY
        UPDATE Users 
        SET userRole = @userRole
        WHERE userID = @userID
        COMMIT
      END TRY
      BEGIN CATCH
        ROLLBACK
      END CATCH
  `);
  return changeResponse;
}
/* This function deletes a user and updates related records in the
 database based on their userID and userName. It utilizes a transaction to ensure
  data consistency during the deletion process. */
export async function deleteUserByUserIDAndUserName(userID, userName) {
  const deleteResponse = await pool.request().input('userID', userID).input('userName', userName).query(`
          BEGIN TRANSACTION
            BEGIN TRY
              UPDATE Movies
              SET userID = 19
              WHERE userID = @userID
              
              UPDATE Comments
              SET userID = 19
              WHERE userID = @userID

              UPDATE Movie_Moderation_Queue
              SET userID = 19
              WHERE userID = @userID

              UPDATE Movie_Moderation_Queue
              SET userName = 'Deleted-user'
              WHERE userName = @userName

              UPDATE Link_Moderation_Queue
              SET userName = 'Deleted-user'
              WHERE userName = @userName
              
              DELETE FROM Users
              WHERE userID = @userID
              COMMIT
            END TRY
            BEGIN CATCH
              ROLLBACK
            END CATCH
      `);
  return deleteResponse;
}
