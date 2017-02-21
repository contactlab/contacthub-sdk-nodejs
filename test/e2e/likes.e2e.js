// @flow

import { chTest, randomString } from './helper';

const ch = chTest();

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
