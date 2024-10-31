CREATE TABLE Users (
  id UUID DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  user_created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  user_updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE Profile (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES Users(id),
    name VARCHAR(100) NOT NULL,
    skills TEXT,
    experience TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Jobs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    skills TEXT,
    company VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Recommendations (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES Users(id),
    job_id INT REFERENCES Jobs(id),
    score FLOAT CHECK (score >= 0 AND score <= 1),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
