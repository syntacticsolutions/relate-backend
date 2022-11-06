INSERT INTO {}.roles(title) values
('admin'),
('member'),
('user');

INSERT INTO permissions(action)
VALUES
('create-review'),
('manage-reviews'),
('manage-comments'),
('manage-users');

INSERT INTO roles_permissions (role_id, permission_id)
VALUES
(1, 1),
(1, 2),
(1, 3),
(2, 1);

INSERT INTO users (role_id, uid, email, first_name, last_name, personalQuote, profession, location)
VALUES
(1, 'f0a9s70a9s7df987asd','mcoder@lavishweb.com', 'Miguel', 'Coder', 'Humility is key', 'developer', 'San Francisco'),
(2, '0a98s7d0fa87s9d087','dummy@person.com', 'Bob', 'Dylan', 'You\'re gonna have to serve somebody', 'musician', 'New York');

INSERT INTO review_types (type, color)
VALUES
('romance', 'red'),
('business', 'green'),
('friendship', 'blue');

INSERT INTO reviews (review_type_id, author_id, reviewed_id, rating_1, rating_2, rating_3, review)
VALUES
(1, 2, 1, 5, 4, 3, 'Miguel is an awesome dude. Really handsome.'),
(2, 2, 1, 5, 5, 4, 'Miguel is very punctual and likes to tackle the tough problems'),
(3, 2, 1, 3, 5, 5, 'Miguel is a good friend and has a really dry sense of humor.');

INSERT INTO votes (author_id, review_id, liked, user_id)
VALUES
(2, 1, 1, 1),
(2, 2, 1, 1),
(2, 3, 0, 1);

INSERT INTO comments(author_id, review_id, text)
VALUES
(1, 1, 'Thanks random guy!'),
(1, 2, 'Thanks bro!'),
(1, 3, 'I disagree! I think Miguel is CRAyZEee!');