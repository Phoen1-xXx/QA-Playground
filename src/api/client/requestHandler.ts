import { APIRequestContext } from '@playwright/test';
import { Logger } from '../../core/logger';
import { SchemaManager } from '../schema/schemaManager';
import { AllureHelper } from '../../core/allureHelper';

export class RequestHandler {
    private context: APIRequestContext;
    private url: string = '';
    private headers: Record<string, string> = {};
    private payload: any;

    constructor(context: APIRequestContext) {
        this.context = context;
    }

    path(url: string) {
        this.url = url;
        return this;
    }

    header(headers: Record<string, string>) {
        this.headers = { ...this.headers, ...headers };
        return this;
    }

    body(data: any) {
        this.payload = data;
        return this;
    }

    private reset() {
        this.url = '';
        this.headers = {};
        this.payload = undefined;
    }

    private getSchemaMode(): string | undefined {
        return process.env.SCHEMA;
    }

    private async handleSchema(method: string, responseStatus: number, responseBody: any) {
        const schemaMode = this.getSchemaMode();

        Logger.info(`Schema mode: ${schemaMode || 'OFF'}`);

        if (!schemaMode) {
            return;
        }

        const schemaName = SchemaManager.sanitizeName(method, this.url);
        const schemaType = responseStatus >= 200 && responseStatus < 300 ? 'success' : 'error';

        if (schemaMode === 'fix') {
            const generatedSchema = SchemaManager.generate(responseBody);
            SchemaManager.save(schemaName, schemaType, generatedSchema);

            Logger.info(`Schema regenerated for ${schemaName} [${schemaType}]`);
            return;
        }

        if (schemaMode === 'true') {
            const schemaExists = SchemaManager.exists(schemaName, schemaType);

            if (!schemaExists) {
                const generatedSchema = SchemaManager.generate(responseBody);
                SchemaManager.save(schemaName, schemaType, generatedSchema);

                Logger.info(`Schema created for ${schemaName} [${schemaType}]`);
                return;
            }

            const existingSchema = SchemaManager.load(schemaName, schemaType);
            const validationResult = SchemaManager.validate(existingSchema, responseBody);

            if (!validationResult.isValid) {
                const formattedErrors = this.formatSchemaErrors(validationResult.errors);

                Logger.error(`Schema validation failed for ${schemaName} [${schemaType}]`, {
                    errors: formattedErrors,
                    responseBody,
                    expectedSchema: existingSchema,
                });

                await AllureHelper.attachJson('Schema Validation Errors', formattedErrors);
                await AllureHelper.attachJson('Schema Validation Response Body', responseBody);
                await AllureHelper.attachJson('Expected Schema', existingSchema);

                throw new Error(`Schema validation failed for ${schemaName} [${schemaType}]`);
            }

            Logger.info(`Schema validation passed for ${schemaName} [${schemaType}]`);
        }
    }

    private formatSchemaErrors(errors: any[]) {
        return errors.map((error) => ({
            path: error.instancePath || '/',
            message: error.message,
            keyword: error.keyword,
            params: error.params,
        }));
    }

    private async sendRequest(
        method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
        expectedStatus?: number
    ) {

        const requestLog = {
            endpoint: `${method} ${this.url}`,
            headers: this.headers,
            ...(method !== 'GET' && method !== 'DELETE' ? { body: this.payload } : {}),
        };

        const requestOptions: any = {
            headers: this.headers,
        };

        if (method !== 'GET' && method !== 'DELETE') {
            requestOptions.data = this.payload;
        }
        try {
            await AllureHelper.attachJson('Request', {
                method,
                url: this.url,
                headers: this.headers,
                ...(method !== 'GET' && method !== 'DELETE' ? { body: this.payload } : {}),
            });

            const response = await this.context.fetch(this.url, {
                method,
                ...requestOptions,
            });

            const responseBody = await response.json().catch(() => null);

            await AllureHelper.attachJson('Response', {
                status: response.status(),
                body: responseBody,
            });

            const responseLog = {
                status: response.status(),
                body: responseBody,
            };

            await this.handleSchema(method, response.status(), responseBody);

            if (expectedStatus && response.status() !== expectedStatus) {
                Logger.error(`Request failed: ${method} ${this.url}`, {
                    request: requestLog,
                    response: responseLog,
                });

                throw new Error(`Expected ${expectedStatus}, got ${response.status()}`);
            }

            Logger.debug(`Request passed: ${method} ${this.url} -> ${response.status()}`);

            return { response, body: responseBody };
        } catch (error) {
            Logger.error(`Request execution failed: ${method} ${this.url}`, {
                request: requestLog,
                error: error instanceof Error ? error.message : String(error),
            });

            throw error;
        } finally {
            this.reset();
        }
    }

    async postRequest(expectedStatus?: number) {
        return this.sendRequest('POST', expectedStatus);
    }

    async getRequest(expectedStatus?: number) {
        return this.sendRequest('GET', expectedStatus);
    }

    async putRequest(expectedStatus?: number) {
        return this.sendRequest('PUT', expectedStatus);
    }

    async patchRequest(expectedStatus?: number) {
        return this.sendRequest('PATCH', expectedStatus);
    }

    async deleteRequest(expectedStatus?: number) {
        return this.sendRequest('DELETE', expectedStatus);
    }
}