# Running locally

# run app locally
* install node dependencies for app: (in app folder)
```sh
npm install 
```
* Fill in VITE_API_URL with desired backend in app/.env.local (example env file provided).
* run app locally (in app folder)
```sh
npm run dev
```
* the app will be available on [localhost:5173](http://localhost:5173/)

# run app & backend
* Fill in VITE_API_URL with localhost:5000 in app/.env (example env file provided).
* run docker with local containers for db, db-admin, app & api:
```sh
docker-compose -f compose.yaml up --build 
```

# Deployment 
* install node dependencies for deployment: (in deployment folder)
```sh
npm install 
```
* Fill in FTP_HOST, WEBSITE_ADMIN_USE and WEBSITE_ADMIN_PW in deployment/.env (example env file provided).
* Fill in VITE_API_URL with desired backend in app/.env.production (example env file provided).

## deploy app
* build app: (in app folder)
```sh
npm run build
```
* deploy previously build app: (in deployment folder)
```sh
npm run deploy-app
```

## deploy api
* deploy previously build app: (in deployment folder)
```sh
npm run deploy-api
```
