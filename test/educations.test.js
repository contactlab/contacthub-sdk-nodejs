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

  describe('addEducation', () => {
    it('adds a education', async() => {
      const cid = 'cid';
      const jid = 'a-education';
      const education = {
        id: jid
      };

      nock(apiUrl)
        .post(`/workspaces/${auth.workspaceId}/customers/${cid}/educations`)
        .reply(200, education);

      const res = await ch.addEducation(cid, education);
      expect(res).toEqual(education);
    });
  });

  describe('updateEducation', () => {
    it('updates a education', async() => {
      const cid = 'cid';
      const jid = 'a-education';
      const education = {
        id: jid,
        companyName: 'SPAM'
      };

      nock(apiUrl)
        .put(`/workspaces/${auth.workspaceId}/customers/${cid}/educations/${jid}`)
        .reply(200, education);

      const res = await ch.updateEducation(cid, education);
      expect(res).toEqual(education);
    });
  });

  describe('deleteEducation', () => {
    it('deletes a education', async() => {
      const cid = 'cid';
      const jid = 'a-education';

      nock(apiUrl)
        .delete(`/workspaces/${auth.workspaceId}/customers/${cid}/educations/${jid}`)
        .reply(200);

      const res = await ch.deleteEducation(cid, jid);
      expect(res).toEqual(true);
    });
  });
});
