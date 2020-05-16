# spendesk-banking
Spendesk - Case study - Banking API 💳 💰
Built from express-generator-typescript using typeorm and postgresql

## Get Started
Use `npm install` then :
- `npm run start:dev` to start nodemon dev server
- `npm run build` to make the project
- `npm run start` to start node from dist

## Tests
Use `npm run test` to run tests
/!\ this one is sill work in progress /!\

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

### Cards

#### List user cards
- Request: `GET /api/cards/all HTTP/1.1`
- Response: { "cards": [...] }

#### Add card
- Request: `POST /api/cards/add HTTP/1.1`
- Body: { "card": {...} }
- Response: { "card": {...} }

#### Load / Unload card
- Request: `PUT /api/cards/load HTTP/1.1`
- Body: {"card":{ "id": X, "load": Y }}
- Response: { "card": {...} }

#### Block / Unblock card
- Request: `PUT /api/cards/block HTTP/1.1`
- Body: {"card":{ "id": X, "isBlocked": true / false }}
- Response: { "card": {...} }

### Companies

#### List companies
- Request: `GET /api/companies/all HTTP/1.1`
- Response: { "company": [...] }

### Transfers

#### List transfers
- Request: `GET /api/transfers/all HTTP/1.1`
- Response: { "transfers": [...] }

#### Transfer amount between wallets
- Request: `PUT /api/transfers/ HTTP/1.1`
- Body: { "from": X, "to": Y, "amount": Z }
- Response: { "wallets": {...} }

### Users

#### List users
- Request: `GET /api/users/all HTTP/1.1`
- Response: { "users": [...] }

#### Add user
- Request: `POST /api/users/add HTTP/1.1`
- Body: { "user": {"name": X,"email": Y, "companyId": Z} }
- Response: { "user": {...} }

### Wallets

#### List wallets
- Request: `GET /api/wallets/all HTTP/1.1`
- Response: { "wallets": [...] }

#### Add wallet
- Request: `POST /api/wallets/add HTTP/1.1`
- Body: { "wallet": { "currency": X} }
- Response: { "wallet": {...} }