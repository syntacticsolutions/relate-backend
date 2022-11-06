CREATE TABLE IF NOT EXISTS {}.votes (
    author_id INT(12) NOT NULL,
    review_id INT(12) NOT NULL,
    user_id INT(12) NOT NULL,
    liked TINYINT(1) NOT NULL,
    UNIQUE KEY(author_id, review_id),
    CONSTRAINT fk_uvid FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    CONSTRAINT fk_avid FOREIGN KEY (author_id)
    REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    CONSTRAINT fk_rvid FOREIGN KEY (review_id)
    REFERENCES reviews(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
)
