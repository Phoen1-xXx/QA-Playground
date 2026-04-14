import { test } from '@playwright/test';

export class AllureHelper {
    static async attachJson(name: string, data: any) {
        if (data === undefined || data === null) {
            return;
        }

        await test.info().attach(name, {
            body: JSON.stringify(data, null, 2),
            contentType: 'application/json',
        });
    }

    static async attachText(name: string, text: string) {
        await test.info().attach(name, {
            body: text,
            contentType: 'text/plain',
        });
    }
}