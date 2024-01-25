// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
const log = (message) =>
  console.log(
    `%c Inside preload : ${message} `,
    'background: #222; color: #bada55',
  );

export type MEDIA_CHANNELS = String;

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: MEDIA_CHANNELS, ...args: unknown[]) {
      // ipcRenderer.send(channel, ...args);
    },
    getAllCustomers(data) {
      log('getAllCustomers');
      console.log(data);
      return ipcRenderer.sendSync('get:all:customer', data);
    },
    createCustomer(data) {
      log('createCustomer');

      console.log(data);
      return ipcRenderer.sendSync('create:customer', data);
    },
    updateCustomer(data) {
      log('updateCustomer');

      console.log(data);
      return ipcRenderer.sendSync('update:customer', data);
    },

    deleteCustomers(data) {
      log('deleteCustomers');
      console.log(data);
      return ipcRenderer.sendSync('delete:customer', data);
    },
    archiveCustomers(data) {
      log('archiveCustomers');

      console.log(data);
      return ipcRenderer.sendSync('archive:customer', data);
    },
    unarchiveCustomers(data) {
      log('unarchiveCustomers');
      console.log(data);
      return ipcRenderer.sendSync('unarchive:customer', data);
    },
    createCustomerInvoice(data) {
      log('createCustomerInvoice');
      console.log(data);
      return ipcRenderer.send('create:customer-invoice', data);
    },
    updateCustomerInvoice(data) {
      log('updateCustomerInvoice');

      console.log(data);
      return ipcRenderer.send('update:customer-invoice', data);
    },
    deleteCustomerInvoice(data) {
      log('deleteCustomerInvoice');
      console.log(data);
      return ipcRenderer.sendSync('delete:customer-invoice', data);
    },
    deleteDuplicatedCustomerInvoice(data) {
      log('deleteDuplicatedCustomerInvoice');
      console.log(data);
      return ipcRenderer.sendSync('delete:duplicated-customer-invoice', data);
    },
    getAllCustomersInvoice(data) {
      log('getAllCustomersInvoice');
      console.log(data);
      return ipcRenderer.sendSync('get:all:customer-invoices', data);
    },
    getAllCustomerInvoicesById(data) {
      log('getAllCustomerInvoicesById');
      console.log(data);
      return ipcRenderer.sendSync('get:all:customer-invoices:id', data);
    },
    // TODO
    deleteCustomersInvoice(data) {
      log('deleteCustomersInvoice');
      console.log(data);
      return ipcRenderer.sendSync('delete:customer-invoice', data);
    },
    createProduct(data) {
      log('createProduct');
      console.log(data);
      return ipcRenderer.sendSync('create:product', data);
    },
    updateProduct(data) {
      log('updateProduct');
      console.log(data);
      return ipcRenderer.sendSync('update:product', data);
    },
    getAllProducts(data) {
      log('getAllProducts');
      console.log(data);
      return ipcRenderer.sendSync('get:all:product', data);
    },
    deleteProduct(data) {
      log('deleteProduct');
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
      return ipcRenderer.sendSync('electron-store-get', key);
    },
    getAll() {
      return ipcRenderer.sendSync('electron-store-get-all');
    },
    set(property: any, val: any) {
      return ipcRenderer.sendSync('electron-store-set', property, val);
    },
    // Other method you want to add like has(), reset(), etc.
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
