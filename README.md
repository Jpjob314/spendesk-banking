# spendesk-banking
Spendesk - Case study - Banking API 💳 💰
Built from express-generator-typescript using typeorm and postgresql

## Get Started
Use `npm install` then :
- `npm run start:dev` to start nodemon dev server
- `npm run build` to make the project
- `npm run start` to start node from dist

## Tests
`/!\ this one is sill work in progress /!\`
Use `npm run test` to run tests

## Database 
Check `ormconfig.json` to configure db connection. 
Available typeorm connections options can be found [here](https://github.com/typeorm/typeorm/blob/master/docs/connection-options.md#what-is-connectionoptions)

## Views
Users can be added / updated and listed from `http://localhost:3000/`

## API
Each call should have following headers set :
`Content-Type: application/json`
`usr` User id
`cmp` Company id

See `API.postman_collection.json` for more details

### Cards

#### List user cards
- Request: `GET /api/cards/all HTTP/1.1`
- Response: { "cards": [...] }
- Status: 200 OK

#### Add card
- Request: `POST /api/cards/add HTTP/1.1`
- Body: { "card": {...} }
- Response: { "card": {...} }
- Status: 201 Created

#### Load / Unload card
- Request: `PUT /api/cards/load HTTP/1.1`
- Body: {"card":{ "id": X, "load": Y }}
- Response: { "card": {...} }
- Status: 200 OK

#### Block / Unblock card
- Request: `PUT /api/cards/block HTTP/1.1`
- Body: {"card":{ "id": X, "isBlocked": true / false }}
- Response: { "card": {...} }
- Status: 200 OK

### Companies

#### List companies
- Request: `GET /api/companies/all HTTP/1.1`
- Response: { "company": [...] }
- Status: 200 OK

### Transfers

#### List transfers
- Request: `GET /api/transfers/all HTTP/1.1`
- Response: { "transfers": [...] }
- Status: 200 OK

#### Transfer amount between wallets
- Request: `PUT /api/transfers/ HTTP/1.1`
- Body: { "from": X, "to": Y, "amount": Z }
- Response: { "wallets": {...} }
- Status: 200 OK

### Users

#### List users
- Request: `GET /api/users/all HTTP/1.1`
- Response: { "users": [...] }
- Status: 200 OK

#### Add user
- Request: `POST /api/users/add HTTP/1.1`
- Body: { "user": {"name": X,"email": Y, "companyId": Z} }
- Response: { "user": {...} }
- Status: 201 Created

### Wallets

#### List wallets
- Request: `GET /api/wallets/all HTTP/1.1`
- Response: { "wallets": [...] }
- Status: 200 OK

#### Add wallet
- Request: `POST /api/wallets/add HTTP/1.1`
- Body: { "wallet": { "currency": X} }
- Response: { "wallet": {...} }
- Status: 201 Created