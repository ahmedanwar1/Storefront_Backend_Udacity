# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

## API Endpoints

#### Products

- Index
- Show (args: product id)
- Create (args: Product)[token required]
- [OPTIONAL] Top 5 most popular products
- [OPTIONAL] Products by category (args: product category)

#### Users

- Index [token required]
- Show (args: id)[token required]
- Create (args: User)
- Authenticate(args: username, password)

#### Orders

- Current Order by user (args: user id)[token required]
- [OPTIONAL] Completed Orders by user (args: user id)[token required]
- [ADDED] Get all Orders [token required]
- [ADDED] Create Order (args: Order)
- [ADDED] Get all Orders by user (args: userId)
- [ADDED] Get Order by id (args: id)

## Data Shapes

#### Product

- id `SERIAL PRIMARY KEY`
- name `VARCHAR NOT NULL`
- price `NUMERIC NOT NULL`
- [OPTIONAL] category `VARCHAR`

#### User

- id `SERIAL PRIMARY KEY`
- username `VARCHAR UNIQUE NOT NULL`
- firstName `VARCHAR NOT NULL`
- lastName `VARCHAR NOT NULL`
- password `VARCHAR NOT NULL`

#### Orders

- id `SERIAL PRIMARY KEY`
- user_id `INTEGER REFERENCES users(id) NOT NULL`
- status of order (active or complete) `VARCHAR  NOT NULL`

### Order_product

- product_id `INTEGER REFERENCES products(id) NOT NULL`
- order_id `INTEGER REFERENCES orders(id) NOT NULL`
- quantity `INTEGER NOT NULL`
