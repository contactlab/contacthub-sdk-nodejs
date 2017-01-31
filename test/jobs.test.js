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

  describe('addJob', () => {
    it('adds a job', async () => {
      const cid = 'cid';
      const jid = 'a-job';
      const job = {
        id: jid
      };

      nock(apiUrl)
        .post(`/workspaces/${auth.workspaceId}/customers/${cid}/jobs`)
        .reply(200, job);

      const res = await ch.addJob(cid, job);
      expect(res).toEqual(job);
    });
  });

  describe('updateJob', () => {
    it('updates a job', async () => {
      const cid = 'cid';
      const jid = 'a-job';
      const job = {
        id: jid,
        companyName: 'SPAM'
      };

      nock(apiUrl)
        .put(`/workspaces/${auth.workspaceId}/customers/${cid}/jobs/${jid}`)
        .reply(200, job);

      const res = await ch.updateJob(cid, job);
      expect(res).toEqual(job);
    });
  });

  describe('deleteJob', () => {
    it('deletes a job', async () => {
      const cid = 'cid';
      const jid = 'a-job';

      nock(apiUrl)
        .delete(`/workspaces/${auth.workspaceId}/customers/${cid}/jobs/${jid}`)
        .reply(200);

      const res = await ch.deleteJob(cid, jid);
      expect(res).toEqual(true);
    });
  });
});
