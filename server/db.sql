CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    skills TEXT,
    experience TEXT
);

CREATE TABLE Jobs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100),
    description TEXT,
    skills TEXT,
    company VARCHAR(100)
);

CREATE TABLE Recommendations (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(id),
    job_id INT REFERENCES Jobs(id),
    score FLOAT
);
