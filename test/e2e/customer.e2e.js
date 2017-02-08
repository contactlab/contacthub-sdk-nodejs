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
    dob: '1990-12-12',
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
      createdTime: '2017-01-10T00:00:00.000+0000'
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
      startDate: '2016-09-01',
      isCurrent: true
    }],
    subscriptions: [{
      id: 'sub',
      name: 'ContactLab News',
      type: 'Newsletter',
      kind: 'DIGITAL_MESSAGE',
      subscribed: true,
      startDate: '2016-01-01T00:00:00.000+0000',
      endDate: '2018-01-01T00:00:00.000+0000',
      subscriberId: 'ASD123',
      registeredAt: '2016-05-10T00:00:00.000+0000',
      updatedAt: '2016-05-10T00:00:00.000+0000',
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

jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;

describe('ContactHub', () => {

  describe('getCustomers', async () => {
    it('gets a list of customers', async () => {
      const customers = await ch.getCustomers();

      expect(customers.length).toEqual(10);
      customers.forEach(c => expect(c.id).toBeDefined());
    });

    it('filters by externalId', async () => {
      const extId = randomString();

      await ch.addCustomer({
        ...simpleCustomer(),
        externalId: extId
      });

      // Wait 5 seconds for the Customer to be available in searches
      await new Promise(resolve => setTimeout(resolve, 5000));

      const customers = await ch.getCustomers({ externalId: extId });

      expect(customers.length).toBe(1);
      expect(customers[0].externalId).toBe(extId);
    });

    it('takes a whitelist of fields', async () => {
      const customers = await ch.getCustomers({ fields: ['base.firstName'] });

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
      const customers = await ch.getCustomers({ query });

      expect(customers[0].base && customers[0].base.firstName).toBe('Mario');
    });

    it('takes a sort field and direction', async () => {
      const customers = await ch.getCustomers({
        sort: 'base.contacts.email',
        direction: 'desc'
      });

      const [ first, second ] = [customers[0], customers[1]].map(c => {
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
