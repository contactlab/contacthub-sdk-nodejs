// @flow

import ContactHub from '../src/ContactHub';
const nock = require('nock');

const auth = {
  token: 'token',
  workspaceId: 'wid',
  nodeId: 'nid'
};

const ch = new ContactHub(auth);

const apiUrl = 'https://api.contactlab.it/hub/v1';

const customer = {
  id: 'cid1',
  base: { firstName: 'foo', lastName: 'bar' },
  tags: {
    auto: ['magic', 'stuff'],
    manual: ['shoes', 'men']
  }
};

const customerWithNoTags = {
  id: 'cid2',
  base: { firstName: 'foo', lastName: 'bar' }
};

describe('ContactHub', () => {
  beforeEach(() => {
    nock.cleanAll();
    nock(apiUrl)
      .get(new RegExp(`/workspaces/${auth.workspaceId}/customers/(cid1|cid2)$`))
      .reply(200, uri => {
        return uri.match('cid1') ? customer : customerWithNoTags;
      });
    nock(apiUrl)
      .put(new RegExp(`/workspaces/${auth.workspaceId}/customers/(cid1|cid2)`))
      .reply(200, (uri, body) => body);
  });

  describe('addTag', () => {
    it('adds a tag if not already present', async() => {
      const res = await ch.addTag(customer.id, 'black');
      expect(res.tags && res.tags.manual).toEqual(['shoes', 'men', 'black']);
    });

    it('preserves other Customer properties', async() => {
      const res = await ch.addTag(customer.id, 'black');
      expect(res.base && res.base.firstName).toEqual('foo');
    });

    it('does not make an unnecessary call if tag is already there', async() => {
      const res = await ch.addTag(customer.id, 'shoes');
      expect(res.tags && res.tags.manual).toEqual(['shoes', 'men']);
      expect(nock.isDone()).toBe(false);
    });

    it('adds the tag if the customer has no previous tags', async() => {
      const res = await ch.addTag(customerWithNoTags.id, 'black');
      expect(res.tags && res.tags.manual).toEqual(['black']);
    });
  });

  describe('removeTag', () => {
    it('removes a tag if not already present', async() => {
      const res = await ch.removeTag(customer.id, 'men');
      expect(res.tags && res.tags.manual).toEqual(['shoes']);
    });

    it('preserves other Customer properties', async() => {
      const res = await ch.removeTag(customer.id, 'men');
      expect(res.base && res.base.firstName).toEqual('foo');
    });

    it('does not make an unnecessary call if tag is not there', async() => {
      const res = await ch.removeTag(customer.id, 'red');
      expect(res.tags && res.tags.manual).toEqual(['shoes', 'men']);
      expect(nock.isDone()).toBe(false);
    });

    it('does not make an unnecessary call if customer has no tags', async() => {
      const res = await ch.removeTag(customerWithNoTags.id, 'red');
      expect(res.tags).toBeUndefined();
      expect(nock.isDone()).toBe(false);
    });
  });
});
