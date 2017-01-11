// @flow

import type { Auth } from './types';

/* Dependencies */
import APIEntity from './APIEntity';
import Customer from './Customer';

export default class ContactHub extends APIEntity {
  auth: Auth
  api: Object

  addCustomer(customer: Customer): Promise<Customer> {
    return this.api.post({
      endpoint: 'customers',
      data: {
        nodeId: this.auth.nodeId,
        base: customer.base
      }
    })
    .then(this.toCustomer.bind(this));
  }

  getCustomer(customerId: string): Promise<Customer> {
    return this.api.get({ endpoint: `customers/${customerId}` })
      .then((data) => this.toCustomer(data));
  }

  getCustomers(): Promise<Array<Customer>> {
    return this.api.get({ endpoint: 'customers' })
      .then(({ elements }) => elements)
      .then(this.toCustomer.bind(this));
  }

  updateCustomer(customerId: string, customer: Customer): Promise<Customer> {
    const data = { ...customer, nodeId: this.auth.nodeId };

    return this.api.put({ endpoint: `customers/${customerId}`, data })
      .then(this.toCustomer.bind(this));
  }

  deleteCustomer(customerId: string) {
    return this.api.del({ endpoint: `customers/${customerId}` }).then(() => ({ deleted: true }));
  }

  addJob(customerId: string, job: Object): Promise<Object> {
    return this.api.post({ endpoint: `customers/${customerId}/jobs`, data: job });
  }

  updateJob(customerId: string, job: Object): Promise<Object> {
    return this.api.put({ endpoint: `customers/${customerId}/jobs/${job.id}`, data: job });
  }

  toCustomer(data: Object): Customer {
    if (Array.isArray(data)) {
      return data.map(d => new Customer(d));
    } else if (typeof data === 'object') {
      return new Customer(data);
    }
    return data;
  }

}
