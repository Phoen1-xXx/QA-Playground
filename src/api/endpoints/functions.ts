import { RequestHandler } from '../client/requestHandler';

type AdminAuthOptions = {
    body?: any;
    header?: Record<string, string>;
    statusCode?: number;
};

export async function login(
    api: RequestHandler,
    { body, header, statusCode }: AdminAuthOptions
) {
    const request = api.path('/api/login');

    const headers: Record<string, string> = {};

    if (body) {
        request.body(body);
    }

    if (header) {
        Object.assign(headers, header);
    }

    if (Object.keys(headers).length) {
        request.header(headers);
    }

    return request.postRequest(statusCode ?? 201);
}