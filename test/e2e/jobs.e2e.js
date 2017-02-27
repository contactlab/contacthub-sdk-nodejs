// @flow

import { chTest, randomString } from './helper';

const ch = chTest();

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

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

describe('ContactHub', () => {
  it('adds, updates and deletes a job', async () => {
    const c1 = await ch.addCustomer({
      base: { contacts: { email: `${randomString()}@example.com` } }
    });

    const job = randomJob();

    const j1 = await ch.addJob(c1.id, job);
    expect(j1.id).toBe(job.id);

    const updatedJob = Object.assign({}, job, {
      jobTitle: randomJobTitle()
    });
    const j2 = await ch.updateJob(c1.id, updatedJob);
    expect(j2.jobTitle).toEqual(updatedJob.jobTitle);

    const res = await ch.deleteJob(c1.id, job.id);
    expect(res).toBe(true);
  });
});
