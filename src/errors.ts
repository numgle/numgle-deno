export class HttpError extends Error {
  public readonly status: number;
  public readonly headers: HeadersInit | undefined;
  constructor(status: number, message: string, headers?: HeadersInit) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.headers = headers;
  }
}