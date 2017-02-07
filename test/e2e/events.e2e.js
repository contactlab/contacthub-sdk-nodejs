// @flow

import { chTest, randomString } from './helper';

const ch = chTest();

// FIXME: creating new events takes a few seconds, so we rely on a known
// customerId already having some associated events
const cid = '689ef20e-e37a-4b8e-8d3f-2494ec901bc5';

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
      const events = await ch.getEvents(cid);

      const event = await ch.getEvent(events[0].id);
      expect(event.id).toBe(events[0].id);
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