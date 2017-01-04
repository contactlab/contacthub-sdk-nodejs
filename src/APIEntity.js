// @flow

import type { Auth } from './types';
import API from './API';

export default class APIEntity {

  api: Object
  auth: Auth

  constructor(params: Object) {
    if (!(params.token && params.workspaceId && params.nodeId)) {
      throw new Error('Missing required ContactHub configuration.');
    }
    this.auth = {
      token: params.token,
      workspaceId: params.workspaceId,
      nodeId: params.nodeId
    };
    this.api = new API(this.auth);
  }

}
