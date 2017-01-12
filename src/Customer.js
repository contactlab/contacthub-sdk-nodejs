// @flow

import type { BaseProperties, Tags } from './types';

// Remove "null" values and empty arrays
const sanitize = (obj) =>  Object.keys(obj).reduce((acc, key) => {
  const value = obj[key];
  if (value === null || Array.isArray(value) && value.length === 0) {
    return acc;
  }

  if (Array.isArray(value)) {
    return {
      ...acc,
      [key]: value.map(sanitize)
    };
  }

  return {
    ...acc,
    [key]: typeof value === 'object' ? sanitize(value) : value
  };
}, {});

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
