<!-- <img src=".erb/img/erb-banner.svg" width="100%" /> -->

# Inventory Management

<div align="center"></div>

### Steps followed to bootstrap this ERB template with other depedencies

1. Cloned the repo and install dependencies:

```bash
git clone --depth 1 --branch main https://github.com/electron-react-boilerplate/electron-react-boilerplate.git
```

2. Start the app in the `dev` environment:

```bash
npm start
```

### Installing `sqlite3`

To package apps for the local platform:

```bash
cd release\app
npm i sqlite3
npm run postinstall
npm run start
```

Check second `node_modules`
