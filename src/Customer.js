// @flow

import type { Auth, Tags } from './types';

/* Dependencies */
import APIEntity from './APIEntity';

export default class Customer extends APIEntity {

  id: string
  externalId: ?string
  base: Object
  extended: Object
  extra: Object
  tags: Tags
  enabled: boolean

  constructor(auth: Auth, data: Object): void {
    super(auth);
    this.id = data.id;
    this.externalId = data.externalId;
    this.base = data.base;
    this.extended = data.extended;
    this.extra = data.extra;
    this.tags = data.tags;
    this.enabled = data.enabled;
  }

  updateCustomer(customer: Object): Promise<Customer> {
    return this.api.put({ endpoint: `customers/${this.id}`, data: { ...customer, id: this.id, nodeId: this.auth.nodeId } })
      .then((customer) => new Customer(this.auth, customer));
  }

  deleteCustomer(): Promise<Object> {
    return this.api.del({ endpoint: `customers/${this.id}` }).then(() => ({ deleted: true }));
  }

  addJob(job: Object): Promise<Object> {
    return this.api.post({ endpoint: `customers/${this.id}/jobs`, data: job });
  }

  updateJob(job: Object): Promise<Object> {
    return this.api.put({ endpoint: `customers/${this.id}/jobs/${job.id}`, data: job });
  }
}
