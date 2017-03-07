// @flow

import ContactHub from '../src/ContactHub';
import nock from 'nock';

const auth = {
  token: 'token',
  workspaceId: 'wid',
  nodeId: 'nid'
};

const ch = new ContactHub(auth);

const apiUrl = 'https://api.contactlab.it/hub/v1';

describe('ContactHub', () => {
  describe('addEvent', () => {
    const now = new Date();

    it('creates a new Event', async () => {
      const event = {
        customerId: 'cid',
        type: 'viewedPage',
        context: 'WEB',
        date: now,
        properties: {}
      };

      nock(apiUrl)
        .post(`/workspaces/${auth.workspaceId}/events`, JSON.stringify({
          customerId: 'cid',
          type: 'viewedPage',
          context: 'WEB',
          properties: {},
          date: now.toISOString()
        }))
        .reply(200, true);

      const res = await ch.addEvent(event);
      expect(res).toBe(true);
    });

    it('creates a new anonymous Event', async () => {
      const event = {
        sessionId: 'sid',
        type: 'viewedPage',
        context: 'WEB',
        date: now,
        properties: {}
      };

      nock(apiUrl)
        .post(`/workspaces/${auth.workspaceId}/events`, JSON.stringify({
          bringBackProperties: {
            type: 'SESSION_ID',
            value: 'sid',
            nodeId: auth.nodeId
          },
          type: 'viewedPage',
          context: 'WEB',
          properties: {},
          date: now.toISOString()
        }))
        .reply(200, true);

      const res = await ch.addEvent(event);
      expect(res).toBe(true);
    });
  });

  describe('getEvent', () => {
    it('retrieves an event by eventId', async () => {
      const event = { id: 'event123' };

      nock(apiUrl)
        .get(`/workspaces/${auth.workspaceId}/events/${event.id}`)
        .query({ nodeId: auth.nodeId })
        .reply(200, event);

      const res = await ch.getEvent(event.id);
      expect(res.id).toEqual(event.id);
    });
  });

  describe('getEvents', () => {
    it('retrieves all events for a Customer', async () => {
      const event1 = { id: 'event1' };
      const event2 = { id: 'event2' };

      nock(apiUrl)
        .get(`/workspaces/${auth.workspaceId}/events`)
        .query({ customerId: 'cid' })
        .reply(200, {
          page: { number: 0, totalPages: 10 },
          elements: [event1, event2]
        });

      const { elements: events } = await ch.getEvents('cid');
      expect(events.length).toBe(2);
      expect(events[0].id).toBe('event1');
      expect(events[1].id).toBe('event2');
    });
  });
});
