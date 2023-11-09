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
