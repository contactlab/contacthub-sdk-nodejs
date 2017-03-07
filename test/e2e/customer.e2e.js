// @flow

import { chTest, randomString } from './helper';

const ch = chTest();

const simpleCustomer = () => ({
  base: {
    firstName: randomString(),
    lastName: randomString(),
    contacts: {
      email: `${randomString()}@example.com`
    }
  }
});

const complexCustomer = () => ({
  externalId: randomString(),
  extra: randomString(),
  base: {
    pictureUrl: 'http://example.com/img.png',
    title: 'Mr',
    prefix: 'Dr',
    firstName: 'Mario',
    lastName: 'Rossi',
    middleName: 'Giacomo',
    gender: 'male',
    dob: new Date('1990-12-12'),
    locale: 'it_IT',
    timezone: 'Europe/Rome',
    contacts: {
      email: `${randomString()}@example.com`,
      fax: '123456',
      mobilePhone: '+393351234567',
      phone: '0212345678',
      otherContacts: [{
        type: 'MOBILE',
        name: 'work',
        value: '3337654321'
      }],
      mobileDevices: [{
        type: 'IOS',
        name: 'iPhone',
        identifier: '1234ABC'
      }]
    },
    address: {
      street: 'Via Malaga',
      city: 'Milano',
      country: 'Italy',
      province: 'MI',
      zip: '20143',
      geo: {
        lat: 45.4654,
        lon: 9.1859
      }
    },
    credential: {
      username: 'user',
      password: 'pass'
    },
    educations: [{
      id: 'edu',
      schoolType: 'OTHER',
      schoolName: 'Politecnico di Milano',
      schoolConcentration: 'Software Engineering',
      startYear: 2000,
      endYear: 2005,
      isCurrent: false
    }],
    likes: [{
      id: 'like1',
      category: 'cat1',
      name: 'foobar',
      createdTime: new Date('2017-01-10')
    }],
    socialProfile: {
      facebook: 'https://www.facebook.com/ContactLab',
      twitter: 'https://twitter.com/ContactLab'
    },
    jobs: [{
      id: 'contactlab',
      companyIndustry: 'Marketing',
      companyName: 'ContactLab',
      jobTitle: 'Software Engineer',
      startDate: new Date('2016-09-01'),
      isCurrent: true
    }],
    subscriptions: [{
      id: 'sub',
      name: 'ContactLab News',
      type: 'Newsletter',
      kind: 'DIGITAL_MESSAGE',
      subscribed: true,
      startDate: new Date('2016-01-01T00:00:00.000+0000'),
      endDate: new Date('2018-01-01T00:00:00.000+0000'),
      subscriberId: 'ASD123',
      registeredAt: new Date('2016-05-10T00:00:00.000+0000'),
      updatedAt: new Date('2016-05-10T00:00:00.000+0000'),
      preferences: [
        { key: 'key1', value: 'value1' },
        { key: 'key2', value: 'value2' }
      ]
    }]
  },
  extended: {
    membership_card_nr: 'ABC123'
  }
});

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

describe('ContactHub', () => {

  describe('getCustomers', async () => {
    it('gets a list of customers using pagination', async () => {

      const initialPage = 0;

      const paginatedCustomers = await ch.getCustomers({ page: initialPage });
      expect(paginatedCustomers.page.current).toBe(initialPage);
      expect(paginatedCustomers.elements.length).toBe(10);
      paginatedCustomers.elements.forEach(c => expect(c.id).toBeDefined());

      const firstCustomersPage = await paginatedCustomers.page.next();
      expect(firstCustomersPage !== undefined).toBe(true);
      if (firstCustomersPage) {
        expect(firstCustomersPage.page.current).toBe(initialPage + 1);

        const secondCustomersPage = await firstCustomersPage.page.next();
        expect(secondCustomersPage !== undefined).toBe(true);
        if (secondCustomersPage) {
          expect(secondCustomersPage.page.current).toBe(initialPage + 2);

          const firstCustomersPageAgain = await secondCustomersPage.page.prev();
          expect(firstCustomersPageAgain !== undefined).toBe(true);
          if (firstCustomersPageAgain) {
            expect(firstCustomersPageAgain.page.current).toBe(initialPage + 1);
          }
        }
      }


    });

    it('filters by externalId', async () => {
      const extId = randomString();

      const customer = await ch.addCustomer({
        ...simpleCustomer(),
        externalId: extId
      });

      // Wait 30 seconds for the Customer to be available in searches
      await new Promise(resolve => setTimeout(resolve, 40000));

      const { elements: customers } = await ch.getCustomers({ externalId: extId });

      expect(customers.length).toBe(1);
      expect(customers[0].externalId).toBe(extId);
      expect(customers[0].id).toBe(customer.id);
    });

    it('takes a whitelist of fields', async () => {
      const { elements: customers } = await ch.getCustomers({
        fields: ['base.firstName'],
        sort: 'base.firstName',
        direction: 'asc'
      });

      expect(customers.length).toBe(10);
      expect(customers[0].base && Object.keys(customers[0].base)).toEqual(['firstName']);
    });

    it('takes a custom query', async () => {
      const query = {
        name: '',
        query: {
          name: 'mario',
          type: 'simple',
          are: {
            condition: {
              type: 'atomic',
              attribute: 'base.firstName',
              operator: 'EQUALS',
              value: 'Mario'
            }
          }
        }
      };
      const { elements: customers } = await ch.getCustomers({ query });

      expect(customers[0].base && customers[0].base.firstName).toBe('Mario');
    });

    it('takes a sort field and direction', async () => {
      const { elements: customers } = await ch.getCustomers({
        sort: 'base.contacts.email',
        direction: 'desc'
      });

      const [first, second] = [customers[0], customers[1]].map(c => {
        return c.base && c.base.contacts && c.base.contacts.email;
      });

      expect(first && second && first > second).toBe(true);
    });
  });

  it('creates, updates and deletes a customer', async () => {
    const c1 = await ch.addCustomer(simpleCustomer());

    const newName = randomString();
    if (c1.base) {
      c1.base.firstName = newName;
    }

    const c2 = await ch.updateCustomer(c1.id, c1);

    const del = await ch.deleteCustomer(c2.id);

    expect(del).toEqual(true);
  });

  it('writes and reads back a simple customer', async () => {
    const local = simpleCustomer();
    const cid = (await ch.addCustomer(local)).id;
    const remote = await ch.getCustomer(cid);

    expect(remote.base).toEqual(local.base);
  });

  it('writes and reads back all base properties', async () => {
    const local = complexCustomer();
    const cid = (await ch.addCustomer(local)).id;
    const remote = await ch.getCustomer(cid);

    expect(remote.base).toEqual(local.base);
  });

  it('patches a single customer property', async () => {
    const customer = simpleCustomer();
    const c1 = await ch.addCustomer(customer);

    const updatedEmail = `${randomString()}@example.com`;
    const patch = {
      base: { contacts: { email: updatedEmail } }
    };
    const c2 = await ch.patchCustomer(
      c1.id, patch
    );

    const email = c2.base && c2.base.contacts && c2.base.contacts.email;

    // email property was modified
    expect(email).toEqual(updatedEmail);

    // firstName property was not modified
    expect(c2.base && c2.base.firstName).toEqual(customer.base.firstName);
  });

});
