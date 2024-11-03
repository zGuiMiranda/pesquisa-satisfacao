import BusinessError from "../errors/business-error";
import { BUSINESS_ERRORS } from "../errors/errors";

export default class AnswerFeedback {
  private value: string;

  constructor(value: string) {
    if (value.length > 250)
      throw new BusinessError(BUSINESS_ERRORS.INVALID_FEEDBACK_LENGTH);
    this.value = value;
  }

  get Value() {
    return this.value;
  }
}
