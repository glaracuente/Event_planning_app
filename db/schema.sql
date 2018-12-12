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
	from_date date NOT NULL,
	to_date date NOT NULL,
	votes text,
    invites text,
	PRIMARY KEY (id)
);