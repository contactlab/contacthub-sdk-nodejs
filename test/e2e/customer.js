const expect = require('chai').expect;
const contacthub = require('../../index');

/* global describe, it */

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

describe('ContactHub', () => {
  it('creates, updates and deletes a customer', () => {
    return ch.addCustomer(customer)

    .then(res => {
      const customer = Object.assign({}, customer, {
        id: res.id,
        base: {
          lastName: 'Rossi'
        }
      });
      return ch.updateCustomer(customer);
    })

    .then(res => ch.deleteCustomer(res.id))

    .then(res => {
      expect(res).to.eql({ deleted: true });
    });
  });
});
