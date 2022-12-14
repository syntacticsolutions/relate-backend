CREATE TABLE IF NOT EXISTS {}.reviews (
    id INT(12) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    review_type_id INT(12) NOT NULL,
    author_id INT(12) NOT NULL,
    reviewed_id INT(12) NOT NULL,
    rating_1 DOUBLE NOT NULL,
    rating_2 DOUBLE NOT NULL,
    rating_3 DOUBLE NOT NULL,
    review VARCHAR(300) NOT NULL,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_aid FOREIGN KEY (author_id)
    REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    CONSTRAINT fk_revid FOREIGN KEY(reviewed_id)
    REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    CONSTRAINT fk_rtid FOREIGN KEY (review_type_id)
    REFERENCES review_types(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
)