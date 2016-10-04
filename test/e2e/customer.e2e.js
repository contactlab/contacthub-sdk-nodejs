// @flow

const contacthub = require('../../src/contacthub');

const ch = contacthub({
  token: '97841617075b4b5f8ea88c30a8d2aec7647b7181df2c483fa78138c8d58aed4d',
  workspaceId: '40b6195f-e4f7-4f95-b10e-75268d850988',
  nodeId: '854f0791-c120-4e4a-9264-6dd197cb922c'
});

const customer = {
  base: {
    firstName: 'Mario'
  }
};

const job = {
  // random id as it must be unique
  id: Math.random().toString(36).substr(2, 8)
};

describe('ContactHub', () => {
  it('creates, updates and deletes a customer', async () => {
    const addResult = await ch.addCustomer(customer);

    const updatedCustomer = Object.assign({}, customer, {
      id: addResult.id,
      base: {
        lastName: 'Rossi'
      }
    });

    const updateResult = await ch.updateCustomer(updatedCustomer);

    const res = await ch.deleteCustomer(updateResult.id);

    expect(res).toEqual({ deleted: true });
  });

  it('adds and updates a job', async () => {
    const customerObj = await ch.addCustomer(customer);

    const jobObj = await ch.addJob(customerObj.id, job);

    const updatedJobObj = Object.assign({}, jobObj, {
      companyName: 'SPAM'
    });

    const updatedJob = await ch.updateJob(customerObj.id, updatedJobObj);

    expect(updatedJob.companyName).toEqual('SPAM');
  });
});
