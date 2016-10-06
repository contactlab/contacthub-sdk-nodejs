// @flow

import type {
  Auth,
  APICustomer,
  SDKCustomer,
  CustomerData,
  CustomerJob
} from './types';

/* Dependencies */

const curry = require('lodash.curry');
const axios = require('axios');

/* Constants */

const baseUrl = 'https://api.contactlab.it/hub/v1';

/* Internal abstractions */

const headers = (token: string) => ({
  Authorization: `Bearer ${token}`
});

const get = (auth: Auth, opts: Object) => axios({
  method: 'get',
  url: `${baseUrl}/workspaces/${auth.workspaceId}/${opts.endpoint}`,
  headers: headers(auth.token),
  params: {
    nodeId: auth.nodeId
  }
});

const post = (auth: Auth, opts: Object) => axios({
  method: 'post',
  url: `${baseUrl}/workspaces/${auth.workspaceId}/${opts.endpoint}`,
  headers: headers(auth.token),
  data: opts.data
});

const put = (auth: Auth, opts: Object) => axios({
  method: 'put',
  url: `${baseUrl}/workspaces/${auth.workspaceId}/${opts.endpoint}`,
  headers: headers(auth.token),
  data: opts.data
});

const del = (auth: Auth, opts: Object) => axios({
  method: 'delete',
  url: `${baseUrl}/workspaces/${auth.workspaceId}/${opts.endpoint}`,
  headers: headers(auth.token),
  params: {
    nodeId: auth.nodeId
  }
});

/* Public SDK methods */

const getCustomer = (auth: Auth, customerId: string): Promise<SDKCustomer> =>
get(auth, {
  endpoint: `customers/${customerId}`
}).then(res => Promise.resolve(CustomerFactory(auth, res.data)));

const getCustomers = (auth: Auth): Promise<Array<SDKCustomer>> =>
get(auth, {
  endpoint: 'customers'
}).then(res => Promise.resolve(res.data._embedded.customers.map(
  curry(CustomerFactory)(auth)
)));

const addCustomer = (
  auth: Auth, customer: CustomerData
): Promise<SDKCustomer> => post(auth, {
  endpoint: 'customers',
  data: {
    nodeId: auth.nodeId,
    base: customer.base
  }
}).then(res => Promise.resolve(CustomerFactory(auth, res.data)));

const updateCustomer = (
  auth: Auth, customerId: string, customer: CustomerData
): Promise<SDKCustomer> => {
  if (!customerId) {
    throw new Error('Missing "id" property, cannot update customer');
  }

  return put(auth, {
    endpoint: `customers/${customerId}`,
    data: {
      nodeId: auth.nodeId,
      base: customer.base,
      extended: customer.extended || {},
      extra: customer.extra || ''
    }
  }).then(res => Promise.resolve(CustomerFactory(auth, res.data)));
};

const deleteCustomer = (
  auth: Auth, customerId: string
) => del(auth, {
  endpoint: `customers/${customerId}`
}).then(() => Promise.resolve({ deleted: true }));

const addJob = (
  auth: Auth, customerId: string, job: CustomerJob
) => post(auth, {
  endpoint: `customers/${customerId}/jobs`,
  data: job
}).then(res => Promise.resolve(res.data));

const updateJob = (
  auth: Auth, customerId: string, job: CustomerJob
) => put(auth, {
  endpoint: `customers/${customerId}/jobs/${job.id}`,
  data: job
}).then(res => Promise.resolve(res.data));

/* CustomeryFactory: APICustomer -> SDKCustomer */

const CustomerFactory = (auth: Auth, data: APICustomer): SDKCustomer => ({
  // Public properties
  id: data.id,
  externalId: data.externalId,
  base: data.base,
  extended: data.extended,
  extra: data.extra,
  tags: data.tags,
  enabled: data.enabled,
  // SDK methods
  updateCustomer: curry(updateCustomer)(auth, data.id),
  deleteCustomer: () => curry(deleteCustomer)(auth, data.id),
  addJob: curry(addJob)(auth, data.id),
  updateJob: curry(updateJob)(auth, data.id)
});

/* === Single exported function === */

const ContactHub = (params: Auth): Object => {
  if (typeof params !== 'object'
      || !(params.token && params.workspaceId && params.nodeId)) {
    throw new Error('Missing required ContactHub configuration.');
  }

  const auth = {
    token: params.token,
    workspaceId: params.workspaceId,
    nodeId: params.nodeId
  };

  return {
    getCustomer: curry(getCustomer)(auth),
    getCustomers: () => curry(getCustomers)(auth),
    addCustomer: curry(addCustomer)(auth),
    updateCustomer: curry(updateCustomer)(auth),
    deleteCustomer: curry(deleteCustomer)(auth),
    addJob: curry(addJob)(auth),
    updateJob: curry(updateJob)(auth)
  };
};

module.exports = ContactHub;
