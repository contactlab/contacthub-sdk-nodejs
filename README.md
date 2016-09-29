# contacthub-sdk-nodejs

## Basic usage

```js
const contacthub = require('contacthub-sdk-nodejs');

const ch = contacthub({
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
