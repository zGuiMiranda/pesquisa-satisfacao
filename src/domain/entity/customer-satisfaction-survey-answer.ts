import AnswerFeedback from "../vo/answer-feedback";
import Rating from "../vo/rating";
import UUID from "../vo/uuid";

export default class CustomerSatisfactionSurveyAnswer {
  private customerSatisfactionSurveyAnswerId: UUID;
  private customerSatisfactionSurveyId: UUID;
  private feedback: AnswerFeedback;
  private rating: Rating;
  private createdAt?: Date;

  constructor(
    customerSatisfactionSurveyAnswerId: string,
    customerSatisfactionSurveyId: string,
    rating: number,
    feedback: string,
    createdAt?: Date
  ) {
    this.customerSatisfactionSurveyAnswerId = new UUID(
      customerSatisfactionSurveyAnswerId
    );
    this.customerSatisfactionSurveyId = new UUID(customerSatisfactionSurveyId);
    this.rating = new Rating(rating);
    this.feedback = new AnswerFeedback(feedback);
    this.createdAt = createdAt;
  }

  static create(
    customerSatisfactionSurveyId: string,
    rating: number,
    feedback?: string
  ) {
    const answerId = UUID.create();

    return new CustomerSatisfactionSurveyAnswer(
      answerId.Id,
      customerSatisfactionSurveyId,
      rating,
      feedback
    );
  }

  get Feedback(): string {
    return this.feedback.Value;
  }

  get Rating(): number {
    return this.rating.Rating;
  }

  get CustomSatisfactionSurveyAnswerId(): string {
    return this.customerSatisfactionSurveyAnswerId.Id;
  }
  get CustomSatisfactionSurveyId(): string {
    return this.customerSatisfactionSurveyId.Id;
  }
  get CreatedAt(): Date | undefined {
    return this.createdAt;
  }
}
