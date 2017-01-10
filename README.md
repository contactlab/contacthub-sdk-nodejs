# contacthub-sdk-nodejs

## Basic usage

```js
const ContactHub = require('contacthub-sdk-nodejs');

const ch = new ContactHub({
  token: 'YOUR_TOKEN',
  workspaceId: 'YOUR_WORKSPACE_ID',
  nodeId: 'YOUR_NODE_ID'
});

ch.getCustomer('CUSTOMER_ID').then(res => console.log(res));
```


## Customer API

Available methods:

* `getCustomer(customerId)` returns a single customer object by customerId.
* `getCustomers()` returns a paginated list of customers.
* `addCustomer(customer)` inserts a new customer and returns the customerId.
* `updateCustomer(customer)` updates a customer -- `customer` needs to include
  an `id` property, all existing properties will be removed and replaced by the
  ones passed to this method.
* `deleteCustomer(customerId)` deletes a customer object by customerId.


## Contributing to this library

### Running tests

Run unit tests with `npm test` or (`npm run test-watch` to enable watch mode).

Run e2e tests with `npm run e2e`.

This *sdk* is tested against *node v4* and to help testing for this specific node version there is a `Dockerfile`.

Here are the commands to run tests with docker.

```sh
$ docker build -t ch-node4 .
$ docker run --rm ch-node4
```
