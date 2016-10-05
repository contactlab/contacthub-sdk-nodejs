// @flow

const contacthub = require('../../src/contacthub');

const ch = contacthub({
  token: '97841617075b4b5f8ea88c30a8d2aec7647b7181df2c483fa78138c8d58aed4d',
  workspaceId: '40b6195f-e4f7-4f95-b10e-75268d850988',
  nodeId: '854f0791-c120-4e4a-9264-6dd197cb922c'
});

const customer1 = {
  base: {
    firstName: 'Mario'
  }
};

const customer2 = {
  base: {
    firstName: 'Mario',
    lastName: 'Rossi'
  }
};

const job1 = {
  // random id as it must be unique
  id: Math.random().toString(36).substr(2, 8)
};

const job2 = Object.assign({}, job1, {
  companyName: 'SPAM'
});

describe('ContactHub', () => {
  it('creates, updates and deletes a customer', async () => {
    const c1 = await ch.addCustomer(customer1);

    const c2 = await c1.updateCustomer(customer2);

    const del = await ch.deleteCustomer(c2.id);

    expect(del).toEqual({ deleted: true });
  });

  it('adds and updates a job', async () => {
    const c1 = await ch.addCustomer(customer1);

    await c1.addJob(job1);

    const j2 = await c1.updateJob(job2);

    expect(j2.companyName).toEqual('SPAM');
  });
});
