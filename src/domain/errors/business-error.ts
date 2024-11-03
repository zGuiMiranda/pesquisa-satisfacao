export default class BusinessError extends Error {
  private errorStatus: number = 400;
  constructor(message: string) {
    super(message);
    this.message = message;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
  get status(): number {
    return this.errorStatus;
  }
}
