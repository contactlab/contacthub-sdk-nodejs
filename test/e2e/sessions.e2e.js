// @flow

import ContactHub from '../../src/ContactHub';

const ch = new ContactHub({
  token: '97841617075b4b5f8ea88c30a8d2aec7647b7181df2c483fa78138c8d58aed4d',
  workspaceId: '40b6195f-e4f7-4f95-b10e-75268d850988',
  nodeId: '854f0791-c120-4e4a-9264-6dd197cb922c'
});

const customerId = '704a70d9-a3e1-4729-9739-019f4295f729';

describe('ContactHub', () => {

  describe('addCustomerSession', async () => {
    it('reconciles a sessionId with a customerId', async () => {
      const sid = ch.createSessionId();
      const res = await ch.addCustomerSession(customerId, sid);

      expect(res).toBe(true);
    });
  });
});
