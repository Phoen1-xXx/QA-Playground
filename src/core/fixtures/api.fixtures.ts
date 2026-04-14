import { test as base } from '@playwright/test';
import { APIClient } from '../../api/client/apiClient';
import { RequestHandler } from '../../api/client/requestHandler';

type ApiFixtures = {
    api: RequestHandler;
};

export const test = base.extend<ApiFixtures>({
    // 🔹 default API (no special headers)
    api: async ({ }, use) => {
        const client = new APIClient();
        const context = await client.createContext();
        const handler = new RequestHandler(context);

        await use(handler);
        await context.dispose();
    },
});