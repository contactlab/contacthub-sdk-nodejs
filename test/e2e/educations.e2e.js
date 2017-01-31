// @flow

import ContactHub from '../../src/ContactHub';

const ch = new ContactHub({
  token: '97841617075b4b5f8ea88c30a8d2aec7647b7181df2c483fa78138c8d58aed4d',
  workspaceId: '40b6195f-e4f7-4f95-b10e-75268d850988',
  nodeId: '854f0791-c120-4e4a-9264-6dd197cb922c'
});

const randomString = (): string => Math.random().toString(36).substr(2, 8);

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
