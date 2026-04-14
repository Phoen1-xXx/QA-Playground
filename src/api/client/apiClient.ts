import { request, APIRequestContext } from '@playwright/test';
import { config } from '../../../configs/env';

export class APIClient {
    async createContext(headers?: Record<string, string>): Promise<APIRequestContext> {
        return await request.newContext({
            baseURL: config.baseURL,
            extraHTTPHeaders: {
                'Content-Type': 'application/json',
                ...headers,
            },
        });
    }
}