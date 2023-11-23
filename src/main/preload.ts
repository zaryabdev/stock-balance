// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type MEDIA_CHANNELS = String;

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: MEDIA_CHANNELS, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    createCustomer(data) {
      console.log('Inside preload create:customer');
      console.log(data);
      ipcRenderer.send('create:customer', data);
    },
    updateCustomer(data) {
      console.log('Inside preload update:customer');
      console.log(data);
      ipcRenderer.send('update:customer', data);
    },
    getAllCustomers(data) {
      console.log('Inside preload get:all:customers');
      console.log(data);
      ipcRenderer.send('get:all:customers', data);
    },
    deleteCustomers(data) {
      console.log('Inside preload delete:customers');
      console.log(data);
      ipcRenderer.send('delete:customers', data);
    },
    createCustomerInvoice(data) {
      console.log('Inside preload create:customer-invoice');
      console.log(data);
      ipcRenderer.send('create:customer-invoice', data);
    },
    updateCustomerInvoice(data) {
      console.log('Inside preload update:customer-invoice');
      console.log(data);
      ipcRenderer.send('update:customer-invoice', data);
    },
    getAllCustomersInvoice(data) {
      console.log('Inside preload get:all:customers-invoice');
      console.log(data);
      ipcRenderer.send('get:all:customers-invoice', data);
    },
    getAllCustomerInvoicesById(data) {
      console.log('Inside preload get:all:customer-invoices:id');
      console.log(data);
      ipcRenderer.send('get:all:customer-invoices:id', data);
    },
    deleteCustomersInvoice(data) {
      console.log('Inside preload delete:customers-invoice');
      console.log(data);
      ipcRenderer.send('delete:customers-invoice', data);
    },

    createStock(data) {
      console.log('Inside preload create:stock');
      console.log(data);
      ipcRenderer.send('create:stock', data);
    },
    updateStock(data) {
      console.log('Inside preload update:stock');
      console.log(data);
      ipcRenderer.send('update:stock', data);
    },
    getAllStock(data) {
      console.log('Inside preload get:all:stock');
      console.log(data);
      ipcRenderer.send('get:all:stock', data);
    },
    deleteStock(data) {
      console.log('Inside preload delete:stock');
      console.log(data);
      ipcRenderer.send('delete:stock', data);
    },

    createProduct(data) {
      console.log('Inside preload create:product');
      console.log(data);
      ipcRenderer.send('create:product', data);
    },
    updateProduct(data) {
      console.log('Inside preload update:product');
      console.log(data);
      ipcRenderer.send('update:product', data);
    },
    getAllProduct(data) {
      console.log('Inside preload get:all:product');
      console.log(data);
      ipcRenderer.send('get:all:product', data);
    },
    deleteProduct(data) {
      console.log('Inside preload delete:product');
      console.log(data);
      ipcRenderer.send('delete:product', data);
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
  },
  store: {
    get(key: any) {
      return ipcRenderer.sendSync('electron-store-get', key);
    },
    set(property: any, val: any) {
      ipcRenderer.send('electron-store-set', property, val);
    },
    // Other method you want to add like has(), reset(), etc.
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
