CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255),
  provider VARCHAR(50) DEFAULT 'local',
  google_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE jobs (
  job_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  comany VARCHAR(255),
  position_name VARCHAR(255),
  status VARCHAR(50) DEFAULT 'applied', 
  applied_date DATE,
  notes TEXT,
  salary INTEGER,
  location VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
)