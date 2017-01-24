// @flow

import type { Auth, GetCustomersOptions } from './types';
import API from './API';

import Customer from './Customer';

export default class ContactHub {
  auth: Auth
  api: API

  constructor(params: Object) {
    if (!(params && params.token && params.workspaceId && params.nodeId)) {
      throw new Error('Missing required ContactHub configuration.');
    }
    this.auth = {
      token: params.token,
      workspaceId: params.workspaceId,
      nodeId: params.nodeId
    };
    this.api = new API(this.auth);
  }

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

  updateCustomer(customer: Customer): Promise<Customer> {
    const data = { ...customer, nodeId: this.auth.nodeId };
    return this.api.put({ endpoint: `customers/${customer.id}`, data })
      .then(data => new Customer(data));
  }

  patchCustomer(customerId: string, customer: Customer): Promise<Customer> {
    const data = { ...customer, id: customerId };
    return this.api.patch({ endpoint: `customers/${customerId}`, data })
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
