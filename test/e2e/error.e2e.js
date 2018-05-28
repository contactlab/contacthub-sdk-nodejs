import { chTest, randomString } from './helper';

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
        expect(err.message).toBe('node not found fake-node-id');
      }
    });


    it('should return a duplicated customer error (409)', async () => {
      const customerEmail = `${randomString()}@example.com`;
      const customerData = { base: { contacts: { email: customerEmail } } };

      const ch = chTest();
      const customer = await ch.addCustomer(customerData);

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
