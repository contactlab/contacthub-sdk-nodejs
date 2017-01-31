// @flow

import ContactHub from '../../src/ContactHub';

const ch = new ContactHub({
  token: '97841617075b4b5f8ea88c30a8d2aec7647b7181df2c483fa78138c8d58aed4d',
  workspaceId: '40b6195f-e4f7-4f95-b10e-75268d850988',
  nodeId: '854f0791-c120-4e4a-9264-6dd197cb922c'
});

const randomString = (): string => Math.random().toString(36).substr(2, 8);

const randomLike = () => ({
  id: randomString(),
  name: 'JavaScript'
});

describe('ContactHub', () => {
  it('adds, updates and deletes a like', async () => {
    const c1 = await ch.addCustomer({
      base: { contacts: { email: `${randomString()}@example.com` } }
    });

    const like = randomLike();

    const l1 = await ch.addLike(c1.id, like);
    expect(l1.id).toBe(like.id);

    const updatedLike = Object.assign({}, like, {
      name: 'TypeScript'
    });
    const l2 = await ch.updateLike(c1.id, updatedLike);
    expect(l2.name).toEqual(updatedLike.name);

    const c2 = await ch.getCustomer(c1.id);
    expect(c2.base && c2.base.likes && c2.base.likes[0])
      .toEqual(updatedLike);

    const res = await ch.deleteLike(c1.id, like.id);
    expect(res).toBe(true);
  });
});
