// @flow

const ContactHub = require('contacthub-sdk-nodejs');

const ch = new ContactHub({
  token: process.env.CONTACTHUB_TEST_TOKEN || '',
  workspaceId: process.env.CONTACTHUB_TEST_WORKSPACE_ID || '',
  nodeId: process.env.CONTACTHUB_TEST_NODE_ID || ''
});

const log = console.log; // eslint-disable-line no-console

ch.getCustomers({ sort: 'base.lastName' }).then(customers => {
  log(`=== Retrieved ${customers.length} customers sorted by last name ===`);
  customers.forEach(c => {
    if (c.base && c.base.firstName && c.base.lastName) {
      log(`${c.base.firstName} ${c.base.lastName}`);
    }
  });
  log('\n');
});

const randomString = () => Math.random().toString(36).substr(2, 8);

const customer = {
  base: {
    firstName: randomString(),
    contacts: {
      email: `${randomString()}@example.com`
    }
  }
};
ch.addCustomer(customer).then(c => {
  log('=== Created a new customer ===');
  log(`Added with id ${c.id}`);
  log('\n');
});
