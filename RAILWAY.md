# Railway Deployment

Create two Railway services from this GitHub repository.

For the backend service, leave the root directory empty (`/`). The root `railway.json` explicitly builds with `Dockerfile` and starts `backend/server.js`.

## Backend service

Alternatively, set the service root directory to `/backend` and use `backend/railway.json`.
Add the required environment variables in Railway, including `JWT_SECRET` and any broker credentials. Railway provides `PORT` automatically.

After deployment, verify:

```text
https://BACKEND-DOMAIN/health
```

## Dashboard service

Set the service root directory to `/dashboard` and use `dashboard/railway.json`.
Set `VITE_API_URL` to the public backend URL, for example:

```text
VITE_API_URL=https://BACKEND-DOMAIN
```

The mobile app must also use the public backend URL. Set `EXPO_PUBLIC_API_URL` before creating the next Android build.