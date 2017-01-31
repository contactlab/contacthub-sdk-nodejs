// @flow

import type {
  Auth, Job, Event, EventData,
  Customer, CustomerData, BaseProperties, APICustomer, GetCustomersOptions
} from './types';
import API from './API';
import { compact } from './utils';
import uuid from 'uuid';

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

  createSessionId(): string {
    return uuid.v4();
  }

  addCustomerSession(customerId: string, sessionId: string): Promise<boolean> {
    const endpoint = `customers/${customerId}/sessions`;
    const data = { value: sessionId };

    return this.api.post({ endpoint, data }).then(() => true);
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
    }).then(cleanCustomer);
  }

  getCustomer(customerId: string): Promise<Customer> {
    return this.api.get({ endpoint: `customers/${customerId}` })
      .then(cleanCustomer);
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
      .then(data => data.elements.map(cleanCustomer));
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
      .then(cleanCustomer);
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
      .then(cleanCustomer);
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

  addEvent(event: EventData): Promise<boolean> {
    if (!(event.customerId || event.externalId || event.sessionId)) {
      throw new Error(
        'Cannot create an event without customerId, externalId or sessionId'
      );
    }

    const bringBackProperties = event.customerId ? undefined : {
      type: event.externalId ? 'EXTERNAL_ID' : 'SESSION_ID',
      value: event.externalId ? event.externalId : event.sessionId,
      nodeId: this.auth.nodeId
    };

    const data = {
      bringBackProperties,
      customerId: event.customerId,
      type: event.type,
      context: event.context,
      properties: event.properties,
      contextInfo: event.contextInfo,
      date: event.date && event.date.toISOString() || new Date().toISOString()
    };

    return this.api.post({
      endpoint: 'events', data
    }).then(() => true);
  }

  getEvent(eventId: string): Promise<Event> {
    return this.api.get({ endpoint: `events/${eventId}` });
  }

  getEvents(customerId: string): Promise<Array<Event>> {
    return this.api.get({
      endpoint: 'events',
      params: { customerId }
    })
    .then(data => data.elements);
  }

}
