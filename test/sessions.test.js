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

describe('ContactHub', () => {
  describe('createSessionId', () => {
    it('generates a UUIDv4 sessionId', () => {
      const sid = ch.createSessionId();
      expect(sid).toMatch(
        /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
      );
    });
  });

  describe('addCustomerSession', () => {
    it('reconciles a sessionId with a customerId', async () => {
      const sid = ch.createSessionId();

      nock(apiUrl)
        .post(`/workspaces/${auth.workspaceId}/customers/cid/sessions`, JSON.stringify({
          value: sid
        }))
        .reply(200);

      const res = await ch.addCustomerSession('cid', sid);
      expect(res).toBe(true);
    });
  });
});
