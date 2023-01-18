# first install dependences

```
npm install 
```

# script

```
npm run start => to start the server. "nodemon ./src/index.ts",
npm run build => to compile TS to JS. "npx tsc",
npm run test:db => to compile and run tests. "npm run build && npm run jasmine",
```

# env

```
POSTGRES_HOST=127.0.0.1
POSTGRES_DB=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=123456789
NODE_ENV=dev
POSTGRES_DB_TEST=postgres_test
SALT_ROUNDS=10
PASSWORD_APPENDED_STRING=skij45dfas512
TOKEN_SECRET=iltuyasd0tjq8a1rsdfg81gf
```

# Database setup

- connect to default database server `psql -U postgres`
- create database user `CREATE USER postgres WITH PASSWORD '123456789';`
- create dev and test database
  - `CREATE DATABASE postgres;`
  - `CREATE DATABASE postgres_test;`
- connect to dev and test database and grant privileges
  - `\c postgres`
    - `GRANT ALL PRIVILEGES ON DATABASE postgres TO postgres;`
  - `\c postgres_test`
    - `GRANT ALL PRIVILEGES ON DATABASE postgres_test TO postgres;`

# Runniing ports

- node server on port 3000
- database server on port 5432

# endpoint

- User endpoint

  - create user
    POST: http://localhost:3000/api/users
    body: { username: string, password: string, firstname: string, lastname: string}

  - get all users
    GET: http://localhost:3000/api/users [token required]

  - get user by id
    GET: http://localhost:3000/api/users/:id [token required]

    - authenticate user
      POST: http://localhost:3000/api/users/authenticate
      body: { username: string, password: string}

- Product endpoint

  - create product
    POST: http://localhost:3000/api/products [token required]
    body: { name: string, price: number, category: string}

  - get all products
    GET: http://localhost:3000/api/products

  - get product by id
    GET: http://localhost:3000/api/products/:id

- Order endpoint

  - create order
    POST: http://localhost:3000/api/orders [token required]
    body: {
    user_id: number,
    products: [{id: number, quantity: number}],
    status: string
    }

  - get all orders
    GET: http://localhost:3000/api/orders/all [token required]

  - get all orders by user
    GET: http://localhost:3000/api/orders [token required]

  - get current order by user
    GET: http://localhost:3000/api/orders/current/:userId [token required]

  - get an order by id
    GET: http://localhost:3000/api/orders/:orderId [token required]
