// @flow

import ContactHub from '../../src/ContactHub';

const ch = new ContactHub({
  token: '97841617075b4b5f8ea88c30a8d2aec7647b7181df2c483fa78138c8d58aed4d',
  workspaceId: '40b6195f-e4f7-4f95-b10e-75268d850988',
  nodeId: '854f0791-c120-4e4a-9264-6dd197cb922c'
});

const randomString = (): string => Math.random().toString(36).substr(2, 8);

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
