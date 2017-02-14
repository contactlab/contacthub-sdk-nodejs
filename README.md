# Contacthub nodejs SDK

Node.js SDK for the Contacthub API.


## Requirements and design

This library requires Node.js v4 or later.

All asynchronous operations return a `Promise`.

[Flow](http://flowtype.org) type annotations are used throughout the library, and
can be leveraged if you use Flow in a project that depends on this library.

## Installation

This library will be soon available on [npmjs.com](https://www.npmjs.com/). For
now, you can clone this Git repository and install it from your local copy:

```sh
git clone git@github.com:/contactlab/contacthub-sdk-nodejs /tmp/contacthub-sdk-nodejs
npm install --save file:/tmp/contacthub-sdk-nodejs
```

## Quick start

```js
const ContactHub = require('contacthub-sdk-nodejs');

const ch = new ContactHub({
  token: 'YOUR_TOKEN',
  workspaceId: 'YOUR_WORKSPACE_ID',
  nodeId: 'YOUR_NODE_ID'
});

ch.getCustomer('CUSTOMER_ID').then(customer => {
  if (customer.base && customer.base.firstName && customer.base.lastName) {
    console.log(`${customer.base.firstName} ${customer.base.lastName}`);
  }
});
```

## Initializing and authenticating

All the functions provided by the SDK are exposed as methods of the
`ContactHub` object prototype.

To create a new instance, you need three authentication parameters: `token`,
`workspaceId` and `nodeId`. You can find them using the [Contacthub UI](https://hub.contactlab.it/#/settings/sources).

```js
const ch = new ContactHub({
  token: 'YOUR_TOKEN',
  workspaceId: 'YOUR_WORKSPACE_ID',
  nodeId: 'YOUR_NODE_ID'
});
```

The `ch` object uses the appropriate authentication parameters for all of the
methods listed below.

If you need to work with more than one workspace or node, or if you want to use
different tokens, you can instantiate multiple Contacthub objects.

## Session API

### createSessionId

Generates a new random sessionId to use in Contacthub events.

```js
const sessionId = ch.createSessionId();
```

### addCustomerSession

Reconciles a sessionId with an existing `Customer`. Use this if you want to
associate anonymous events (containing a sessionId) with an existing customerId.

Returns a `Promise` that resolves to `true` if the sessionId has been
successfully reconciled.

```js
ch.addCustomerSession(customerId, sessionId)
```

## Event API

### addEvent

Adds a new Event.

Returns a `Promise` that resolves to `true` if the API has successfully queued
the event for insertion. The API will then process the queue asynchronously, and it
can take a few seconds for an event to actually be stored.

```js
addEvent(event)
```

The `event` parameter is an object that can contain the following properties:

* `customerId`

  The ID of the `Customer` associated with the event.

* `externalId`

  The externalId of the `Customer` associated with the event.

* `sessionId`

  The ID of the session associated with the event.

* `context`

  One of `WEB`,`MOBILE`,`ECOMMERCE`,`RETAIL`,`SOCIAL`,`DIGITAL_CAMPAIGN`,`CONTACT_CENTER`,`IOT`,`OTHER`.

* `type`

  A valid event type (shown in [Contacthub settings](https://hub.contactlab.it/#/settings/events)).

* `properties`

  An object conforming to the JSON schema for the event type.

`context`, `type` and `properties` are always required.

You must specify one `customerId`, `externalId` or `sessionId`. If you
don't have any `Customer` information (for example, the customer is not logged in) you should
use a sessionId. This enables you to later reconcile all the events in the same
session with a `Customer`, when they log in.

**Example:**

The following is an example of a valid `event` object:

```js
const event = {
  sessionId: 'ses123',
  context: 'WEB',
  type: 'viewedPage',
  properties: {
    title: 'Page Title',
    url: 'http://www.example.com'
  }
};
```

### getEvent

Retrieves an event by its ID.

Returns a `Promise` that resolves to an `Event` object.

```js
ch.getEvent(eventId);
```

### getEvents

Retrieves all the events for a customer.

Returns a `Promise` that resolves to an `Array` of `Event` objects.

```js
ch.getEvents(customerId);
```

## Customer API

### addCustomer

Creates a new `Customer`.

Returns a `Promise` that resolves to a `Customer` object, including the `id` that 
was assigned by the API.

```js
ch.addCustomer(customerData)
```

The `customerData` parameter is an object that can contain the following properties:

* `externalId`

  A string identifying the customer in your own systems.

* `base`

  An object conforming to the JSON schema for [Base Properties](https://hub.contactlab.it/#/settings/properties).

* `extended`

  An object conforming the JSON schema for [Extended Properties](https://hub.contactlab.it/#/settings/properties).

* `extra`

  An optional string containing extra data about the customer.

* `tags`

  An optional object containing a list of tags associated with the
  customer. It must follow this format: 

  `{ auto: Array<string>, manual: Array<String> }`

The object must contain at least one of the following:

* `externalId`, `base` or `extended`

### getCustomer

Retrieves a single customer object by its customerId.

Returns a `Promise` that resolves to a `Customer` object.

```js
ch.getCustomer(customerId)
```

### getCustomers

Retrieves a paginated list of customers.

Returns a `Promise` that resolves to an `Array` of `Customer` objects.

```js
ch.getCustomers(options)
```

`options` is an optional object, which can contain one or more of the following
properties:

* `externalId`

  Only returns customers with this `externalId`.

* `query`

  Only returns customers that match the [Custom Query](#custom-queries).

* `fields`

  An `Array` that whitelists the fields to retrieve for each customer.

* `sort`

  The field where results are ordered.

* `direction`

  Either `asc` (ascending) or `desc` (descending). Ignored if `sort` is not specified.

### updateCustomer

Updates a customer, removing all their existing properties and replacing them with
the ones passed by this method.

Returns a `Promise` that resolves to a `Customer` object, which contains the updated
version of the `Customer`.

```js
ch.updateCustomer(customerId, customerData)
```

### patchCustomer

Patches a customer, keeping most of their existing properties, while replacing the
ones specified in `customerData`.

Returns a `Promise` that resolves to a `Customer` object, which contains the updated
version of the `Customer`.

```js
ch.patchCustomer(customerId, customerData)
```

### deleteCustomer

Deletes the customer object with the specified customerId.

Returns a `Promise` that resolves to `true` if the customer was successfully deleted.

```js
ch.deleteCustomer(customerId)
```

## Tag API

### addTag

Adds a tag to an existing `Customer`. The new tag will be appended to the
`tags.manual` array of tags, if not already present.

Returns a `Promise` that resolves to a `Customer` object, which contains  the updated
version of the `Customer`.

```js
ch.addTag(customerId, tag)
```

**Warning:** 

This method can suffer from race conditions, if there are other
clients updating the same workspace. 

It makes two API calls in short succession, retrieving the existing customer, 
then _patching_ it to replace the existing array of manual tags. 
This is temporary workaround, until the API supports atomic updates of the tags.

### removeTag

Removes a tag from an existing `Customer`. The new tag will be removed from the
`tags.manual` array of tags, if present.

Returns a `Promise` that resolves to a `Customer` object, which contains the updated
version of the `Customer`.

```js
ch.removeTag(customerId, tag)
```

**Warning:** 

This method can suffer from race conditions, if there are other
clients updating the same workspace. 

It makes two API calls in short succession, retrieving the existing customer, 
then _patching_ it to replace the existing array of manual tags. 
This is temporary workaround, until the API supports atomic updates of the tags.

## Education API

### addEducation

Adds a new `Education` object to an existing `Customer`.

Returns a `Promise` that resolves to a `Customer` object, which contains the updated
version of the `Customer`.

```js
ch.addEducation(customerId, education)
```

`education` is an object with the following properties:

* `id` (required)

  A unique identifier for this Education.

* `schoolType`
* `schoolName`
* `schoolConcentration`
* `startYear`
* `endYear`
* `isCurrent`

### updateEducation

Updates an existing `Education` object for an existing `Customer`.

Returns a `Promise` that resolves to a `Customer` object, which contains the updated
version of the `Customer`.

```js
ch.updateEducation(customerId, education)
```

The `education` object must contain an `id` that matches an existing `Education` for
the `Customer`. All the other properties of that `Education` will be replaced by
the new ones provided by this method.

### removeEducation

Removes an existing `Education` object from an existing `Customer`.

Returns a `Promise` that resolves to a `Customer` object, which contains the updated
version of the `Customer`.

```js
ch.removeEducation(customerId, educationId)
```

## Job API

### addJob

Adds a new `Job` object to an existing `Customer`.

Returns a `Promise` that resolves to a `Customer` object, which contains the updated
version of the `Customer`.

```js
ch.addJob(customerId, job)
```

`job` is an object with the following properties:

* `id` (required)

  A unique identifier for this Job.

* `companyIndustry`
* `companyName`
* `jobTitle`
* `startDate`
* `endDate`
* `isCurrent`

### updateJob

Updates an existing `Job` object for an existing `Customer`.

Returns a `Promise` that resolves to a `Customer` object, which contains the updated
version of the `Customer`.

```js
ch.updateJob(customerId, job)
```

The `job` object must contain an `id` that matches an existing `Job` for
the `Customer`. All the other properties of that `Job` will be replaced by
the new ones provided by this method.

### removeJob

Removes an existing `Job` object from an existing `Customer`.

Returns a `Promise` that resolves to a `Customer` object, which contains the updated
version of the `Customer`.

```js
ch.removeJob(customerId, jobId)
```


## Like API

### addLike

Adds a new `Like` object to an existing `Customer`.

Returns a `Promise` that resolves to a `Customer` object, which contains the updated
version of the `Customer`.

```js
ch.addLike(customerId, like)
```

`like` is an object with the following properties:

* `id` (required)

  A unique identifier for this Like.

* `category`
* `name`
* `createdTime`

### updateLike

Updates an existing `Like` object for an existing `Customer`.

Returns a `Promise` that resolves to a `Customer` object, which contains the updated
version of the `Customer`.

```js
ch.updateLike(customerId, like)
```

The `like` object must contain an `id` that matches an existing `Like` for
the `Customer`. All the other properties of that `Like` will be replaced by
the new ones provided by this method.

### removeLike

Removes an existing `Like` object from an existing `Customer`.

Returns a `Promise` that resolves to a `Customer` object, which contains the updated
version of the `Customer`.

```js
ch.removeLike(customerId, likeId)
```

## Custom queries

Contacthub supports a complex query language for advanced searches in the
`Customer` list. 

**Example:**

The following is an example of a valid query:

```js
ch.getCustomers({
  query: {
    name: 'testQuery',
    query: {
      name: 'mario',
      type: 'simple',
      are: {
        condition: {
          type: 'atomic',
          attribute: 'base.firstName',
          operator: 'EQUALS',
          value: 'Mario'
        }
      }
    }
  }
});
```

See the Contacthub documentation for further details.

## Examples

Check the [example](example/) folder for a simple app example.

## Contributing to this library

### Running tests

Run unit tests with `npm test`, or `npm run test-watch`, to enable watch mode.

Run e2e tests with `npm run e2e`, or `npm run e2e-watch`' to enable watch mode.

**Note:** 

To run an e2e test, you need to be authenticated with the API. Insert a valid
workspaceId, nodeId and token in the environment variables:

```sh
export CONTACTHUB_TEST_TOKEN="..."
export CONTACTHUB_TEST_WORKSPACE_ID="..."
export CONTACTHUB_TEST_NODE_ID="..."
```

**Important:**

Do **NOT** use a production workspace, because the tests will write test data (fake
Customers and Events) to the workspace they are using.

### Flow types

This library uses [Flow](flowtype.org) as a static type checker. Run `npm run
flow` to check the entire project for errors.

### Minimum Node version

This SDK is developed and tested against Node.js v4. To help developing against
this specific version, we provide a Dockerfile for testing purposes.

Here are the commands to run tests with docker:

```sh
$ docker build -t ch-node4 .
$ docker run --rm ch-node4
```
