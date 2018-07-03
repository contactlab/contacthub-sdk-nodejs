// @flow

import ContactHub from '../src/ContactHub';
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
      id: 'foo',
      base: {
        title: null,
        firstName: 'Mario',
        lastName: 'Rossi',
        dob: '1980-03-17'
      },
      consents: {
        disclaimer: {
          date: '2018-05-25T14:05:00.000+0000'
        }
      },
      extended: {},
      externalId: 'eid',
      extra: 'extrastring',
      tags: {}
    };

    beforeEach(() => {
      nock(apiUrl)
        .get(`/workspaces/${auth.workspaceId}/customers/${customer.id}`)
        .reply(200, customer);
    });

    it('finds an existing Customer', async() => {
      const res = await ch.getCustomer(customer.id);
      expect(res.id).toEqual('foo');
    });

    it('cleans null values returned by the API', async() => {
      const res = await ch.getCustomer(customer.id);
      expect(res.base).not.toBeUndefined();
      expect(res.base && res.base.title).toBeUndefined();
    });

    it('converts base.dob to a JS Date object', async() => {
      const res = await ch.getCustomer(customer.id);
      expect(res.base && res.base.dob).toEqual(new Date('1980-03-17'));
    });

    it('converts consents.disclaimer.date to a JS Date object', async() => {
      const res = await ch.getCustomer(customer.id);
      expect(res.consents && res.consents.disclaimer &&
        res.consents.disclaimer.date).toEqual(new Date('2018-05-25T14:05:00Z'));
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

    it('works with no parameters', async() => {
      nock(apiUrl)
        .get(`/workspaces/${auth.workspaceId}/customers`)
        .query({ nodeId: auth.nodeId })
        .reply(200, {
          page: { number: 0, totalPages: 10 },
          elements: [{ id: 'no-filters' }]
        });

      const { elements } = await ch.getCustomers();
      expect(elements[0].id).toBe('no-filters');
    });

    it('takes an externalId as a filter', async() => {
      nock(apiUrl)
        .get(`/workspaces/${auth.workspaceId}/customers`)
        .query({ nodeId: auth.nodeId, externalId: 'ext123' })
        .reply(200, {
          page: { number: 0, totalPages: 10 },
          elements: [{ id: 'by-extid' }]
        });

      const { elements } = await ch.getCustomers({ externalId: 'ext123' });
      expect(elements[0].id).toBe('by-extid');
    });

    it('takes a list of fields to retrieve', async() => {
      nock(apiUrl)
        .get(`/workspaces/${auth.workspaceId}/customers`)
        .query({ nodeId: auth.nodeId, fields: 'base.firstName,base.lastName' })
        .reply(200, {
          page: { number: 0, totalPages: 10 },
          elements: [{ id: 'with-fields' }]
        });

      const { elements } = await ch.getCustomers({
        fields: ['base.firstName', 'base.lastName']
      });
      expect(elements[0].id).toBe('with-fields');
    });

    it('takes a query object as a filter', async() => {
      nock(apiUrl)
        .get(`/workspaces/${auth.workspaceId}/customers`)
        .query({ nodeId: auth.nodeId, query: JSON.stringify(exampleQuery) })
        .reply(200, {
          page: { number: 0, totalPages: 10 },
          elements: [{ id: 'by-query' }]
        });

      const { elements } = await ch.getCustomers({ query: exampleQuery });
      expect(elements[0].id).toBe('by-query');
    });

    it('takes a field to sort by', async() => {
      nock(apiUrl)
        .get(`/workspaces/${auth.workspaceId}/customers`)
        .query({ nodeId: auth.nodeId, sort: 'base.firstName' })
        .reply(200, {
          page: { number: 0, totalPages: 10 },
          elements: [{ id: 'sorted' }]
        });

      const { elements } = await ch.getCustomers({ sort: 'base.firstName' });
      expect(elements[0].id).toBe('sorted');
    });

    it('takes a sort field and a sort direction', async() => {
      nock(apiUrl)
        .get(`/workspaces/${auth.workspaceId}/customers`)
        .query({ nodeId: auth.nodeId, sort: 'base.firstName,desc' })
        .reply(200, {
          page: { number: 0, totalPages: 10 },
          elements: [{ id: 'sorted-desc' }]
        });

      const { elements } = await ch.getCustomers({
        sort: 'base.firstName',
        direction: 'desc'
      });
      expect(elements[0].id).toBe('sorted-desc');
    });

    it('takes all params together', async() => {
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
          page: { number: 0, totalPages: 10 },
          elements: [{ id: 'all-params' }]
        });

      const { elements } = await ch.getCustomers({
        externalId: 'ext123',
        fields: ['base.firstName'],
        query: exampleQuery,
        sort: 'base.firstName',
        direction: 'asc'
      });
      expect(elements[0].id).toBe('all-params');
    });
  });

  describe('addCustomer', () => {
    it('creates a new Customer', () => {
      const datetime = new Date();
      const customer = {
        base: {
          firstName: 'Mario'
        },
        consents: {
          disclaimer: {
            date: datetime
          }
        },
        externalId: 'eid',
        extended: {
          foo: 'bar'
        },
        extra: 'extrastring'
      };

      nock(apiUrl)
        .post(`/workspaces/${auth.workspaceId}/customers`, {
          nodeId: 'nid',
          base: { firstName: 'Mario' },
          consents: { disclaimer: { date: datetime.toISOString() } },
          externalId: 'eid',
          extended: { foo: 'bar' },
          extra: 'extrastring'
        })
        .reply(200, { id: 'new-cid' });

      return ch.addCustomer(customer).then(res => {
        expect(res.id).toBe('new-cid');
      });
    });
  });

  describe('updateCustomer', () => {
    it('updates an existing Customer', async() => {
      const customer = {
        id: 'existing-id',
        base: {
          lastName: 'Rossi'
        }
      };

      nock(apiUrl)
        .put(`/workspaces/${auth.workspaceId}/customers/${customer.id}`)
        .reply(200, customer);

      const res = await ch.updateCustomer('existing-id', customer);
      expect(res.base && res.base.lastName).toBe('Rossi');
    });
  });

  describe('patchCustomer', () => {
    it('updates an existing Customer', async() => {
      const customerId = 'existing-id';
      const customer = {
        base: { lastName: 'Rossi' }
      };

      nock(apiUrl)
        .patch(`/workspaces/${auth.workspaceId}/customers/${customerId}`)
        .reply(200, customer);

      const res = await ch.patchCustomer(customerId, customer);
      expect(res.base && res.base.lastName).toBe('Rossi');
    });
  });

  describe('deleteCustomer', () => {
    it('deletes an existing Customer', async() => {
      const customerId = 'existing-cid';

      nock(apiUrl)
        .delete(`/workspaces/${auth.workspaceId}/customers/${customerId}`)
        .query({ nodeId: auth.nodeId })
        .reply(200);

      const res = await ch.deleteCustomer('existing-cid');
      expect(res).toEqual(true);
    });
  });
});
