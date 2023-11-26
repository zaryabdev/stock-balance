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
import StockRepository from './repositories/stock-repo';

const dao = new AppDAO('db.sqlite3');
const customerRepo = new CustomerRepository(dao);
const customerInvoiceRepo = new CustomerInvoicRepository(dao);
const stockRepo = new StockRepository(dao);
const productRepo = new ProductRepository(dao);

const STATUS = {
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
};

stockRepo.createTable();
customerRepo.createTable();
productRepo.createTable();
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

ipcMain.on('electron-store-set', async (event, key, val) => {
  store.set(key, val);
});

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

// IPC listener - customer
ipcMain.on('create:customer', (event, data) => {
  console.log('Inside Main create:customer');
  console.log(data);
  const callbackFunction = (response, err) => {
    // const webContents = event.sender;
    // const win = BrowserWindow.fromWebContents(webContents);
    console.log('callback function called!!');
    if (err) {
      console.log(err);
    }

    if (response.status === STATUS.SUCCESS) {
      console.log('respose was success');
      // console.log(win);
      event.reply('create:customer-response', response);

      // win.webContents.send('create:customer', response);
    } else {
      console.log(response.message);
    }
  };

  customerRepo.create(data, callbackFunction);
});

ipcMain.on('update:customer', (event, data) => {
  console.log('Inside Main update:customer');
  console.log(data);
  const callbackFunction = (response, err) => {
    // const webContents = event.sender;
    // const win = BrowserWindow.fromWebContents(webContents);
    console.log('callback function called!!');
    if (err) {
      console.log(err);
    }

    if (response.status === STATUS.SUCCESS) {
      console.log('respose was success');
      // console.log(win);
      event.reply('update:customer-response', response);

      // win.webContents.send('create:customer', response);
    } else {
      console.log(response.message);
    }
  };

  customerRepo.update(data, callbackFunction);
});

ipcMain.on('get:all:customer', (event, data) => {
  console.log('Inside Main get:all:customer');
  console.log(data);
  const callbackFunction = (response, err) => {
    // const webContents = event.sender;
    // const win = BrowserWindow.fromWebContents(webContents);
    console.log('callback function called!!');
    if (err) {
      console.log(err);
    }

    if (response.status === STATUS.SUCCESS) {
      console.log('respose was success');
      // console.log(win);
      event.reply('get:all:customer-response', response);

      // win.webContents.send('create:customer', response);
    } else {
      console.log(response.message);
    }
  };

  customerRepo.getAll(data, callbackFunction);
});

ipcMain.on('delete:customer', (event, data) => {
  console.log('Inside Main delete:customer');
  console.log(data);
  const callbackFunction = (response, err) => {
    // const webContents = event.sender;
    // const win = BrowserWindow.fromWebContents(webContents);
    console.log('callback function called!! for delete');
    if (err) {
      console.log(err);
    }

    if (response.status === STATUS.SUCCESS) {
      console.log('respose was success');
      // console.log(win);
      event.reply('delete:customer-response', response);

      // win.webContents.send('create:customer', response);
    } else {
      console.log(response.message);
    }
  };

  customerRepo.deleteRecords(data, callbackFunction);
});

// IPC listener - stock
ipcMain.on('create:stock', (event, data) => {
  console.log('Inside Main create:stock');
  console.log(data);
  const callbackFunction = (response, err) => {
    // const webContents = event.sender;
    // const win = BrowserWindow.fromWebContents(webContents);
    console.log('callback function called!!');
    if (err) {
      console.log(err);
    }

    if (response.status === STATUS.SUCCESS) {
      console.log('respose was success');
      // console.log(win);
      event.reply('create:stock', response);

      // win.webContents.send('create:customer', response);
    } else {
      console.log(response.message);
    }
  };

  stockRepo.create(data, callbackFunction);
});

ipcMain.on('update:stock', (event, data) => {
  console.log('Inside Main update:stock');
  console.log(data);
  const callbackFunction = (response, err) => {
    // const webContents = event.sender;
    // const win = BrowserWindow.fromWebContents(webContents);
    console.log('callback function called!!');
    if (err) {
      console.log(err);
    }

    if (response.status === STATUS.SUCCESS) {
      console.log('respose was success');
      // console.log(win);
      event.reply('update:stock-response', response);

      // win.webContents.send('create:stock', response);
    } else {
      console.log(response.message);
    }
  };

  stockRepo.update(data, callbackFunction);
});

ipcMain.on('get:all:stock', (event, data) => {
  console.log('Inside Main get:all:stock');
  console.log(data);
  const callbackFunction = (response, err) => {
    // const webContents = event.sender;
    // const win = BrowserWindow.fromWebContents(webContents);
    console.log('callback function called!!');
    if (err) {
      console.log(err);
    }

    if (response.status === STATUS.SUCCESS) {
      console.log('respose was success');
      // console.log(win);
      event.reply('get:all:stock-response', response);

      // win.webContents.send('create:customer', response);
    } else {
      console.log(response.message);
    }
  };

  stockRepo.getAll(data, callbackFunction);
});

ipcMain.on('delete:stock', (event, data) => {
  console.log('Inside Main delete:stock');
  console.log(data);
  const callbackFunction = (response, err) => {
    // const webContents = event.sender;
    // const win = BrowserWindow.fromWebContents(webContents);
    console.log('callback function called!! for delete');
    if (err) {
      console.log(err);
    }

    if (response.status === STATUS.SUCCESS) {
      console.log('respose was success');
      // console.log(win);
      event.reply('delete:stock-response', response);

      // win.webContents.send('create:customer', response);
    } else {
      console.log(response.message);
    }
  };

  stockRepo.deleteRecords(data, callbackFunction);
});

// IPC listener - customer-invoice
ipcMain.on('create:customer-invoice', (event, data) => {
  console.log('Inside Main create:customer-invoice');
  console.log(data);
  const callbackFunction = (response, err) => {
    // const webContents = event.sender;
    // const win = BrowserWindow.fromWebContents(webContents);
    console.log('callback function called!!');
    if (err) {
      console.log(err);
    }

    if (response.status === STATUS.SUCCESS) {
      console.log('respose was success');
      // console.log(win);
      event.reply('create:customer-invoice-response', response);

      // win.webContents.send('create:customer', response);
    } else {
      console.log(response.message);
    }
  };

  customerInvoiceRepo.create(data, callbackFunction);
});

ipcMain.on('update:customer-invoice', (event, data) => {
  console.log('Inside Main update:customer-invoice');
  // console.log(data);
  const callbackFunction = (response, err) => {
    // const webContents = event.sender;
    // const win = BrowserWindow.fromWebContents(webContents);
    console.log('callback function called!!');
    if (err) {
      console.log(err);
    }

    if (response.status === STATUS.SUCCESS) {
      console.log('respose was success');
      // console.log(win);
      event.reply('update:customer-invoice', response);

      // win.webContents.send('create:customer', response);
    } else {
      console.log(response.message);
    }
  };

  customerInvoiceRepo.update(data, callbackFunction);
});

ipcMain.on('get:all:customer-invoices', (event, data) => {
  console.log('Inside Main get:all:customer-invoices');
  // console.log(data);
  const callbackFunction = (response, err) => {
    // const webContents = event.sender;
    // const win = BrowserWindow.fromWebContents(webContents);
    console.log('callback function called!!');
    if (err) {
      console.log(err);
    }

    if (response.status === STATUS.SUCCESS) {
      console.log('respose was success');
      // console.log(win);
      event.reply('get:all:customer-invoices-response', response);

      // win.webContents.send('create:customer', response);
    } else {
      console.log(response.message);
    }
  };

  customerInvoiceRepo.getAll(data, callbackFunction);
});

ipcMain.on('get:all:customer-invoices:id', (event, data) => {
  console.log('Inside Main get:all:customer-invoices:id');
  // console.log(data);

  const callbackFunction = (response, err) => {
    // const webContents = event.sender;
    // const win = BrowserWindow.fromWebContents(webContents);
    console.log('callback function called!!');
    if (err) {
      console.log(err);
    }

    if (response.status === STATUS.SUCCESS) {
      console.log('respose was success');
      // console.log(win);
      event.reply('get:all:customer-invoices:id-response', response);

      // win.webContents.send('create:customer', response);
    } else {
      console.log(response.message);
    }
  };

  customerInvoiceRepo.getById(data, callbackFunction);
});

ipcMain.on('delete:customer-invoice', (event, data) => {
  console.log('Inside Main delete:customer-invoice');
  console.log(data);
  const callbackFunction = (response, err) => {
    // const webContents = event.sender;
    // const win = BrowserWindow.fromWebContents(webContents);
    console.log('callback function called!! for delete');
    if (err) {
      console.log(err);
    }

    if (response.status === STATUS.SUCCESS) {
      console.log('respose was success');
      // console.log(win);
      event.reply('delete:customer-invoice-response', response);

      // win.webContents.send('create:customer', response);
    } else {
      console.log(response.message);
    }
  };

  customerInvoiceRepo.deleteRecords(data, callbackFunction);
});

// IPC listener - product
ipcMain.on('create:product', (event, data) => {
  console.log('Inside Main create:product');
  console.log(data);
  const callbackFunction = (response, err) => {
    // const webContents = event.sender;
    // const win = BrowserWindow.fromWebContents(webContents);
    console.log('callback function called!!');
    if (err) {
      console.log(err);
    }

    if (response.status === STATUS.SUCCESS) {
      console.log('respose was success');
      // console.log(win);
      event.reply('create:product-response', response);

      // win.webContents.send('create:customer', response);
    } else {
      console.log(response.message);
    }
  };

  productRepo.create(data, callbackFunction);
});

ipcMain.on('update:product', (event, data) => {
  console.log('Inside Main update:product');
  console.log(data);
  const callbackFunction = (response, err) => {
    // const webContents = event.sender;
    // const win = BrowserWindow.fromWebContents(webContents);
    console.log('callback function called!!');
    if (err) {
      console.log(err);
    }

    if (response.status === STATUS.SUCCESS) {
      console.log('respose was success');
      // console.log(win);
      event.reply('update:product-response', response);

      // win.webContents.send('create:product', response);
    } else {
      console.log(response.message);
    }
  };

  productRepo.update(data, callbackFunction);
});

ipcMain.on('get:all:product', (event, data) => {
  console.log('Inside Main get:all:product');
  console.log(data);
  const callbackFunction = (response, err) => {
    // const webContents = event.sender;
    // const win = BrowserWindow.fromWebContents(webContents);
    console.log('callback function called!!');
    if (err) {
      console.log(err);
    }

    if (response.status === STATUS.SUCCESS) {
      console.log('respose was success');
      // console.log(win);
      event.reply('get:all:product-response', response);

      // win.webContents.send('create:customer', response);
    } else {
      console.log(response.message);
    }
  };

  productRepo.getAll(data, callbackFunction);
});

ipcMain.on('delete:product', (event, data) => {
  console.log('Inside Main delete:product');
  console.log(data);
  const callbackFunction = (response, err) => {
    // const webContents = event.sender;
    // const win = BrowserWindow.fromWebContents(webContents);
    console.log('callback function called!! for delete');
    if (err) {
      console.log(err);
    }

    if (response.status === STATUS.SUCCESS) {
      console.log('respose was success');
      // console.log(win);
      event.reply('delete:product-response', response);

      // win.webContents.send('create:customer', response);
    } else {
      console.log(response.message);
    }
  };

  productRepo.deleteRecords(data, callbackFunction);
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
