// @flow

import ContactHub from '../../src/ContactHub';

// For comparing Base Properties, we remove null values and empty arrays.
// This should probably be handled by the Customer class, see #21
const sanitize = (obj) => {
  Object.keys(obj).forEach(key => {
    if (obj[key] === null) {
      delete obj[key];
    } else if (Array.isArray(obj[key]) && obj[key].length === 0) {
      delete obj[key];
    } else if (typeof obj[key] === 'object') {
      sanitize(obj[key]);
    }
  });
  return obj;
};

const ch = new ContactHub({
  token: '97841617075b4b5f8ea88c30a8d2aec7647b7181df2c483fa78138c8d58aed4d',
  workspaceId: '40b6195f-e4f7-4f95-b10e-75268d850988',
  nodeId: '854f0791-c120-4e4a-9264-6dd197cb922c'
});

const randomString = () => Math.random().toString(36).substr(2, 8);

const simpleCustomer = () => ({
  base: {
    firstName: randomString(),
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

const job1 = {
  // random id as it must be unique
  id: Math.random().toString(36).substr(2, 8)
};

const job2 = Object.assign({}, job1, {
  companyName: 'SPAM'
});

describe('ContactHub', () => {

  it('gets a list of customers', async () => {
    const customers = await ch.getCustomers();

    expect(customers.length).toEqual(10);
    customers.forEach(c => expect(c.id).toBeDefined());
  });

  it('creates, updates and deletes a customer', async () => {
    const c1 = await ch.addCustomer(simpleCustomer());

    const c2 = await c1.updateCustomer(simpleCustomer());

    const del = await c2.deleteCustomer();

    expect(del).toEqual({ deleted: true });
  });

  it('can write and read back a simple customer', async () => {
    const local = simpleCustomer();
    const cid = (await ch.addCustomer(local)).id;
    const remote = await ch.getCustomer(cid);

    expect(sanitize(remote.base)).toEqual(local.base);
  });

  it('can write and read back all base properties', async () => {
    const local = complexCustomer();
    const cid = (await ch.addCustomer(local)).id;
    const remote = await ch.getCustomer(cid);

    expect(sanitize(remote.base)).toEqual(local.base);
  });

  it('adds and updates a job', async () => {
    const c1 = await ch.addCustomer(simpleCustomer());

    await c1.addJob(job1);

    const j2 = await c1.updateJob(job2);

    expect(j2.companyName).toEqual('SPAM');
  });
});
