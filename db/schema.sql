DROP DATABASE IF EXISTS user_events_db;

CREATE DATABASE user_events_db;
USE user_events_db;

CREATE TABLE users
(
	id int NOT NULL AUTO_INCREMENT,
	name varchar(100) NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE events
(
	id int NOT NULL AUTO_INCREMENT,
	userid int NOT NULL,
	title varchar(255) NOT NULL,
	from_date text NOT NULL,
	to_date text NOT NULL,
	votes text,
    invites text,
	PRIMARY KEY (id)
);

CREATE TABLE votes
(
	userid int NOT NULL,
	eventid int NOT NULL,
	dates text NOT NULL,
    hack int  NOT NULL AUTO_INCREMENT,
	PRIMARY KEY (hack)
);

