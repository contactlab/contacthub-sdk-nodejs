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
  beforeEach(() => { });

  afterAll(() => nock.restore());

  describe('addLike', () => {
    it('adds a like', async () => {
      const cid = 'cid';
      const jid = 'a-like';
      const like = {
        id: jid
      };

      nock(apiUrl)
        .post(`/workspaces/${auth.workspaceId}/customers/${cid}/likes`)
        .reply(200, like);

      const res = await ch.addLike(cid, like);
      expect(res).toEqual(like);
    });
  });

  describe('updateLike', () => {
    it('updates a like', async () => {
      const cid = 'cid';
      const jid = 'a-like';
      const like = {
        id: jid,
        companyName: 'SPAM'
      };

      nock(apiUrl)
        .put(`/workspaces/${auth.workspaceId}/customers/${cid}/likes/${jid}`)
        .reply(200, like);

      const res = await ch.updateLike(cid, like);
      expect(res).toEqual(like);
    });
  });

  describe('deleteLike', () => {
    it('deletes a like', async () => {
      const cid = 'cid';
      const jid = 'a-like';

      nock(apiUrl)
        .delete(`/workspaces/${auth.workspaceId}/customers/${cid}/likes/${jid}`)
        .reply(200);

      const res = await ch.deleteLike(cid, jid);
      expect(res).toEqual(true);
    });
  });
});
