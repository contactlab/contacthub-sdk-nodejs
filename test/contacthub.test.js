// @flow

const ch = require('../index.js');
const nock = require('nock');

const auth = {
  token: 'token',
  workspaceId: 'wid',
  nodeId: 'nid'
};

const apiUrl = 'https://api.contactlab.it/hub/v1';

describe('ContactHub', () => {
  beforeEach(() => {
  });

  afterAll(() => nock.restore());

  it('throws if required params are missing', () => {
    const wrongCall = () => {
      // $ExpectError
      ch();
    };
    expect(wrongCall).toThrow();
  });

  it('returns an object', () => {
    expect(typeof ch(auth)).toBe('object');
  });

  describe('getCustomer', () => {
    it('finds an existing Customer', async () => {
      const customer = {
        id: 'foo'
      };

      nock(apiUrl)
        .get(`/workspaces/${auth.workspaceId}/customers/${customer.id}`)
        .query({ nodeId: auth.nodeId })
        .reply(200, customer);

      const res = await ch(auth).getCustomer(customer.id);
      expect(res).toEqual(customer);
    });
  });

  describe('getCustomers', () => {
    it('returns a list of customers', async () => {
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

      const res = await ch(auth).getCustomers();
      expect(res).toEqual(customers._embedded.customers);
    });
  });

  describe('addCustomer', () => {
    it('creates a new Customer', () => {
      const customer = {
        base: {
          firstName: 'Mario'
        }
      };

      nock(apiUrl)
        .post(`/workspaces/${auth.workspaceId}/customers`)
        .reply(200, { id: 'new-cid' });

      return ch(auth).addCustomer(customer).then(res => {
        expect(res.id).toBe('new-cid');
      });
    });
  });

  describe('updateCustomer', () => {
    it('updates an existing Customer', async () => {
      const customer = {
        id: 'existing-cid',
        base: {
          lastName: 'Rossi'
        }
      };

      nock(apiUrl)
        .put(`/workspaces/${auth.workspaceId}/customers/${customer.id}`)
        .reply(200, customer);

      const res = await ch(auth).updateCustomer(customer);
      expect(res.id).toBe('existing-cid');
    });
  });

  describe('deleteCustomer', () => {
    it('deletes an existing Customer', async () => {
      const customerId = 'existing-cid';

      nock(apiUrl)
        .delete(`/workspaces/${auth.workspaceId}/customers/${customerId}`)
        .query({ nodeId: auth.nodeId })
        .reply(200);

      const res = await ch(auth).deleteCustomer('existing-cid');
      expect(res).toEqual({ deleted: true });
    });
  });
});
