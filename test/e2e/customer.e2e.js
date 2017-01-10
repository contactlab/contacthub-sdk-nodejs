// @flow

import ContactHub from '../../src/ContactHub';
import Customer from '../../src/Customer';

const ch = new ContactHub({
  token: '97841617075b4b5f8ea88c30a8d2aec7647b7181df2c483fa78138c8d58aed4d',
  workspaceId: '40b6195f-e4f7-4f95-b10e-75268d850988',
  nodeId: '854f0791-c120-4e4a-9264-6dd197cb922c'
});

const randomString = () => Math.random().toString(36).substr(2, 8);

const simpleCustomer = () => new Customer({
  base: {
    firstName: randomString(),
    contacts: {
      email: `${randomString()}@example.com`
    }
  }
});

// Source: http://justsomething.co/hilarious-job-titles/
const realJobs = [
  'Chocolate Beer Specialist', 'Shredded Cheese Authority',
  'Pornography Historian', 'Smarties Expert', 'Mall Santa',
  'Rasputin Impersonator', 'Cat Behavior Consultant', 'MILF Commander',
  'Head of Potatoes', 'Ex-moonshiner', 'Pork Rind Expert', 'Bread Scientist',
  'Bear biologist and Paper folder', '6-layer dip maker',
  'Chief of Unicorn Division', 'Bride Kidnapping Expert'
];

const randomJobTitle = () => {
  return realJobs[Math.floor(Math.random() * realJobs.length)];
};

const randomJob = () => ({
  id: randomString(),
  jobTitle: randomJobTitle()
});

const complexCustomer = () => new Customer({
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

describe('ContactHub', () => {

  it('gets a list of customers', async () => {
    const customers = await ch.getCustomers();

    expect(customers.length).toEqual(10);
    customers.forEach(c => expect(c.id).toBeDefined());
  });

  it('creates, updates and deletes a customer', async () => {
    const c1 = await ch.addCustomer(simpleCustomer());

    c1.base.firstName = randomString();

    const c2 = await ch.updateCustomer(c1.id, c1);

    const del = await ch.deleteCustomer(c2.id);

    expect(del).toEqual({ deleted: true });
  });

  it('can write and read back a simple customer', async () => {
    const local = simpleCustomer();
    const cid = (await ch.addCustomer(local)).id;
    const remote = await ch.getCustomer(cid);

    expect(remote.base).toEqual(local.base);
  });

  it('can write and read back all base properties', async () => {
    const local = complexCustomer();
    const cid = (await ch.addCustomer(local)).id;
    const remote = await ch.getCustomer(cid);

    expect(remote.base).toEqual(local.base);
  });

  it('creates, patches and deletes a customer', async () => {
    const customerData = simpleCustomer();
    const customer = await ch.addCustomer(customerData);

    const updatedCustomerData = simpleCustomer();
    const updatedCustomer = await ch.patchCustomer(customer.id, updatedCustomerData);
    expect(sanitize(updatedCustomer.base)).toEqual(updatedCustomerData.base);
  });


  it('adds and updates a job', async () => {
    const c1 = await ch.addCustomer(simpleCustomer());

    const job = await ch.addJob(c1.id, randomJob());

    const updatedJob = Object.assign({}, job, {
      jobTitle: randomJobTitle()
    });

    const j2 = await ch.updateJob(c1.id, updatedJob);

    expect(j2.jobTitle).toEqual(updatedJob.jobTitle);
  });
});
