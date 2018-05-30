// @flow

import { chTest, randomString } from './helper';

const ch = chTest();

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

// FIXME: creating new events takes a few seconds, so we rely on a known
// customerId already having some associated events
const cid = 'b765329a-84b2-4380-bfa5-fa4ec33d3b82';

describe('ContactHub', () => {

  describe('addEvent', () => {
    it('creates a new event', async() => {
      const res = await ch.addEvent({
        customerId: cid,
        context: 'WEB',
        type: 'viewedPage',
        properties: {}
      });

      expect(res).toBe(true);
    });

    it('creates a new event with additional properties and contextInfo', async() => {
      const res = await ch.addEvent({
        customerId: cid,
        context: 'WEB',
        type: 'viewedPage',
        properties: {
          title: 'Page Title',
          url: 'http://www.example.com'
        },
        contextInfo: {
          client: {
            ip: '1.2.3.4'
          },
          user: {
            id: 'username1'
          }
        }
      });

      expect(res).toBe(true);
    });

    it('creates an anonymous event', async() => {
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
    it('retrieves an Event by id', async() => {
      const { elements: events } = await ch.getEvents(cid);

      const event = await ch.getEvent(events[0].id);
      expect(event.id).toBe(events[0].id);
    });
  });

  describe('getEvents', () => {

    it('retrieves all Events for a Customer', async() => {
      const { elements: events } = await ch.getEvents(cid);
      expect(events.length).toBe(10);
      expect(events[0].customerId).toBe(cid);
    });

    it('retrieves all Events for a Customer using date range filter', async() => {
      const dateFrom = new Date('2017-03-10');
      const dateTo = new Date('2017-03-20');
      const filters = { dateFrom, dateTo };

      const { elements: events } = await ch.getEvents(cid, filters);
      expect(events.length > 0).toBe(true);

      const haveRightDate = events.every((v) => {
        const eventDate = (v.date && new Date(v.date)) || new Date('1970-01-01');
        return dateTo >= eventDate && eventDate >= dateFrom;
      });
      expect(haveRightDate).toBe(true);
    });

    it('retrieves all Events for a customer with "MOBILE" context', async() => {
      const eventData = {
        customerId: cid,
        context: 'MOBILE',
        type: 'viewedPage',
        properties: {}
      };

      await ch.addEvent(eventData);

      const { elements: events } = await ch.getEvents(cid, { context: 'MOBILE' });
      expect(events.length > 0).toBe(true);

      const areMobileEvents = events.every(({ context }) => context === 'MOBILE');
      expect(areMobileEvents).toBe(true);
    });

    it('retrieves all Events for a customer using pagination', async() => {
      const initialPage = 0;

      const paginatedEvents = await ch.getEvents(cid, { page: initialPage });
      expect(paginatedEvents.page.current).toBe(initialPage);
      expect(paginatedEvents.elements.length).toBe(10);

      const firstEventsPage = await paginatedEvents.page.next();
      expect(firstEventsPage !== undefined).toBe(true);
      if (firstEventsPage) {
        expect(firstEventsPage.page.current).toBe(initialPage + 1);

        const secondEventsPage = await firstEventsPage.page.next();
        expect(secondEventsPage !== undefined).toBe(true);
        if (secondEventsPage) {
          expect(secondEventsPage.page.current).toBe(initialPage + 2);

          const firstEventsPageAgain = await secondEventsPage.page.prev();
          expect(firstEventsPageAgain !== undefined).toBe(true);
          if (firstEventsPageAgain) {
            expect(firstEventsPageAgain.page.current).toBe(initialPage + 1);
          }
        }
      }
    });
  });

});
