# FullAuth documentation site

This private Next.js App Router app contains the FullAuth website and documentation. It uses the repository's current `docs/package-lock.json` dependencies.

```bash
npm install
npm run dev
```

The development server runs at `http://localhost:3000`. To check the production build, run `npm run lint`, `npx tsc --noEmit`, and `npm run build` from this directory. The app has no test script.

The deployed site origin used for canonical URLs and the sitemap is `https://full-auth.vercel.app/`. Page metadata is defined with the route content and the shared helper in `lib/metadata.ts`.
