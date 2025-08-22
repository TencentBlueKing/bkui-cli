export default class RequestError extends Error {
  public code: number;
  public message: string;
  public response: unknown;
  constructor(code: number, message: string, response?: unknown) {
    super();
    this.code = code;
    this.message = message;
    this.response = response;
  }
}
