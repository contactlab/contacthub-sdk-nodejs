// @flow

import ContactHub from '../src/ContactHub';
import Customer from '../src/Customer';
import nock from 'nock';

const auth = {
  token: 'token',
  workspaceId: 'wid',
  nodeId: 'nid'
};

const ch = new ContactHub(auth);

const apiUrl = 'https://api.contactlab.it/hub/v1';

describe('ContactHub', () => {
  beforeEach(() => { });

  afterAll(() => nock.restore());

  it('throws if required params are missing', () => {
    const wrongCall = () => {
      // $ExpectError
      ch();
    };
    expect(wrongCall).toThrow();
  });

  it('returns an object', () => {
    expect(typeof ch).toBe('object');
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
      const res = await ch.getCustomer(customer.id);
      expect(res.id).toEqual('foo');
    });
  });

  describe('getCustomers', () => {
    beforeEach(() => {
      const customers = {
        elements: [{
          id: 'c1'
        }, {
          id: 'c2'
        }]
      };

      nock(apiUrl)
        .get(`/workspaces/${auth.workspaceId}/customers`)
        .query({ nodeId: auth.nodeId })
        .reply(200, customers);
    });

    it('returns a list of customers', async () => {
      const res = await ch.getCustomers();
      expect(res.length).toBe(2);
      expect(res[0].id).toBe('c1');
      expect(res[1].id).toBe('c2');
    });
  });

  describe('addCustomer', () => {
    it('creates a new Customer', () => {
      const customer = new Customer({
        base: {
          firstName: 'Mario'
        }
      });

      nock(apiUrl)
        .post(`/workspaces/${auth.workspaceId}/customers`)
        .reply(200, { id: 'new-cid' });

      return ch.addCustomer(customer).then(res => {
        expect(res.id).toBe('new-cid');
      });
    });
  });

  describe('updateCustomer', () => {
    it('updates an existing Customer', async () => {
      const customerId = 'existing-id';
      const customer = new Customer({
        base: {
          lastName: 'Rossi'
        }
      });

      nock(apiUrl)
        .put(`/workspaces/${auth.workspaceId}/customers/${customerId}`)

  describe('patchCustomer', () => {
    it('updates an existing Customer', async () => {
      const customerId = 'existing-id';
      const customer = {
        base: { lastName: 'Rossi' }
      };

      nock(apiUrl)
        .patch(`/workspaces/${auth.workspaceId}/customers/${customerId}`)
        .reply(200, customer);

      const res = await ch.patchCustomer(customerId, customer);
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

      const res = await ch.deleteCustomer('existing-cid');
      expect(res).toEqual({ deleted: true });
    });
  });
});
