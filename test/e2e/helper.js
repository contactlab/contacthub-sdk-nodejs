// @flow
import ContactHub from '../../src/ContactHub';

const chTest = (): ContactHub => {

  const token = process.env.CONTACTHUB_TEST_TOKEN;
  const workspaceId = process.env.CONTACTHUB_TEST_WORKSPACE_ID;
  const nodeId = process.env.CONTACTHUB_TEST_NODE_ID;

  if (!(token && workspaceId && nodeId)) {
    throw new Error('End-to-end tests require the following env variables to be set: '
      + 'CONTACTHUB_TEST_TOKEN, CONTACTHUB_TEST_WORKSPACE_ID, CONTACTHUB_TEST_NODE_ID');
  }

  return new ContactHub({ token, workspaceId, nodeId });
};

const randomString = (): string => Math.random().toString(36).substr(2, 8);

export { chTest, randomString };
