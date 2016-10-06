// @flow

const ch = require('../src/contacthub');
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
    const customer = {
      id: 'foo'
    };

    beforeEach(() => {
      nock(apiUrl)
        .get(`/workspaces/${auth.workspaceId}/customers/${customer.id}`)
        .query({ nodeId: auth.nodeId })
        .reply(200, customer);
    });

    it('finds an existing Customer', async () => {
      const res = await ch(auth).getCustomer(customer.id);
      expect(res.id).toEqual('foo');
    });

    it('returns an instance of the Customer object', async () => {
      const res = await ch(auth).getCustomer(customer.id);
      expect(res.addJob).not.toBe(undefined);
    });
  });

  describe('getCustomers', () => {
    beforeEach(() => {
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
    });

    it('returns a list of customers', async () => {
      const res = await ch(auth).getCustomers();
      expect(res.length).toBe(2);
      expect(res[0].id).toBe('c1');
      expect(res[1].id).toBe('c2');
    });

    it('returns instances of the Customer object', async () => {
      const res = await ch(auth).getCustomers();
      expect(res[0].addJob).not.toBe(undefined);
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
      const customerId = 'existing-id';
      const customer = {
        base: {
          lastName: 'Rossi'
        }
      };

      nock(apiUrl)
        .put(`/workspaces/${auth.workspaceId}/customers/${customerId}`)
        .reply(200, customer);

      const res = await ch(auth).updateCustomer(customerId, customer);
      expect(res.base.lastName).toBe('Rossi');
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
