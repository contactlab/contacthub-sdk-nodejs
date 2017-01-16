// @flow

import type { Auth } from './types';
import type API from './API';

import APIEntity from './APIEntity';
import Customer from './Customer';

export default class ContactHub extends APIEntity {
  auth: Auth
  api: API

  addCustomer(customer: Customer): Promise<Customer> {
    return this.api.post({
      endpoint: 'customers',
      data: {
        nodeId: this.auth.nodeId,
        base: customer.base
      }
    }).then(data => new Customer(data));
  }

  getCustomer(customerId: string): Promise<Customer> {
    return this.api.get({ endpoint: `customers/${customerId}` })
      .then(data => new Customer(data));
  }

  getCustomers(): Promise<Array<Customer>> {
    return this.api.get({ endpoint: 'customers' })
      .then(({ elements }) => elements)
      .then(data => data.map(d => new Customer(d)));
  }

  updateCustomer(customerId: string, customer: Customer): Promise<Customer> {
    const data = { ...customer, nodeId: this.auth.nodeId };

    return this.api.put({ endpoint: `customers/${customerId}`, data })
      .then(data => new Customer(data));
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

}
