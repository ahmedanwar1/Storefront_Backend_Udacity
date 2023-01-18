CREATE TABLE products (
  id SERIAL PRIMARY KEY, 
  name VARCHAR(255) NOT NULL, 
  price NUMERIC NOT NULL, 
  category VARCHAR(100),
  
  CONSTRAINT price_no_negative check(price >= 0)
);
