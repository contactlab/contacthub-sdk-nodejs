const axios = require('axios');

const baseUrl = 'https://api.contactlab.it/hub/v1';

/* Internal abstractions */

const headers = (token) => ({
  Authorization: `Bearer ${token}`
});

const get = (auth, opts) => axios({
  method: 'get',
  url: `${baseUrl}/workspaces/${auth.workspaceId}/${opts.endpoint}`,
  headers: headers(auth.token),
  params: {
    nodeId: auth.nodeId
  }
});

/* Public API methods */

const getCustomer = (auth) => (customerId) => get(auth, {
  endpoint: `customers/${customerId}`
});

/* Single exported function */

const ContactHub = (params) => {
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
    getCustomer: getCustomer(auth)
  };
};

module.exports = ContactHub;
