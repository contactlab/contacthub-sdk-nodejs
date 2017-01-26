// @flow

import type {
  Auth, BaseProperties, Customer, CustomerData, APICustomer, GetCustomersOptions, Job
} from './types';
import API from './API';
import { compact } from './utils';

const cleanCustomer = (data: APICustomer): Customer => {
  const customer = {};

  customer.id = data.id;
  customer.registeredAt = new Date(data.registeredAt);
  customer.updatedAt = new Date(data.updatedAt);

  if (data.externalId) { customer.externalId = data.externalId; }
  if (data.extended) { customer.extended = data.extended; }
  if (data.extra) { customer.extra = data.extra; }
  if (data.tags) { customer.tags = data.tags; }

  /* Strip nulls and empty arrays recursively from `base` */
  if (data.base) { customer.base = (compact(data.base): BaseProperties); }

  return customer;
};

export default class ContactHub {
  auth: Auth
  api: API

  constructor(params: Auth) {
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

  addCustomer(customer: CustomerData): Promise<Customer> {
    const data = {
      nodeId: this.auth.nodeId,
      externalId: customer.externalId,
      base: customer.base,
      extended: customer.extended,
      extra: customer.extra,
      tags: customer.tags
    };

    return this.api.post({
      endpoint: 'customers',
      data
    }).then(data => cleanCustomer(data));
  }

  getCustomer(customerId: string): Promise<Customer> {
    return this.api.get({ endpoint: `customers/${customerId}` })
      .then(data => cleanCustomer(data));
  }

  getCustomers(options: ?GetCustomersOptions): Promise<Array<Customer>> {
    const endpoint = 'customers';
    const params = {
      nodeId: this.auth.nodeId,
      externalId: options && options.externalId,
      fields: options && options.fields && options.fields.join(','),
      query: options && options.query,
      sort: options && options.sort
            && options.sort + (options.direction ? `,${options.direction}` : '')
    };

    return this.api.get({ endpoint, params })
      .then(data => data.elements.map(d => cleanCustomer(d)));
  }

  updateCustomer(customerId: string, customer: CustomerData): Promise<Customer> {
    const data = {
      nodeId: this.auth.nodeId,
      id: customerId,
      externalId: customer.externalId,
      base: customer.base,
      extended: customer.extended,
      extra: customer.extra,
      tags: customer.tags
    };

    return this.api.put({ endpoint: `customers/${customerId}`, data })
      .then(data => cleanCustomer(data));
  }

  patchCustomer(customerId: string, customer: CustomerData): Promise<Customer> {
    const data = {
      id: customerId,
      externalId: customer.externalId,
      base: customer.base,
      extended: customer.extended,
      extra: customer.extra,
      tags: customer.tags
    };

    return this.api.patch({ endpoint: `customers/${customerId}`, data })
      .then(data => cleanCustomer(data));
  }

  deleteCustomer(customerId: string): Promise<boolean> {
    const endpoint = `customers/${customerId}`;
    const params = { nodeId: this.auth.nodeId };

    return this.api.delete({ endpoint, params }).then(() => true);
  }

  addJob(customerId: string, job: Job): Promise<Job> {
    return this.api.post({
      endpoint: `customers/${customerId}/jobs`,
      data: job
    });
  }

  updateJob(customerId: string, job: Job): Promise<Job> {
    return this.api.put({
      endpoint: `customers/${customerId}/jobs/${job.id}`,
      data: job
    });
  }

}
