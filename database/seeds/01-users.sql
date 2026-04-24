CREATE TABLE IF NOT EXISTS Users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  username VARCHAR(30) UNIQUE NOT NULL,
  fullname VARCHAR(100) NOT NULL,
  display_name VARCHAR(100),
  picture VARBINARY(20480),
  user_role VARCHAR(20)
    CHECK (user_role IN ("Admin", "HRD", "Developer", "Accounting"))
    NOT NULL,
  is_frozen BOOLEAN DEFAULT FALSE,
  password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS LoggedInSessions (
  session_token BIGINT PRIMARY KEY NOT NULL,
  expire_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user BIGINT,
  
  FOREIGN KEY (user) REFERENCES Users(id)
);


