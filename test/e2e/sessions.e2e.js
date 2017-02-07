// @flow

import { chTest } from './helper';


const customerId = '704a70d9-a3e1-4729-9739-019f4295f729';
const ch = chTest();

describe('ContactHub', () => {

  describe('addCustomerSession', async () => {
    it('reconciles a sessionId with a customerId', async () => {
      const sid = ch.createSessionId();
      const res = await ch.addCustomerSession(customerId, sid);

      expect(res).toBe(true);
    });
  });
});
