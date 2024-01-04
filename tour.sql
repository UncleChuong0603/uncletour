CREATE TABLE subscribe_email (
    id INTEGER PRIMARY KEY,
    email text NOT NULL,
    subscription_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);