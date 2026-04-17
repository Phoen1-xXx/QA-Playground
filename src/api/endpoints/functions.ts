import { RequestHandler } from '../client/requestHandler';

type AuthOptions = {
    body?: any;
    header?: Record<string, string>;
    statusCode: number;
};

export async function login(
    api: RequestHandler,
    { body, header, statusCode }: AuthOptions
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

    return request.postRequest(statusCode);
}

type LogoutOptions = {
    statusCode: number;
};

export async function logout(
    api: RequestHandler,
    { statusCode }: LogoutOptions
) {
    const request = api.path('/api/logout');

    const headers: Record<string, string> = {};

    if (Object.keys(headers).length) {
        request.header(headers);
    }

    return request.postRequest(statusCode);
}

type MeOptions = {
    body?: any;
    header?: Record<string, string>;
    statusCode: number;
};

export async function me(
    api: RequestHandler,
    { body, header, statusCode }: MeOptions
) {
    const request = api.path('/api/me');

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

    return request.getRequest(statusCode);
}