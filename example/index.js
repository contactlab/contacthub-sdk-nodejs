// @flow

const ContactHub = require('contacthub-sdk-nodejs');

const ch = new ContactHub({
  token: '97841617075b4b5f8ea88c30a8d2aec7647b7181df2c483fa78138c8d58aed4d',
  workspaceId: '40b6195f-e4f7-4f95-b10e-75268d850988',
  nodeId: '854f0791-c120-4e4a-9264-6dd197cb922c'
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
