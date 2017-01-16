// @flow

import type { BaseProperties, Tags } from './types';
import { compact } from './utils';

export default class Customer {

  id: string
  externalId: ?string
  base: BaseProperties
  extended: ?Object
  extra: ?string
  tags: ?Tags

  constructor(data: Object): void {
    ['id', 'externalId', 'extended', 'extra', 'tags'].forEach(key => {
      if (data[key]) {
        (this: any)[key] = data[key];
      }
    });

    /* Strip nulls and empty arrays recursively from `base` */
    if (data.base) {
      this.base = compact(data.base);
    }
  }

}
