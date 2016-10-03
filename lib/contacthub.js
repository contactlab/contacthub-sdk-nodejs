

/* Dependencies */

const axios = require('axios');

/* Constants */

const baseUrl = 'https://api.contactlab.it/hub/v1';

/* Flow types */

/* Internal abstractions */

const headers = token => ({
  Authorization: `Bearer ${ token }`
});

const get = (auth, opts) => axios({
  method: 'get',
  url: `${ baseUrl }/workspaces/${ auth.workspaceId }/${ opts.endpoint }`,
  headers: headers(auth.token),
  params: {
    nodeId: auth.nodeId
  }
});

const post = (auth, opts) => axios({
  method: 'post',
  url: `${ baseUrl }/workspaces/${ auth.workspaceId }/${ opts.endpoint }`,
  headers: headers(auth.token),
  data: opts.data
});

const put = (auth, opts) => axios({
  method: 'put',
  url: `${ baseUrl }/workspaces/${ auth.workspaceId }/${ opts.endpoint }`,
  headers: headers(auth.token),
  data: opts.data
});

const del = (auth, opts) => axios({
  method: 'delete',
  url: `${ baseUrl }/workspaces/${ auth.workspaceId }/${ opts.endpoint }`,
  headers: headers(auth.token),
  params: {
    nodeId: auth.nodeId
  }
});

/* Public API methods */

const getCustomer = auth => customerId => get(auth, {
  endpoint: `customers/${ customerId }`
}).then(res => Promise.resolve(res.data));

const getCustomers = auth => () => get(auth, {
  endpoint: 'customers'
}).then(res => Promise.resolve(res.data._embedded.customers));

const addCustomer = auth => customer => post(auth, {
  endpoint: 'customers',
  data: {
    nodeId: auth.nodeId,
    base: customer.base
  }
}).then(res => Promise.resolve(res.data));

const updateCustomer = auth => customer => {
  if (!customer.id) {
    throw new Error('Missing "id" property, cannot update customer');
  }

  return put(auth, {
    endpoint: `customers/${ customer.id }`,
    data: customer
  }).then(res => Promise.resolve(res.data));
};

const deleteCustomer = auth => customerId => del(auth, {
  endpoint: `customers/${ customerId }`
}).then(() => Promise.resolve({ deleted: true }));

/* Single exported function */

const ContactHub = params => {
  if (typeof params !== 'object' || !(params.token && params.workspaceId && params.nodeId)) {
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
    deleteCustomer: deleteCustomer(auth)
  };
};

module.exports = ContactHub;