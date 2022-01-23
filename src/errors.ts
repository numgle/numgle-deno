export class HttpError extends Error {
  public readonly status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
  }
}
