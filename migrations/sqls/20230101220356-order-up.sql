CREATE TYPE ORDERSTATUS AS ENUM ('active', 'complete');

CREATE TABLE orders (
  id SERIAL PRIMARY KEY, 
  user_id INTEGER REFERENCES users(id) NOT NULL, 
  status ORDERSTATUS DEFAULT 'active'

);
