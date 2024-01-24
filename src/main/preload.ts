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
      console.log('Inside preload get:all:customer');
      console.log(data);
      return ipcRenderer.sendSync('get:all:customer', data);
    },
    createCustomer(data) {
      console.log('Inside preload create:customer');
      console.log(data);
      // ipcRenderer.send('create:customer', data);
    },
    updateCustomer(data) {
      console.log('Inside preload update:customer');
      console.log(data);
      // ipcRenderer.send('update:customer', data);
    },

    deleteCustomers(data) {
      console.log('Inside preload delete:customer');
      console.log(data);
      // ipcRenderer.send('delete:customer', data);
    },
    archiveCustomers(data) {
      console.log('Inside preload archive:customer');
      console.log(data);
      // ipcRenderer.send('archive:customer', data);
    },
    unarchiveCustomers(data) {
      console.log('Inside preload unarchive:customer');
      console.log(data);
      // ipcRenderer.send('unarchive:customer', data);
    },
    createCustomerInvoice(data) {
      console.log('Inside preload create:customer-invoice');
      console.log(data);
      // ipcRenderer.send('create:customer-invoice', data);
    },
    updateCustomerInvoice(data) {
      console.log('Inside preload update:customer-invoice');
      console.log(data);
      // ipcRenderer.send('update:customer-invoice', data);
    },
    deleteCustomerInvoice(data) {
      console.log('Inside preload delete:customer-invoice');
      console.log(data);
      // ipcRenderer.send('delete:customer-invoice', data);
    },
    deleteDuplicatedCustomerInvoice(data) {
      console.log('Inside preload delete:duplicated-customer-invoice');
      console.log(data);
      // ipcRenderer.send('delete:duplicated-customer-invoice', data);
    },
    getAllCustomersInvoice(data) {
      console.log('Inside preload get:all:customer-invoices');
      console.log(data);
      // ipcRenderer.send('get:all:customer-invoices', data);
    },
    getAllCustomerInvoicesById(data) {
      console.log('Inside preload get:all:customer-invoices:id');
      console.log(data);
      // ipcRenderer.send('get:all:customer-invoices:id', data);
    },
    deleteCustomersInvoice(data) {
      console.log('Inside preload delete:customer-invoice');
      console.log(data);
      // ipcRenderer.send('delete:customer-invoice', data);
    },

    createBalance(data) {
      console.log('Inside preload create:balance');
      console.log(data);
      // ipcRenderer.send('create:balance', data);
    },
    updateBalance(data) {
      console.log('Inside preload update:balance');
      console.log(data);
      // ipcRenderer.send('update:balance', data);
    },
    getAllBalance(data) {
      console.log('Inside preload get:all:balance');
      console.log(data);
      // ipcRenderer.send('get:all:balance', data);
    },
    deleteBalance(data) {
      console.log('Inside preload delete:balance');
      console.log(data);
      // ipcRenderer.send('delete:balance', data);
    },

    createProduct(data) {
      console.log('Inside preload create:product');
      console.log(data);
      // ipcRenderer.send('create:product', data);
    },
    updateProduct(data) {
      console.log('Inside preload update:product');
      console.log(data);
      // ipcRenderer.send('update:product', data);
    },
    getAllProduct(data) {
      console.log('Inside preload get:all:product');
      console.log(data);
      // ipcRenderer.send('get:all:product', data);
    },
    deleteProduct(data) {
      console.log('Inside preload delete:product');
      console.log(data);
      // ipcRenderer.send('delete:product', data);
    },

    // on(channel, func) {
    //   const validChannels = ['create:customer-response'];
    //   console.log('Inside on Channel check');
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
