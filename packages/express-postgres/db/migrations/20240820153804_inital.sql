-- migrate:up

CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	first_name VARCHAR(100),
	last_name VARCHAR(100),
	email VARCHAR(100) UNIQUE NOT NULL
);


-- migrate:down

DROP TABLE users;
