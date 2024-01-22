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
};

export const TYPE = {
  customer: 'CUSTOMER',
  walkingCustomer: 'WALKING_CUSTOMER',
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

export const TYPE_COLOR_PALLETE = {
  CUSTOMER: 'cyan',
  WALKING_CUSTOMER: 'gold',
  VENDOR: 'green',
  ARCHIVED: 'rgb(128, 128, 128)',
  DELETED: 'red',
  unarchived: 'yellow',
};
