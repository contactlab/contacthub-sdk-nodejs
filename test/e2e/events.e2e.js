// @flow

import { chTest, randomString } from './helper';

const ch = chTest();

const cid = '689ef20e-e37a-4b8e-8d3f-2494ec901bc5';
const eventId = 'e7f540f3-db32-4b1d-a572-0df15c95ae64';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;

describe('ContactHub', () => {

  describe('addEvent', () => {
    it('creates a new event', async () => {
      const res = await ch.addEvent({
        customerId: cid,
        context: 'WEB',
        type: 'viewedPage',
        properties: {}
      });

      expect(res).toBe(true);
    });

    it('creates an anonymous event', async () => {
      const res = await ch.addEvent({
        sessionId: randomString(),
        context: 'WEB',
        type: 'viewedPage',
        properties: {}
      });

      expect(res).toBe(true);
    });
  });

  describe('getEvent', () => {
    it('retrieves an Event by id', async () => {
      const event = await ch.getEvent(eventId);
      expect(event.id).toBe(eventId);
    });
  });

  describe('getEvents', () => {
    it('retrieves all Events for a Customer', async () => {
      const events = await ch.getEvents(cid);
      expect(events.length).toBe(10);
      expect(events[0].customerId).toBe(cid);
    });
  });

});
