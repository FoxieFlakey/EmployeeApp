CREATE TABLE IF NOT EXISTS Users (
  id BIGSERIAL PRIMARY KEY NOT NULL,
  username VARCHAR(30) UNIQUE NOT NULL,
  fullname VARCHAR(100) NOT NULL,
  display_name VARCHAR(100),
  picture BYTEA,
  user_role VARCHAR(20)
    CHECK (user_role IN ('Admin', 'HRD', 'Developer', 'Accounting'))
    NOT NULL,
  is_frozen BOOLEAN DEFAULT FALSE,
  password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS LoggedInSessions (
  session_token VARCHAR(64) PRIMARY KEY NOT NULL,
  expire_at TIMESTAMP NOT NULL,
  user_id BIGINT,
  
  FOREIGN KEY (user_id) REFERENCES Users(id)
);


