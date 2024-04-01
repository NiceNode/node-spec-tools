# Node Spec Tools

Tools to create, update, and verify Node Specs for [NiceNode](https://nicenode.xyz)

Live at [tools.nicenode.xyz](https://tools.nicenode.xyz)

## Development

Created with [Vercel's template](https://vercel.com/docs/frameworks/remix) for [Remix.run](https://remix.run)

```sh
npx create-remix@latest --template vercel/vercel/examples/remix
```

To run your Remix app locally, make sure your project's local dependencies are installed:

```sh
npm install
```

Afterwards, start the Remix development server like so:

```sh
npm run dev
```

Open up [http://localhost:5173](http://localhost:5173) and you should be ready to go!

## Deploy

All pushes to `main` branch will trigger an automatic production deployment.

### Deploy Your Own

You can deploy your own version using the [Vercel CLI](https://vercel.com/docs/cli):

```sh
npm i -g vercel
vercel
```

## Tools
The raw json diff is computed using [jsdiff](https://github.com/kpdecker/jsdiff)