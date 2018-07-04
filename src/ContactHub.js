// @flow

import type {
  Auth, Education, Job, Like, Event, EventData,
  Customer, CustomerData,
  APICustomer, APICustomerData, APIBaseProperties, APIJob,
  GetCustomersOptions, EventFilters, Paginated,
  Query, AtomicConditionOperator
} from './types';
import API from './API';
import QueryBuilder, { AtomicCondition, SimpleQueryBuilder } from './QueryBuilder';
import { compact, formatToDate } from './utils';
import uuid from 'uuid';

const buildJob = (job: Job): APIJob => ({
  id: job.id,
  companyIndustry: job.companyIndustry,
  companyName: job.companyName,
  jobTitle: job.jobTitle,
  endDate: formatToDate(job.endDate),
  startDate: formatToDate(job.startDate),
  isCurrent: job.isCurrent
});

const buildCustomer = (data: CustomerData): APICustomerData => {
  const customer = {};
  if (data.externalId) { customer.externalId = data.externalId; }
  if (data.extended) { customer.extended = data.extended; }
  if (data.extra) { customer.extra = data.extra; }
  if (data.tags) { customer.tags = data.tags; }
  if (data.consents) { customer.consents = data.consents; }

  if (data.base) {
    const base = {
      ...data.base,
      dob: formatToDate(data.base.dob),
      jobs: data.base && data.base.jobs && data.base.jobs.map(buildJob)
    };
    customer.base = (compact(base): APIBaseProperties);
  }

  return customer;
};

const cleanCustomer = (data: APICustomer): Customer => {
  const customer = {};

  customer.id = data.id;
  customer.registeredAt = new Date(data.registeredAt);
  customer.updatedAt = new Date(data.updatedAt);

  if (data.externalId) { customer.externalId = data.externalId; }
  if (data.extended) { customer.extended = data.extended; }
  if (data.extra) { customer.extra = data.extra; }
  if (data.tags) { customer.tags = data.tags; }

  if (data.base) {

    const jobs = data.base.jobs && data.base.jobs.map(j => ({
      ...j,
      startDate: j.startDate && new Date(j.startDate)
    }));

    const likes = data.base && data.base.likes && data.base.likes.map(l => ({
      ...l,
      createdTime: l.createdTime && new Date(l.createdTime)
    }));

    const subscriptions = data.base && data.base.subscriptions &&
      data.base.subscriptions.map(s => ({
        ...s,
        registeredAt: s.registeredAt && new Date(s.registeredAt),
        startDate: s.startDate && new Date(s.startDate),
        endDate: s.endDate && new Date(s.endDate),
        updatedAt: s.updatedAt && new Date(s.updatedAt)
      }));

    /* Strip nulls and empty arrays recursively */
    const base = { ...data.base, jobs, likes, subscriptions };
    customer.base = (compact(base));

    // check for data.base is useful only to avoid a Flow warning
    if (data.base && data.base.dob) {
      customer.base.dob = new Date(data.base.dob);
    }

  }

  if (data.consents) {
    customer.consents = compact(data.consents);
    if (data.consents && data.consents.disclaimer && data.consents.disclaimer.date) {
      customer.consents.disclaimer.date = new Date(data.consents.disclaimer.date);
    }
  }

  return customer;
};

/**
 * Helper for adding 'page' to args.params object
 */

const buildArguments = (args: Object, newPage: number): Object => ({
  ...args,
  params: {
    ...args.params,
    page: newPage
  }
});

/**
 * Helper to create a recursive structure for paginated resources
 */

const buildPaginatedResource = (promise: Function, args: Object): Promise<Paginated<any>> => {
  return promise(args)
    .then(({ page: { number, totalPages }, elements }) => ({
      page: {
        current: number,
        prev: () => number > 0 && buildPaginatedResource(promise, buildArguments(args, number - 1)),
        next: () => number < totalPages && buildPaginatedResource(promise, buildArguments(args, number + 1)),
        total: totalPages
      },
      elements
    }));
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

  addCustomer(customerData: CustomerData): Promise<Customer> {
    const customer = buildCustomer(customerData);
    const data = {
      nodeId: this.auth.nodeId,
      externalId: customer.externalId,
      base: customer.base,
      consents: customer.consents,
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

  getCustomers(options: ?GetCustomersOptions): Promise<Paginated<Customer>> {
    const endpoint = 'customers';
    const params = {
      nodeId: this.auth.nodeId,
      externalId: options && options.externalId,
      fields: options && options.fields && options.fields.join(','),
      query: options && options.query,
      sort: options && options.sort
            && options.sort + (options.direction ? `,${options.direction}` : ''),
      page: options && options.page
    };

    return buildPaginatedResource(this.api.get.bind(this.api), { endpoint, params })
      .then(({ elements, page }) => ({ page, elements: elements.map(cleanCustomer) }));
  }

  updateCustomer(customerId: string, customerData: CustomerData): Promise<Customer> {
    const customer = buildCustomer(customerData);
    const data = {
      nodeId: this.auth.nodeId,
      id: customerId,
      externalId: customer.externalId,
      base: customer.base,
      consents: customer.consents,
      extended: customer.extended,
      extra: customer.extra,
      tags: customer.tags
    };

    return this.api.put({ endpoint: `customers/${customerId}`, data })
      .then(cleanCustomer);
  }

  patchCustomer(customerId: string, customerData: CustomerData): Promise<Customer> {
    const customer = buildCustomer(customerData);
    const data = {
      id: customerId,
      externalId: customer.externalId,
      base: customer.base,
      consents: customer.consents,
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

  addEducation(customerId: string, education: Education): Promise<Education> {
    return this.api.post({
      endpoint: `customers/${customerId}/educations`,
      data: education
    });
  }

  updateEducation(customerId: string, education: Education): Promise<Education> {
    return this.api.put({
      endpoint: `customers/${customerId}/educations/${education.id}`,
      data: education
    });
  }

  deleteEducation(customerId: string, educationId: string): Promise<boolean> {
    return this.api.delete({
      endpoint: `customers/${customerId}/educations/${educationId}`
    }).then(() => true);
  }

  addJob(customerId: string, job: Job): Promise<Job> {
    return this.api.post({
      endpoint: `customers/${customerId}/jobs`,
      data: buildJob(job)
    });
  }

  updateJob(customerId: string, job: Job): Promise<Job> {
    return this.api.put({
      endpoint: `customers/${customerId}/jobs/${job.id}`,
      data: buildJob(job)
    });
  }

  deleteJob(customerId: string, jobId: string): Promise<boolean> {
    return this.api.delete({
      endpoint: `customers/${customerId}/jobs/${jobId}`
    }).then(() => true);
  }

  addLike(customerId: string, like: Like): Promise<Like> {
    return this.api.post({
      endpoint: `customers/${customerId}/likes`,
      data: like
    });
  }

  updateLike(customerId: string, like: Like): Promise<Like> {
    return this.api.put({
      endpoint: `customers/${customerId}/likes/${like.id}`,
      data: like
    });
  }

  deleteLike(customerId: string, likeId: string): Promise<boolean> {
    return this.api.delete({
      endpoint: `customers/${customerId}/likes/${likeId}`
    }).then(() => true);
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
      properties: event.properties,
      context: event.context,
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

  getEvents(customerId: string, filters?: EventFilters): Promise<Paginated<Event>> {
    return buildPaginatedResource(this.api.get.bind(this.api), {
      endpoint: 'events',
      params: { customerId, ...(filters || {} ) }
    });
  }

  async addTag(customerId: string, tag: string): Promise<Customer> {
    const customer = await this.getCustomer(customerId);

    // if the customer has no previous tags
    if (!customer.tags) {
      customer.tags = { auto: [], manual: [tag] };

      return this.updateCustomer(customerId, customer);
    }

    const oldTags = customer.tags;

    // if the tag is already present
    if (oldTags.manual.indexOf(tag) !== -1) {
      return Promise.resolve(customer);
    }

    const newCustomer = { ...customer, tags: {
      auto: oldTags.auto,
      manual: [...oldTags.manual, tag]
    } };

    return this.updateCustomer(customerId, newCustomer);
  }

  async removeTag(customerId: string, tag: string): Promise<Customer> {
    const customer = await this.getCustomer(customerId);

    // if the customer has no previous tags
    if (!customer.tags) {
      return Promise.resolve(customer);
    }

    const oldTags = customer.tags;

    // if the tag to remove is not present
    if (oldTags.manual.indexOf(tag) === -1) {
      return Promise.resolve(customer);
    }

    const newCustomer = { ...customer, tags: {
      auto: oldTags.auto,
      manual: oldTags.manual.filter(t => t !== tag)
    } };

    return this.updateCustomer(customerId, newCustomer);
  }

  createQuery(attribute: string, operator: AtomicConditionOperator, value?: any): Query {
    return new QueryBuilder('default-query-builder')
      .simpleQuery(
        new SimpleQueryBuilder()
          .condition(new AtomicCondition(attribute, operator, value))
      )
      .build();
  }
}

export { QueryBuilder };
