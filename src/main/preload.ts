// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'ipc-example';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    createPackingType(preloadData) {
      console.log('Inside preload create:packing_type');
      console.log({ preloadData });
      ipcRenderer.send('create:packing_type', preloadData);
    },
    updatePackingType(preloadData) {
      console.log('Inside preload update:packing_type');
      console.log({ preloadData });

      ipcRenderer.send('update:packing_type', preloadData);
    },
    deletePackingType(preloadData) {
      console.log('Inside preload delete:packing_type');
      console.log({ preloadData });

      ipcRenderer.send('delete:packing_type', preloadData);
    },
    getAllPackingTypes(preloadData) {
      console.log('Inside preload get:packing_types');
      console.log({ preloadData });

      ipcRenderer.send('get:packing_types', preloadData);
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
