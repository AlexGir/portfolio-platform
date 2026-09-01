import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError, apiFetch } from './api';

function jsonResponse(body: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'content-type': 'application/json' },
    ...init,
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('apiFetch', () => {
  it('returns the parsed JSON body on success', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ id: '1', email: 'a@b.c' }));
    vi.stubGlobal('fetch', fetchMock);

    const data = await apiFetch<{ id: string }>('/users/me');
    expect(data).toEqual({ id: '1', email: 'a@b.c' });
  });

  it('always sends credentials and a JSON content-type', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({}));
    vi.stubGlobal('fetch', fetchMock);

    await apiFetch('/health');

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(init.credentials).toBe('include');
    expect((init.headers as Record<string, string>)['Content-Type']).toBe('application/json');
  });

  it('attaches a bearer token when given', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({}));
    vi.stubGlobal('fetch', fetchMock);

    await apiFetch('/users/me', { accessToken: 'abc.def.ghi' });

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer abc.def.ghi');
  });

  it('throws ApiError carrying the status, message and code from the envelope', async () => {
    const fetchMock = vi
      .fn()
      .mockImplementation(() =>
        Promise.resolve(
          jsonResponse(
            { error: { code: 'unauthorized', message: 'Missing bearer token' } },
            { status: 401 },
          ),
        ),
      );
    vi.stubGlobal('fetch', fetchMock);

    await expect(apiFetch('/users/me')).rejects.toBeInstanceOf(ApiError);
    await expect(apiFetch('/users/me')).rejects.toMatchObject({
      status: 401,
      code: 'unauthorized',
      message: 'Missing bearer token',
    });
  });

  it('falls back to the status text when there is no JSON body', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 500, statusText: 'Server Error' }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(apiFetch('/x')).rejects.toMatchObject({ status: 500, message: 'Server Error' });
  });
});
