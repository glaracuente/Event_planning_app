INSERT INTO users (name)
VALUES ('Gerry'), 
('Chris'), 
('Will');

INSERT INTO events (userid, title, from_date, to_date, invites)
VALUES (1, 'bowling night', '12/01/2018', '12/14/2018', '["2","3"]'), 
(2, 'game night', '1/14/2018', '1/19/2018', '["1","3"]'), 
(2, 'movie night', '2/12/2018', '2/15/2018', '["3"]');

INSERT INTO votes (userid, eventid, dates)
VALUES (1,2, '["1.12","1.14"]'),
(3,2, '["1.18","1.17","1.16"]'),
(3,1, '["12.13","12.11","12.10","12.9","12.4","12.3"]'),
(1,1, '["12.12","12.11"]');
