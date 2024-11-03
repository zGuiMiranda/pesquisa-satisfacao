import AnswerFeedback from "../vo/answer-feedback";
import Rating from "../vo/rating";
import UUID from "../vo/uuid";
import CustomerSatisfactionSurvey from "./customer-satisfaction-survey";

export default class CustomerSatisfactionSurveyAnswer {
  private customerSatisfactionSurveyAnswerId: UUID;
  private customerSatisfactionSurvey?: CustomerSatisfactionSurvey;
  private feedback: AnswerFeedback;
  private rating: Rating;
  private createdAt?: Date;

  constructor(
    customerSatisfactionSurveyAnswerId: string,
    rating: number,
    feedback: string,
    customerSatisfactionSurvey?: CustomerSatisfactionSurvey,
    createdAt?: Date
  ) {
    this.customerSatisfactionSurveyAnswerId = new UUID(
      customerSatisfactionSurveyAnswerId
    );
    this.rating = new Rating(rating);
    this.feedback = new AnswerFeedback(feedback);
    this.createdAt = createdAt;
    this.customerSatisfactionSurvey = customerSatisfactionSurvey
      ? new CustomerSatisfactionSurvey(
          customerSatisfactionSurvey.CustomSatisfactionSurveyId,
          customerSatisfactionSurvey.Title,
          customerSatisfactionSurvey.Description,
          customerSatisfactionSurvey.MaxRating,
          customerSatisfactionSurvey.TargetAudience,
          customerSatisfactionSurvey.Status,
          customerSatisfactionSurvey.ContactEmail,
          customerSatisfactionSurvey.CreatedAt,
          customerSatisfactionSurvey.UpdatedAt
        )
      : null;
  }

  static create(
    customerSatisfactionSurvey: CustomerSatisfactionSurvey,
    rating: number,
    feedback?: string
  ) {
    const answerId = UUID.create();

    return new CustomerSatisfactionSurveyAnswer(
      answerId.Id,
      rating,
      feedback,
      customerSatisfactionSurvey,
      null
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

  get CreatedAt(): Date | undefined {
    return this.createdAt;
  }

  get CustomerSatisfactionSurvey(): CustomerSatisfactionSurvey {
    return this.customerSatisfactionSurvey;
  }
}
