export class ApiError extends Error {
  constructor(
    public response: Response,
    message = `API error: ${response.status} ${response.statusText}`,
  ) {
    super(message);
  }
  get status(): number {
    return this.response.status;
  }
  get statusText(): string {
    return this.response.statusText;
  }
}

export const fetchApi = async (path: string | URL, init?: RequestInit): Promise<Response> => {
  const baseURL = process.env['API_BASE_URL'] ?? '/api';
  const response = await fetch(`${baseURL}${path}`, init);
  if (!response.ok) throw new ApiError(response);
  return response;
};

export const fetchApiJson = async <T>(path: string | URL, body?: unknown, baseInit?: RequestInit): Promise<T> => {
  const init = baseInit ?? {};
  if (body !== undefined) {
    init.body = JSON.stringify(body);
    init.headers = {
      ...init.headers,
      'Content-Type': 'application/json',
    };
  }
  const response = await fetchApi(path, init);
  return (await response.json()) as Promise<T>;
};
