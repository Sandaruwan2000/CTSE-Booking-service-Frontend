# Deploy to AWS S3 with GitHub Actions

This project is a Vite single-page app. For S3 deployment, the built files come from `npm run build`, which outputs the production site into `dist/`.

## What controls the deploy

- [frontend-react/.github/workflows/deploy-s3.yml](.github/workflows/deploy-s3.yml) builds the app and syncs `dist/` to S3.
- [src/services/api.js](src/services/api.js) reads `VITE_API_URL` at build time. The workflow can pass it from a GitHub secret or a repository variable (secret has priority).
- [src/App.jsx](src/App.jsx) defines the React Router routes. No router code change is needed for S3 as long as the bucket serves `index.html` for unknown paths.
- [index.html](index.html) is the Vite entry file. It is bundled into `dist/index.html` and should be the S3 index document.

## AWS setup

1. Create an S3 bucket for the site.
2. Enable static website hosting on the bucket.
3. Set the index document to `index.html`.
4. Set the error document to `index.html` so React Router routes like `/books` and `/admin` still load the app.
5. Leave redirection rules empty unless you need a special redirect for a different path or domain.
6. Allow public read access to the bucket objects if you are serving directly from the S3 website endpoint.
7. Create an IAM user or role with permission to upload to the bucket.

## GitHub secrets

Add these repository secrets in GitHub (Settings > Secrets and variables > Actions):

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

## GitHub variables

Add these repository variables in GitHub (Settings > Secrets and variables > Actions):

- `AWS_REGION` (e.g., `ap-southeast-1`)
- `AWS_S3_BUCKET` (e.g., `ctse.frontend-008582146830-ap-southeast-1-an`)
- `VITE_API_URL` (e.g., `http://ctse-1408507202.ap-southeast-1.elb.amazonaws.com`)

## How the workflow works

When you push to `main`, GitHub Actions will:

1. Check out the repository.
2. Install dependencies with `npm ci`.
3. Build the React app with `VITE_API_URL` injected at build time.
4. Configure AWS credentials.
5. Set the S3 website index and error document to `index.html`.
6. Sync the `dist/` folder to the S3 bucket.

## Local build

To test the production build locally:

```bash
npm ci
npm run build
```

The generated site will be in `dist/`.

## Notes for S3 SPA routing

This app uses `BrowserRouter`, so direct links such as `/books` or `/admin` will only work if S3 returns `index.html` for unmatched routes. That is why the workflow sets the bucket error document to `index.html`.

## Original template notes

This project started from the default React + Vite template.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
