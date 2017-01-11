// @flow

import type { BaseProperties, Tags } from './types';

const sanitize = (obj) => {
  Object.keys(obj).forEach(key => {
    if (obj[key] === null) {
      delete obj[key];
    } else if (Array.isArray(obj[key]) && obj[key].length === 0) {
      delete obj[key];
    } else if (typeof obj[key] === 'object') {
      sanitize(obj[key]);
    }
  });
  return obj;
};

export default class Customer {

  id: string
  externalId: ?string
  base: BaseProperties
  extended: ?Object
  extra: ?string
  tags: ?Tags

  constructor(data: Object): void {
    ['id', 'externalId', 'extended', 'extra', 'tags'].forEach(key => {
      if (data[key]) (this: any)[key] = data[key];
    });

    /* Strip nulls and empty arrays recursively from `base` */
    if (data.base) this.base = sanitize(data.base);
  }

}
