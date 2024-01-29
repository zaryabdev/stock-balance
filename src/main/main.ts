/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import { BrowserWindow, app, ipcMain, shell } from 'electron';
import log from 'electron-log';
import Store from 'electron-store';
import { autoUpdater } from 'electron-updater';
import path from 'path';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

import AppDAO from './dao';
import CustomerInvoicRepository from './repositories/customer-invoice-repo';
import CustomerRepository from './repositories/customer-repo';
import ProductRepository from './repositories/product-repo';
// import StockRepository from './repositories/stock-repo';
// import BalanceRepository from './repositories/balance-repo';

const dao = new AppDAO('db.sqlite3');
const customerRepo = new CustomerRepository(dao);
const customerInvoiceRepo = new CustomerInvoicRepository(dao);
// const stockRepo = new StockRepository(dao);
// const balanceRepo = new BalanceRepository(dao);
const productRepo = new ProductRepository(dao);

const STATUS = {
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
};

// stockRepo.createTable();
customerRepo.createTable();
productRepo.createTable();
// balanceRepo.createTable();
customerInvoiceRepo.createTable();

const store = new Store();

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    minHeight: 600,
    minWidth: 1250,
    icon: getAssetPath('icon.png'),
    // titleBarStyle: 'hidden',
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.setMenuBarVisibility(false);

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }

    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.maximize();
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

// IPC listener - store
ipcMain.on('electron-store-get', async (event, val) => {
  event.returnValue = store.get(val);
});
ipcMain.on('electron-store-get-all', async (event, val) => {
  // event.returnValue = store.
});

ipcMain.on('electron-store-set', async (event, key, val) => {
  store.set(key, val);
});

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

const callbackFunction = (response, err, event) => {
  try {
    if (err) {
      console.log(err);
    }
    if (response.status === STATUS.SUCCESS) {
      event.returnValue = response;
    } else {
      event.returnValue = response;
      console.log(response.message);
    }
  } catch (error) {
    console.error(error);
  }
};

// IPC listener - customer
ipcMain.on('create:customer', async (event, data) => {
  console.log('main.ts create:customer');
  console.log(`Length of data sent : ${data.length}`);
  customerRepo.create(data, (response, err) =>
    callbackFunction(response, err, event),
  );
});

ipcMain.on('update:customer', async (event, data) => {
  console.log('main.ts update:customer');
  console.log(`Length of data sent : ${data.length}`);

  customerRepo.update(data, (response, err) =>
    callbackFunction(response, err, event),
  );
});

ipcMain.on('get:all:customer', async (event, data) => {
  console.log('main.ts - get:all:customer');
  console.log(`Length of data sent : ${data.length}`);

  customerRepo.getAll(data, (response, err) =>
    callbackFunction(response, err, event),
  );
});

ipcMain.on('delete:customer', async (event, data) => {
  console.log('main.ts delete:customer');
  console.log(`Length of data sent : ${data.length}`);

  customerRepo.deleteRecords(data, (response, err) =>
    callbackFunction(response, err, event),
  );
});

ipcMain.on('archive:customer', async (event, data) => {
  console.log('main.ts archive:customer');
  console.log(`Length of data sent : ${data.length}`);

  customerRepo.archiveRecords(data, (response, err) =>
    callbackFunction(response, err, event),
  );
});

ipcMain.on('unarchive:customer', async (event, data) => {
  console.log('main.ts unarchive:customer');
  console.log(`Length of data sent : ${data.length}`);

  customerRepo.unarchiveRecords(data, (response, err) =>
    callbackFunction(response, err, event),
  );
});

// IPC listener - customer-invoice
ipcMain.on('create:customer-invoice', (event, data) => {
  console.log('main.ts create:customer-invoice');
  console.log(`Length of data sent : ${data.length}`);

  customerInvoiceRepo.create(data, (response, err) =>
    callbackFunction(response, err, event),
  );
});

ipcMain.on('update:customer-invoice', (event, data) => {
  console.log('main.ts update:customer-invoice');
  console.log(`Length of data sent : ${data.length}`);

  customerInvoiceRepo.update(data, (response, err) =>
    callbackFunction(response, err, event),
  );
});

ipcMain.on('delete:duplicated-customer-invoice', (event, data) => {
  console.log('main.ts delete:duplicated-customer-invoice');
  console.log(`Length of data sent : ${data.length}`);

  customerInvoiceRepo.deleteDuplicated(data, (response, err) =>
    callbackFunction(response, err, event),
  );
});

ipcMain.on('get:all:customer-invoices', (event, data) => {
  console.log('main.ts get:all:customer-invoices');
  console.log(`Length of data sent : ${data.length}`);

  customerInvoiceRepo.getAll(data, (response, err) =>
    callbackFunction(response, err, event),
  );
});

ipcMain.on('get:all:customer-invoices:id', (event, data) => {
  console.log('main.ts get:all:customer-invoices:id');
  console.log(`Length of data sent : ${data.length}`);

  customerInvoiceRepo.getById(data, (response, err) =>
    callbackFunction(response, err, event),
  );
});

ipcMain.on('delete:customer-invoice', (event, data) => {
  console.log('main.ts delete:customer-invoice');
  console.log(`Length of data sent : ${data.length}`);

  customerInvoiceRepo.deleteRecords(data, (response, err) =>
    callbackFunction(response, err, event),
  );
});

// IPC listener - product
ipcMain.on('create:product', async (event, data) => {
  console.log('main.ts create:product');
  console.log(`Length of data sent : ${data.length}`);
  productRepo.create(data, (response, err) =>
    callbackFunction(response, err, event),
  );
});

ipcMain.on('update:product', async (event, data) => {
  console.log('main.ts update:product');
  console.log(`Length of data sent : ${data.length}`);
  productRepo.update(data, (response, err) =>
    callbackFunction(response, err, event),
  );
});

ipcMain.on('get:all:product', (event, data) => {
  console.log('main.ts get:all:product');
  console.log(`Length of data sent : ${data.length}`);
  productRepo.getAll(data, (response, err) =>
    callbackFunction(response, err, event),
  );
});

ipcMain.on('delete:product', async (event, data) => {
  console.log('main.ts delete:product');
  console.log(`Length of data sent : ${data.length}`);
  productRepo.deleteRecords(data, (response, err) =>
    callbackFunction(response, err, event),
  );
});

// App listerns
app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
