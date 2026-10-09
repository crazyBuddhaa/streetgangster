# Street Gangster

Build 0.1 is a single-player, low-poly District0 walking prototype built with Vite, React, TypeScript, and React Three Fiber. It has no multiplayer, accounts, backend, database, or authentication.

## Prototype controls

- Desktop: WASD or arrow keys to move, drag to rotate the camera, and use the mouse wheel to zoom.
- Mobile: use the left joystick to move, drag the right side to rotate the camera, and pinch to zoom.
- The HUD camera button switches between close and far camera views.

## Requirements

- Node.js 24 LTS (the version is recorded in .nvmrc)
- npm

## Run locally

From the repository root:

```sh
nvm install
nvm use
npm --prefix apps/web install
npm --prefix apps/web run dev
```

Vite prints the local URL (normally http://localhost:5173). To make a production build and preview it locally:

```sh
npm --prefix apps/web run build
npm --prefix apps/web run preview
```

The static build is written to apps/web/dist.

## Cloudflare Pages Git integration

1. In the Cloudflare dashboard, open **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
2. Authorize/select GitHub if prompted, then choose **crazyBuddhaa/streetgangster**.
3. Set the production branch to **main**.
4. In the build settings, use:
   - Root directory: `apps/web`
   - Build command: `npm run build`
   - Build output directory: `dist`
5. Add the environment variable `NODE_VERSION` with value `24` for the production environment (and preview too if you want preview builds on the same Node version).
6. Save and deploy. Later pushes to main trigger production builds; other branches can create preview deployments.

## Manual Cloudflare Pages deploy

Run these commands from the repository root. Create the Pages project once if it does not exist yet:

```sh
npx wrangler pages project create streetgangster --production-branch main
```

Then build and deploy to the production branch:

```sh
npm --prefix apps/web run build
npx wrangler pages deploy apps/web/dist --project-name=streetgangster --branch=main
```
