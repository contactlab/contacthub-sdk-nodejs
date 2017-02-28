// @flow
import type { Auth } from './types';
import axios from 'axios';

const baseURL = 'https://api.contactlab.it/hub/v1';

class ContactHubError extends Error {

  name: string
  status: number
  message: string
  raw: Error

  constructor({ status, message, raw }) {
    super(raw);
    this.name = 'ContactHubError';
    this.status = status;
    this.message = message;
    this.raw = raw;
    Error.captureStackTrace(this, ContactHubError);
  }
}

function handleError(error: Object): ContactHubError | Error {
  if (error.response) {
    throw new ContactHubError({
      status: error.response.status,
      message: error.response.data.message,
      raw: error
    });
  } else {
    throw error;
  }
}

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
      }
    });
  }

  get(opts: Object): Promise<Object> {
    return this.axios.request({
      method: 'get',
      url: `/workspaces/${this.workspaceId}/${opts.endpoint}`,
      params: opts.params
    })
    .then(res => res.data)
    .catch(handleError);
  }

  post(opts: Object): Promise<Object> {
    return this.axios.request({
      method: 'post',
      url: `/workspaces/${this.workspaceId}/${opts.endpoint}`,
      data: opts.data
    })
    .then(res => res.data)
    .catch(handleError);
  }

  put(opts: Object): Promise<Object> {
    return this.axios.request({
      method: 'put',
      url: `/workspaces/${this.workspaceId}/${opts.endpoint}`,
      data: opts.data
    })
    .then(res => res.data)
    .catch(handleError);
  }

  patch(opts: Object): Promise<Object> {
    return this.axios.request({
      method: 'patch',
      url: `/workspaces/${this.workspaceId}/${opts.endpoint}`,
      data: opts.data
    })
    .then(res => res.data)
    .catch(handleError);
  }

  delete(opts: Object): Promise<Object> {
    return this.axios.request({
      method: 'delete',
      url: `/workspaces/${this.workspaceId}/${opts.endpoint}`,
      params: opts.params
    })
    .then(res => res.data)
    .catch(handleError);
  }
}
