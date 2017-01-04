// @flow

import type { Auth } from './types';

/* Dependencies */
import APIEntity from './APIEntity';
import Customer from './Customer';

export default class ContactHub extends APIEntity {
  auth: Auth
  api: Object

  addCustomer = (customer: Object): Promise<Customer> => {
    return this.api.post({
      endpoint: 'customers',
      data: {
        nodeId: this.auth.nodeId,
        base: customer.base
      }
    })
    .then(this.toCustomer);
  }

  getCustomer = (customerId: string): Promise<Object> => {
    return this.api.get({ endpoint: `customers/${customerId}` })
      .then(this.toCustomer);
  }

  getCustomers = (): Promise<Array<Object>> => {
    return this.api.get({ endpoint: 'customers' })
      .then(data => data._embedded.customers)
      .then(this.toCustomer);
  }

  updateCustomer = (customerId: string, customer: Object): Promise<Customer> => {
    return this.api.put({ endpoint: `customers/${customerId}`, data: customer })
      .then(this.toCustomer);
  }

  deleteCustomer = (customerId: string) => {
    return this.api.del({ endpoint: `customers/${customerId}` }).then(() => ({ deleted: true }));
  }

  addJob = (customerId: string, job: Object): Promise<Object> => {
    return this.api.post({ endpoint: `customers/${customerId}/jobs`, data: job });
  }

  updateJob = (customerId: string, job: Object): Promise<Object> => {
    return this.api.put({ endpoint: `customers/${customerId}/jobs/${job.id}`, data: job });
  }

  toCustomer = (data: Object) => {
    if (Array.isArray(data)) {
      return data.map(d => new Customer(this.auth, d));
    } else if (typeof data === 'object') {
      return new Customer(this.auth, data);
    }
    return data;
  }

}
