CREATE TABLE IF NOT EXISTS {}.social_media_profiles (
    profile_id INT(12) NOT NULL,
    type_id INT(12) NOT NULL,
    UNIQUE KEY(profile_id, type_id),
    CONSTRAINT fk_spid FOREIGN KEY(profile_id)
    REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    CONSTRAINT fk_stid FOREIGN KEY(type_id)
    REFERENCES sm_account_type(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
)