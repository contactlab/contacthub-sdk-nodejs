// @flow
/* eslint-disable max-len */

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

const customerData = {
  base: {
    firstName: randomString(),
    contacts: {
      email: `${randomString()}@example.com`
    }
  }
};

// ADD A CUSTOMER
ch.addCustomer(customerData)
  .then(c => {
    log('=== Created a new customer ===');
    log(`Added with id '${c.id}'`);
    log('\n');
    return c;
  })
  // CUSTOMER'S SESSION
  .then((customer) => {

    // Create a session
    const sessionId = ch.createSessionId();

    // Reconcile session to customer
    return ch.addCustomerSession(customer.id, sessionId).then(() => {
      log(`=== Added session '${sessionId}' to customer '${customer.id}' ===`);
      log('\n');
      return customer;
    });

  })
  // EDIT A CUSTOMER
  .then((customer) => {
    // Patch a customer
    const patchedCustomerData = {
      base: {
        firstName: randomString()
      }
    };

    return ch.patchCustomer(customer.id, patchedCustomerData).then(patchedCustomer => {
      log('=== Patched existing customer ===');
      log(`Changed firstName from '${customer.base.firstName}' to '${patchedCustomer.base.firstName}'`);
      log('\n');

      // Update a customer
      patchedCustomer.base.firstName = randomString();
      patchedCustomer.base.lastName = randomString();
      patchedCustomer.base.dob = new Date();

      return ch.updateCustomer(patchedCustomer.id, patchedCustomer).then(updatedCustomer => {
        log(`=== Updated existing customer '${updatedCustomer.id}' ===`);
        log(`Changed firstName from '${patchedCustomerData.base.firstName}' to '${updatedCustomer.base.firstName}'`);
        log(`Changed firstName from '${patchedCustomerData.base.lastName}' to '${updatedCustomer.base.lastName}'`);
        log(`Changed dob from '${patchedCustomerData.base.dob}' to '${updatedCustomer.base.dob}'`);
        log('\n');
        return updatedCustomer;
      });
    });
  })
  // EVENTS
  .then((customer) => {

    // Add an event
    const eventData = {
      customerId: customer.id,
      type: 'viewedPage',
      context: 'WEB',
      properties: {}
    };
    return ch.addEvent(eventData).then(() => {
      log(`=== Added an event for customer '${customer.id}' ===`);
      log('\n');
      return customer;
    });
  })
  // CUSTOMER'S JOBS
  .then((customer) => {
    const jobData = {
      id: 'contactlab',
      companyIndustry: 'Marketing',
      companyName: 'ContactLab',
      jobTitle: 'Software Engineer',
      startDate: new Date('2015-01-01'),
      isCurrent: true
    };

    // Add a job to a customer
    return ch.addJob(customer.id, jobData).then(job => {
      log(`=== Added a job to customer '${customer.id}' ===`);
      log(`Added with id '${job.id}'`);

      // Delete a job from a customer
      return ch.deleteJob(customer.id, job.id).then(() => {
        log(`=== Deleted the job '${job.id}' for customer '${customer.id}' ===`);
        return customer;
      });
    });
  })
  // CUSTOMER'S TAG
  .then((customer) => {
    const tag = 'fake-tag';

    return ch.addTag(customer.id, tag).then((updatedCustomer) => {
      const lastTag = updatedCustomer.tags.manual[updatedCustomer.tags.manual.length - 1];
      log(`=== Added tag: '${lastTag}' to customer '${customer.id}' ===`);
      log('\n');

    });
  })
  .catch(err => log(err, err && err.response && err.response.data));
