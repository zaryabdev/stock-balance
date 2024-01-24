// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type MEDIA_CHANNELS = String;

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: MEDIA_CHANNELS, ...args: unknown[]) {
      // ipcRenderer.send(channel, ...args);
    },
    getAllCustomers(data) {
      console.log(
        '%c Inside preload get:all:customer',
        'background: #222; color: #bada55',
      );
      console.log(data);
      return ipcRenderer.sendSync('get:all:customer', data);
    },
    createCustomer(data) {
      console.log(
        '%c Inside preload create:customer',
        'background: #222; color: #bada55',
      );
      console.log(data);
      return ipcRenderer.sendSync('create:customer', data);
    },
    updateCustomer(data) {
      console.log(
        '%c Inside preload update:customer',
        'background: #222; color: #bada55',
      );
      console.log(data);
      return ipcRenderer.sendSync('update:customer', data);
    },

    deleteCustomers(data) {
      console.log(
        '%c Inside preload delete:customer',
        'background: #222; color: #bada55',
      );
      console.log(data);
      return ipcRenderer.sendSync('delete:customer', data);
    },
    archiveCustomers(data) {
      console.log(
        '%c Inside preload archive:customer',
        'background: #222; color: #bada55',
      );
      console.log(data);
      return ipcRenderer.sendSync('archive:customer', data);
    },
    unarchiveCustomers(data) {
      console.log(
        '%c Inside preload unarchive:customer',
        'background: #222; color: #bada55',
      );
      console.log(data);
      return ipcRenderer.sendSync('unarchive:customer', data);
    },
    createCustomerInvoice(data) {
      console.log(
        '%c Inside preload create:customer-invoice',
        'background: #222; color: #bada55',
      );
      console.log(data);
      // ipcRenderer.send('create:customer-invoice', data);
    },
    updateCustomerInvoice(data) {
      console.log(
        '%c Inside preload update:customer-invoice',
        'background: #222; color: #bada55',
      );
      console.log(data);
      // ipcRenderer.send('update:customer-invoice', data);
    },
    deleteCustomerInvoice(data) {
      console.log(
        '%c Inside preload delete:customer-invoice',
        'background: #222; color: #bada55',
      );
      console.log(data);
      // ipcRenderer.send('delete:customer-invoice', data);
    },
    deleteDuplicatedCustomerInvoice(data) {
      console.log(
        '%c Inside preload delete:duplicated-customer-invoice',
        'background: #222; color: #bada55',
      );
      console.log(data);
      // ipcRenderer.send('delete:duplicated-customer-invoice', data);
    },
    getAllCustomersInvoice(data) {
      console.log(
        '%c Inside preload get:all:customer-invoices',
        'background: #222; color: #bada55',
      );
      console.log(data);
      // ipcRenderer.send('get:all:customer-invoices', data);
    },
    getAllCustomerInvoicesById(data) {
      console.log(
        '%c Inside preload get:all:customer-invoices:id',
        'background: #222; color: #bada55',
      );
      console.log(data);
      // ipcRenderer.send('get:all:customer-invoices:id', data);
    },
    deleteCustomersInvoice(data) {
      console.log(
        '%c Inside preload delete:customer-invoice',
        'background: #222; color: #bada55',
      );
      console.log(data);
      // ipcRenderer.send('delete:customer-invoice', data);
    },

    createBalance(data) {
      console.log(
        '%c Inside preload create:balance',
        'background: #222; color: #bada55',
      );
      console.log(data);
      // ipcRenderer.send('create:balance', data);
    },
    updateBalance(data) {
      console.log(
        '%c Inside preload update:balance',
        'background: #222; color: #bada55',
      );
      console.log(data);
      // ipcRenderer.send('update:balance', data);
    },
    getAllBalance(data) {
      console.log(
        '%c Inside preload get:all:balance',
        'background: #222; color: #bada55',
      );

      console.log(data);
      // ipcRenderer.send('get:all:balance', data);
    },
    deleteBalance(data) {
      console.log(
        '%c Inside preload delete:balance',
        'background: #222; color: #bada55',
      );
      console.log(data);
      // ipcRenderer.send('delete:balance', data);
    },

    createProduct(data) {
      console.log(
        '%c Inside preload create:product',
        'background: #222; color: #bada55',
      );
      console.log(data);
      return ipcRenderer.sendSync('create:product', data);
    },
    updateProduct(data) {
      console.log(
        '%c Inside preload update:product',
        'background: #222; color: #bada55',
      );
      console.log(data);
      return ipcRenderer.sendSync('update:product', data);
    },
    getAllProducts(data) {
      console.log(
        '%c Inside preload get:all:product',
        'background: #222; color: #bada55',
      );
      console.log(data);
      return ipcRenderer.sendSync('get:all:product', data);
    },
    deleteProduct(data) {
      console.log(
        '%c Inside preload delete:product',
        'background: #222; color: #bada55',
      );
      console.log(data);
      return ipcRenderer.sendSync('delete:product', data);
    },

    // on(channel, func) {
    //   const validChannels = ['create:customer-response'];
    //   console.log('Inside on Channel check', 'background: #222; color: #bada55');
    //   if (validChannels.includes(channel)) {
    //     ;
    //     console.log('Yooo channel' + channel);
    //     ipcRenderer.on(channel, (event, ...args) => func(...args));
    //   }
    // },
    on(channel: MEDIA_CHANNELS, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: MEDIA_CHANNELS, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    removeAllListeners(
      channel: MEDIA_CHANNELS,
      func: (...args: unknown[]) => void,
    ) {
      ipcRenderer.removeAllListeners(channel);
    },
  },
  store: {
    get(key: any) {
      // return ipcRenderer.sendSync('electron-store-get', key);
    },
    set(property: any, val: any) {
      // ipcRenderer.send('electron-store-set', property, val);
    },
    // Other method you want to add like has(), reset(), etc.
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
