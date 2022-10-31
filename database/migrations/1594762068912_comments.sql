CREATE TABLE IF NOT EXISTS {}.comments (
    id INT(12) NOT NULL auto_increment PRIMARY KEY,
    author_id INT(12) NOT NULL,
    review_id INT(12) NOT NULL,
    text VARCHAR(300) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_caid FOREIGN KEY (author_id)
    REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    CONSTRAINT fk_crid FOREIGN KEY (review_id)
    REFERENCES reviews(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
)