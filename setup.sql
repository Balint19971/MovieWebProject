CREATE LOGIN Shortcut WITH PASSWORD = 'Balint1997'; /*belepesi adat es hozza a jelszo letrehozasa*/
CREATE USER Bali FOR LOGIN Shortcut; /*a shortcut belepesi adathoz rendelunk egy usert ami Bali*/
GRANT CREATE DATABASE TO Bali; /* a bali user szamara jogosultsagot adunk hogy lehtrehozhason adatbazist*/
GO

SETUSER 'Bali' /*az osszes parancs Bali felhasznalo jogosultsagaival fog vegrehajtodni*/
GO

CREATE DATABASE [Shortcut]/* letrehoz egy shortcut adatbazist*/
GO

CREATE TABLE Users(
		userID INT IDENTITY CONSTRAINT Users_PK PRIMARY KEY,
		userName VARCHAR(30) UNIQUE NOT NULL,
		userEmail VARCHAR(100) UNIQUE NOT NULL,
		userPassword VARCHAR(MAX),
		userRole INT DEFAULT 3 CHECK (userRole >=1 AND userRole <=3)
	);

CREATE TABLE Movies(
        movieID INT IDENTITY CONSTRAINT Movies_PK PRIMARY KEY,
		userID INT REFERENCES Users(userID),
		movie_title VARCHAR(50) NOT NULL,
        movie_release INT CHECK (movie_release >= 1900) NOT NULL,
        movie_description VARCHAR(1000),
        movie_imagePath VARCHAR(1000) NOT NULL, 
     );

CREATE TABLE Links(
        linkID INT IDENTITY CONSTRAINT Links_PK PRIMARY KEY,
		movieID INT REFERENCES Movies(movieID),
		link_language VARCHAR(50),
        link_quality VARCHAR(30),
        link_source VARCHAR(60) NOT NULL,
        link_url VARCHAR(1000) NOT NULL, 
     );

CREATE TABLE Categories(
        categoryID INT IDENTITY CONSTRAINT Categories_PK PRIMARY KEY,
		category VARCHAR(50), 
     );

CREATE TABLE CategoryOf(
		movieID INT REFERENCES Movies(movieID),	
		categoryID INT REFERENCES Categories(categoryID), 
     );

CREATE TABLE Comments(
	commentID INT IDENTITY CONSTRAINT Comment_PK PRIMARY KEY,
	movieID INT REFERENCES Movies(movieID),
	userID INT REFERENCES Users(userID),
	comment VARCHAR(600) NOT NULL
	CONSTRAINT Unique_User_Movie_Comment UNIQUE (userID, movieID)
);

CREATE TABLE Movie_Moderation_Queue(
	movie_queueID INT IDENTITY CONSTRAINT Movie_queueID_PK PRIMARY KEY,
	userID INT,
	userName VARCHAR(30), 
	movie_title VARCHAR(50) NOT NULL,
	movie_release INT CHECK (movie_release >= 1900) NOT NULL,
	movie_description VARCHAR(1000),
	movie_imagePath VARCHAR(1000) NOT NULL,
	link_language VARCHAR(50),
	link_quality VARCHAR(30),
	link_source VARCHAR(60) NOT NULL,
	link_url VARCHAR(1000) NOT NULL,
	category VARCHAR(50),
	)

CREATE TABLE Link_Moderation_Queue(
	link_queueID INT IDENTITY CONSTRAINT Link_queueID_PK PRIMARY KEY,
	movieID INT,
	userName VARCHAR(30),
	movie_title VARCHAR(50) NOT NULL,
	link_language VARCHAR(50),
	link_quality VARCHAR(30),
	link_source VARCHAR(60) NOT NULL,
	link_url VARCHAR(1000) NOT NULL,
	)