// @flow
import ContactHub from '../../src/ContactHub';

type chTestArgumentsType = {
  token: string,
  workspaceId: string,
  nodeId: string
};

const chTest = (options: ?chTestArgumentsType): ContactHub => {
  const {
    token: _token,
    workspaceId: _workspaceId,
    nodeId: _nodeId
  } = options || {};
  const token = _token || process.env.CONTACTHUB_TEST_TOKEN;
  const workspaceId = _workspaceId || process.env.CONTACTHUB_TEST_WORKSPACE_ID;
  const nodeId = _nodeId || process.env.CONTACTHUB_TEST_NODE_ID;

  if (!(token && workspaceId && nodeId)) {
    throw new Error('End-to-end tests require the following env variables to be set: '
      + 'CONTACTHUB_TEST_TOKEN, CONTACTHUB_TEST_WORKSPACE_ID, CONTACTHUB_TEST_NODE_ID');
  }

  return new ContactHub({ token, workspaceId, nodeId });
};

const randomString = (): string => Math.random().toString(36).substr(2, 8);

export { chTest, randomString };
