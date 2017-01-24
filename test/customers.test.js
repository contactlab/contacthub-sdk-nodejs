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
  describe('constructor', () => {
    it('throws if required params are missing', () => {
      const wrongCall = () => {
        // $ExpectError
        new ContactHub(); // eslint-disable-line no-new
      };
      expect(wrongCall).toThrow();
    });
  });

  describe('getCustomer', () => {
    const customer = {
      id: 'foo'
    };

    it('finds an existing Customer', async () => {
      nock(apiUrl)
        .get(`/workspaces/${auth.workspaceId}/customers/${customer.id}`)
        .query({ nodeId: auth.nodeId })
        .reply(200, customer);

      const res = await ch.getCustomer(customer.id);
      expect(res.id).toEqual('foo');
    });
  });

  describe('getCustomers', () => {
    const exampleQuery = {
      name: '',
      query: {
        name: 'mario',
        type: 'simple',
        are: {
          condition: {
            type: 'atomic',
            attribute: 'base.firstName',
            operator: 'EQUALS',
            value: 'Mario'
          }
        }
      }
    };

    it('works with no parameters', async () => {
      nock(apiUrl)
        .get(`/workspaces/${auth.workspaceId}/customers`)
        .query({ nodeId: auth.nodeId })
        .reply(200, {
          elements: [{ id: 'no-filters' }]
        });

      const res = await ch.getCustomers();
      expect(res[0].id).toBe('no-filters');
    });

    it('takes an externalId as a filter', async () => {
      nock(apiUrl)
        .get(`/workspaces/${auth.workspaceId}/customers`)
        .query({ nodeId: auth.nodeId, externalId: 'ext123' })
        .reply(200, {
          elements: [{ id: 'by-extid' }]
        });

      const res = await ch.getCustomers({ externalId: 'ext123' });
      expect(res[0].id).toBe('by-extid');
    });

    it('takes a list of fields to retrieve', async () => {
      nock(apiUrl)
        .get(`/workspaces/${auth.workspaceId}/customers`)
        .query({ nodeId: auth.nodeId, fields: 'base.firstName,base.lastName' })
        .reply(200, {
          elements: [{ id: 'with-fields' }]
        });

      const res = await ch.getCustomers({
        fields: ['base.firstName', 'base.lastName']
      });
      expect(res[0].id).toBe('with-fields');
    });

    it('takes a query object as a filter', async () => {
      nock(apiUrl)
        .get(`/workspaces/${auth.workspaceId}/customers`)
        .query({ nodeId: auth.nodeId, query: JSON.stringify(exampleQuery) })
        .reply(200, {
          elements: [{ id: 'by-query' }]
        });

      const res = await ch.getCustomers({ query: exampleQuery });
      expect(res[0].id).toBe('by-query');
    });

    it('takes a field to sort by', async () => {
      nock(apiUrl)
        .get(`/workspaces/${auth.workspaceId}/customers`)
        .query({ nodeId: auth.nodeId, sort: 'base.firstName' })
        .reply(200, {
          elements: [{ id: 'sorted' }]
        });

      const res = await ch.getCustomers({ sort: 'base.firstName' });
      expect(res[0].id).toBe('sorted');
    });

    it('takes a sort field and a sort direction', async () => {
      nock(apiUrl)
        .get(`/workspaces/${auth.workspaceId}/customers`)
        .query({ nodeId: auth.nodeId, sort: 'base.firstName,desc' })
        .reply(200, {
          elements: [{ id: 'sorted-desc' }]
        });

      const res = await ch.getCustomers({
        sort: 'base.firstName',
        direction: 'desc'
      });
      expect(res[0].id).toBe('sorted-desc');
    });

    it('takes all params together', async () => {
      nock(apiUrl)
        .get(`/workspaces/${auth.workspaceId}/customers`)
        .query({
          nodeId: auth.nodeId,
          externalId: 'ext123',
          fields: 'base.firstName',
          query: JSON.stringify(exampleQuery),
          sort: 'base.firstName,asc'
        })
        .reply(200, {
          elements: [{ id: 'all-params' }]
        });

      const res = await ch.getCustomers({
        externalId: 'ext123',
        fields: ['base.firstName'],
        query: exampleQuery,
        sort: 'base.firstName',
        direction: 'asc'
      });
      expect(res[0].id).toBe('all-params');
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
      const customer = new Customer({
        id: 'existing-id',
        base: {
          lastName: 'Rossi'
        }
      });

      nock(apiUrl)
        .put(`/workspaces/${auth.workspaceId}/customers/${customer.id}`)
        .reply(200, customer);

      const res = await ch.updateCustomer(customer);
      expect(res.base.lastName).toBe('Rossi');
    });
  });

  describe('patchCustomer', () => {
    it('updates an existing Customer', async () => {
      const customerId = 'existing-id';
      const customer = new Customer({
        base: { lastName: 'Rossi' }
      });

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
