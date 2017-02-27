import { chTest } from './helper';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

describe('ContactHub', () => {
  describe('errors', async () => {
    it('should return an unauthorized error (401)', async () => {
      const fakeCh = chTest({ token: 'fake-token' });
      try {
        await fakeCh.getCustomers();
      } catch (err) {
        expect(err.status).toBe(401);
        expect(err.message).toBe('The client is not authorized to access the API');
      }
    });

    it('should return a workspace not found error (403)', async () => {
      try {
        await chTest({ workspaceId: 'fake-workspace-id' }).getCustomers();
      } catch (err) {
        expect(err.status).toBe(403);
        expect(err.message).toBe('workspace not found: fake-workspace-id');
      }
    });

    it('should return a node not found error (404)', async () => {
      try {
        await chTest({ nodeId: 'fake-node-id' }).getCustomers();
      } catch (err) {
        expect(err.status).toBe(404);
        expect(err.message).toBe('node not foundfake-node-id');
      }
    });


    it('should return a duplicated customer error (409)', async () => {
      let customer;
      const customerEmail = 'duplicated-email@fake-customer.com';
      const customerData = { base: { contacts: { email: customerEmail } } };

      const ch = chTest();

      // try to add a customer for the first time to be sure it's present or fetch it from API
      try {
        customer = await ch.addCustomer(customerData);
      } catch (err) {
        const query = {
          name: '',
          query: {
            name: 'duplicated-email',
            type: 'simple',
            are: {
              condition: {
                type: 'atomic',
                attribute: 'base.contacts.email',
                operator: 'EQUALS',
                value: customerEmail
              }
            }
          }
        };
        customer = await ch.getCustomers({ query }).then((customers) => customers[0]);
      }

      try {
        await ch.addCustomer(customerData);
      } catch (err) {
        expect(err.status).toBe(409);
        // TODO: typo for `existing` from api
        expect(err.message).toBe(`Conflict with exiting customer ${customer.id}`);
      }
    });
  });
});
