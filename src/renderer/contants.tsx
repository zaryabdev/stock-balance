export const STATUS = {
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
};

export const SOURCE = {
  memory: 'MEMORY',
  database: 'DATABASE',
};

export const STATE = {
  none: 'NONE',
  created: 'CREATED',
  updated: 'UPDATED',
  deleted: 'DELETED',
  archived: 'ARCHIVED',
  unarchived: 'UNARCHIVED',
};

export const TYPE = {
  customer: 'CUSTOMER',
  walkinCustomer: 'WALKIN_CUSTOMER',
  vendor: 'VENDOR',
  both: 'BOTH',
  deleted: 'DELETED',
  archived: 'ARCHIVED',
  unarchived: 'UNARCHIVED',
};

export const MODE = {
  create: 'CREATE',
  update: 'UPDATE',
};

export const RECORD_TYPE = {
  none: '',
  payment: 'Payment',
  previous_balance: 'Previous Balance',
};

export const TYPE_COLOR_PALLETE: TYPE_COLOR_PALLETE_I = {
  CUSTOMER: 'cyan',
  WALKIN_CUSTOMER: 'gold',
  VENDOR: 'green',
  ARCHIVED: 'rgb(128, 128, 128)',
  DELETED: 'red',
  unarchived: 'yellow',
};

interface TYPE_COLOR_PALLETE_I {
  CUSTOMER: string;
  WALKIN_CUSTOMER: string;
  VENDOR: string;
  ARCHIVED: string;
  DELETED: string;
  unarchived: string;
}
