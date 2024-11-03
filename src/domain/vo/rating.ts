import BusinessError from "../../../src/domain/errors/business-error";
import { BUSINESS_ERRORS } from "../errors/errors";

export default class Rating {
  private rating: number;

  constructor(rating: number) {
    if (!rating || Number.isNaN(rating) || rating < 1 || rating > 10)
      throw new BusinessError(BUSINESS_ERRORS.INVALID_RATING);
    this.rating = rating;
  }

  get Rating(): number {
    return this.rating;
  }
}
