import BusinessError from "../../../src/domain/errors/business-error";
import { BUSINESS_ERRORS } from "../errors/errors";

export default class Email {
  private value: string;

  constructor(value: string) {
    if (!value.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/))
      throw new BusinessError(BUSINESS_ERRORS.INVALID_EMAIL);
    this.value = value;
  }

  get Value() {
    return this.value;
  }
}
