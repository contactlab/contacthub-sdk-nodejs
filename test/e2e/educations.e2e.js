// @flow

import { chTest, randomString } from './helper';

const ch = chTest();

const randomEducation = () => ({
  id: randomString(),
  schoolName: 'Politecnico di Torino'
});

describe('ContactHub', () => {
  it('adds, updates and deletes an education', async () => {
    const c1 = await ch.addCustomer({
      base: { contacts: { email: `${randomString()}@example.com` } }
    });

    const education = randomEducation();

    const e1 = await ch.addEducation(c1.id, education);
    expect(e1.id).toBe(education.id);

    const updatedEducation = Object.assign({}, education, {
      schoolName: 'Politecnico di Milano'
    });
    const e2 = await ch.updateEducation(c1.id, updatedEducation);
    expect(e2.schoolName).toEqual(updatedEducation.schoolName);

    const c2 = await ch.getCustomer(c1.id);
    expect(c2.base && c2.base.educations && c2.base.educations[0])
      .toEqual(updatedEducation);

    const res = await ch.deleteEducation(c1.id, education.id);
    expect(res).toBe(true);
  });
});
