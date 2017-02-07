// @flow
import ContactHub from '../../src/ContactHub';

const chTest = (): ContactHub => {

  const tok = process.env.CONTACTHUB_TEST_TOKEN;
  const wid = process.env.CONTACTHUB_TEST_WORKSPACE;
  const nid = process.env.CONTACTHUB_TEST_NODE;

  if (!(tok && wid && nid)) {
    throw new Error('End-to-end tests require the following env variables to be set: '
                    + 'CONTACTHUB_TEST_TOKEN, CONTACTHUB_TEST_WORKSPACE, CONTACTHUB_TEST_NODE');
  }

  return new ContactHub({
    token: tok,
    workspaceId: wid,
    nodeId: nid
  });

};

const randomString = (): string => Math.random().toString(36).substr(2, 8);

export { chTest, randomString };
