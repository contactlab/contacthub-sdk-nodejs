const expect = require('chai').expect;
const nock = require('nock');

const ch = require('../index.js');

const auth = {
  token: 'token',
  workspaceId: 'wid',
  nodeId: 'nid'
};

const apiUrl = 'https://api.contactlab.it/hub/v1';

/* global describe, it, beforeEach */

describe('ContactHub', () => {
  beforeEach(() => {
  });

  it('throws if required params are missing', () => {
    const wrongCall = () => { ch(); };
    expect(wrongCall).to.throw();
  });

  it('returns an object', () => {
    expect(ch(auth)).to.be.a('object');
  });

  describe('getCustomer', () => {
    it('finds an existing Customer', () => {
      const customer = {
        id: 'foo'
      };

      nock(apiUrl)
        .get(`/workspaces/${auth.workspaceId}/customers/${customer.id}`)
        .query({ nodeId: auth.nodeId })
        .reply(200, customer);

      return ch(auth).getCustomer(customer.id).then(res => {
        expect(res).to.eql(customer);
      });
    });
  });

  describe('getCustomers', () => {
    it('returns a list of customers', () => {
      const customers = {
        _embedded: {
          customers: [{
            id: 'c1'
          }, {
            id: 'c2'
          }]
        }
      };

      nock(apiUrl)
        .get(`/workspaces/${auth.workspaceId}/customers`)
        .query({ nodeId: auth.nodeId })
        .reply(200, customers);

      return ch(auth).getCustomers().then(res => {
        expect(res).to.eql(customers._embedded.customers);
      });
    });
  });

  describe('addCustomer', () => {
    it('creates a new Customer', () => {
      const customer = {
        foo: 'bar'
      };

      nock(apiUrl)
        .post(`/workspaces/${auth.workspaceId}/customers`)
        .reply(200, { id: 'new-cid' });

      return ch(auth).addCustomer(customer).then(res => {
        expect(res.id).to.equal('new-cid');
      });
    });
  });

  describe('updateCustomer', () => {
    it('updates an existing Customer', () => {
      const customer = {
        id: 'existing-cid',
        foo: 'bar'
      };

      nock(apiUrl)
        .put(`/workspaces/${auth.workspaceId}/customers/${customer.id}`)
        .reply(200, customer);

      return ch(auth).updateCustomer(customer).then(res => {
        expect(res.id).to.equal('existing-cid');
      });
    });
  });

  describe('deleteCustomer', () => {
    it('deletes an existing Customer', () => {
      const customerId = 'existing-cid';

      nock(apiUrl)
        .delete(`/workspaces/${auth.workspaceId}/customers/${customerId}`)
        .query({ nodeId: auth.nodeId })
        .reply(200);

      return ch(auth).deleteCustomer('existing-cid').then(res => {
        expect(res).to.eql({ deleted: true });
      });
    });
  });
});
