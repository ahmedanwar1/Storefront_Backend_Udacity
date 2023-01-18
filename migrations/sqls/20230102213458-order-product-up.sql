CREATE TABLE order_product (
  product_id INTEGER REFERENCES products(id) NOT NULL,
  order_id INTEGER REFERENCES orders(id) NOT NULL,
  quantity INTEGER DEFAULT 1 NOT NULL, 

  CONSTRAINT quantity_no_negative check(quantity > 0)
);