// @flow
import type { Auth } from './types';
import axios from 'axios';

const baseURL = 'https://api.contactlab.it/hub/v1';

/* Internal abstractions */

export default class API {

  workspaceId: string
  nodeId: string
  axios: Object

  constructor(auth: Auth) {
    this.workspaceId = auth.workspaceId;
    this.nodeId = auth.nodeId;
    this.axios = axios.create({
      baseURL,
      headers: {
        Authorization: `Bearer ${auth.token}`
      },
      transformResponse: [(data: string) => {
        return data && JSON.parse(data);
      }]
    });
  }

  get(opts: Object): Promise<Object> {
    return this.axios.get(`/workspaces/${this.workspaceId}/${opts.endpoint}`, { params: { nodeId: this.nodeId } })
      .then(res => res.data);
  }

  post(opts: Object): Promise<Object> {
    return this.axios.post(`/workspaces/${this.workspaceId}/${opts.endpoint}`, opts.data)
      .then(res => res.data);
  }

  put(opts: Object): Promise<Object> {
    return this.axios.put(`/workspaces/${this.workspaceId}/${opts.endpoint}`, opts.data)
      .then(res => res.data);
  }

  del(opts: Object) {
    return this.axios.delete(`/workspaces/${this.workspaceId}/${opts.endpoint}`, { params: { nodeId: this.nodeId } })
      .then(res => res.data);
  }
}
