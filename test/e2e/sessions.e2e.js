// @flow

import { chTest, randomString } from './helper';

const ch = chTest();

jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;

describe('ContactHub', () => {

  describe('addCustomerSession', async () => {
    it('reconciles a sessionId with a customerId', async () => {
      const sid = ch.createSessionId();

      const c = await ch.addCustomer({
        base: { contacts: { email: `${randomString()}@example.com` } }
      });

      const res = await ch.addCustomerSession(c.id, sid);

      expect(res).toBe(true);
    });
  });
});
