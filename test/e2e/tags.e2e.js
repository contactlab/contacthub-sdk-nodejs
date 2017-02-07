// @flow

import { chTest, randomString } from './helper';

const ch = chTest();

jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;

describe('ContactHub', () => {

  describe('addTag', async () => {
    it('adds a new tag', async () => {
      const customer = await ch.addCustomer({
        base: { contacts: { email: `${randomString()}@example.com` } },
        tags: {
          auto: ['magic'],
          manual: ['foo', 'bar']
        }
      });
      const res = await ch.addTag(customer.id, 'baz');

      expect(res.tags && res.tags.manual).toEqual(['foo', 'bar', 'baz']);
    });
  });

  describe('removeTag', async () => {
    it('removes a tag', async () => {
      const customer = await ch.addCustomer({
        base: { contacts: { email: `${randomString()}@example.com` } },
        tags: {
          auto: ['magic'],
          manual: ['foo', 'bar']
        }
      });
      const res = await ch.removeTag(customer.id, 'bar');

      expect(res.tags && res.tags.manual).toEqual(['foo']);
    });
  });
});
