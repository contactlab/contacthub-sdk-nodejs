// @flow

/* Dependencies */

const axios = require('axios');

/* Constants */

const baseUrl = 'https://api.contactlab.it/hub/v1';

/* Flow types */

type Auth = {
  token: string,
  workspaceId: string,
  nodeId: string
};

type Customer = {
  id?: string,
  base: Object,
  extra?: Object
};

type Job = {
  id: string
};

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


/* Public API methods */

const getCustomer = (auth: Auth) => (customerId: string) => get(auth, {
  endpoint: `customers/${customerId}`
}).then(res => Promise.resolve(res.data));

const getCustomers = (auth: Auth) => () => get(auth, {
  endpoint: 'customers'
}).then(res => Promise.resolve(res.data._embedded.customers));

const addCustomer = (auth: Auth) => (customer: Customer) => post(auth, {
  endpoint: 'customers',
  data: {
    nodeId: auth.nodeId,
    base: customer.base
  }
}).then(res => Promise.resolve(res.data));

const updateCustomer = (auth: Auth) => (customer: Customer) => {
  if (!customer.id) {
    throw new Error('Missing "id" property, cannot update customer');
  }

  return put(auth, {
    endpoint: `customers/${customer.id}`,
    data: customer
  }).then(res => Promise.resolve(res.data));
};

const deleteCustomer = (auth: Auth) => (customerId: string) => del(auth, {
  endpoint: `customers/${customerId}`
}).then(() => Promise.resolve({ deleted: true }));

const addJob = (auth: Auth) => (customerId: string, job: Job) => post(auth, {
  endpoint: `customers/${customerId}/jobs`,
  data: job
}).then(res => Promise.resolve(res.data));

const updateJob = (auth: Auth) => (customerId: string, job: Job) => put(auth, {
  endpoint: `customers/${customerId}/jobs/${job.id}`,
  data: job
}).then(res => Promise.resolve(res.data));

/* Single exported function */

const ContactHub = (params: Auth) => {
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
    getCustomer: getCustomer(auth),
    getCustomers: getCustomers(auth),
    addCustomer: addCustomer(auth),
    updateCustomer: updateCustomer(auth),
    deleteCustomer: deleteCustomer(auth),
    addJob: addJob(auth),
    updateJob: updateJob(auth)
  };
};

module.exports = ContactHub;
