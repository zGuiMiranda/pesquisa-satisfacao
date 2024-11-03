import CustomerSatisfactionSurveyAnswer from "../../../src/domain/entity/customer-satisfaction-survey-answer";
import DatabaseConnection from "../database/database-connection";
import { inject } from "../di/di";
import AbstractRepository from "./abstract-repository";

export interface CustomerSatisfactionSurveyAnswerRepositoryInterface {
  findById(id: string): Promise<CustomerSatisfactionSurveyAnswer>;
  findByTargetAudience(
    targetAudienceId: string,
    orderByRating?: "asc" | "desc"
  ): Promise<CustomerSatisfactionSurveyAnswer[]>;
  create(
    customerSatisfactionSurveyAnswer: CustomerSatisfactionSurveyAnswer
  ): Promise<CustomerSatisfactionSurveyAnswer>;
}

export default class CustomerSatisfactionSurveyAnswerRepository
  extends AbstractRepository
  implements CustomerSatisfactionSurveyAnswerRepositoryInterface
{
  @inject("connection") private connection: DatabaseConnection;
  private schemaTableStatement = ` ${process.env.POSTGRES_SCHEMA}.customer_satisfaction_survey_answer`;

  async create(
    customerSatisfactionSurveyAnswer: CustomerSatisfactionSurveyAnswer
  ): Promise<CustomerSatisfactionSurveyAnswer> {
    const [{ customer_satisfaction_survey_answer_id }] =
      await this.connection?.query(
        `insert into ${this.schemaTableStatement} (customer_satisfaction_survey_answer_id, customer_satisfaction_survey_id, feedback, rating) values ($1, $2, $3, $4) RETURNING customer_satisfaction_survey_answer_id`,
        [
          customerSatisfactionSurveyAnswer.CustomSatisfactionSurveyAnswerId,
          customerSatisfactionSurveyAnswer.CustomSatisfactionSurveyId,
          customerSatisfactionSurveyAnswer.Feedback,
          customerSatisfactionSurveyAnswer.Rating,
        ]
      );
    return this.findById(customer_satisfaction_survey_answer_id);
  }

  async findById(id: string): Promise<CustomerSatisfactionSurveyAnswer> {
    const [answer] = await this.connection?.query(
      `select * from  ${this.schemaTableStatement} where customer_satisfaction_survey_answer_id = $1`,
      [id]
    );

    if (!answer) return null;

    const {
      customer_satisfaction_survey_answer_id,
      customer_satisfaction_survey_id,
      feedback,
      rating,
      created_at,
    } =
      (answer as {
        customer_satisfaction_survey_answer_id: string;
        customer_satisfaction_survey_id: string;
        feedback: string;
        rating: number;
        created_at: Date;
      }) || {};

    return new CustomerSatisfactionSurveyAnswer(
      customer_satisfaction_survey_answer_id,
      customer_satisfaction_survey_id,
      rating,
      feedback,
      created_at
    );
  }
  async findByTargetAudience(
    targetAudience: string,
    orderByRating: "asc" | "desc" = "desc"
  ): Promise<CustomerSatisfactionSurveyAnswer[]> {
    const answers = await this.connection?.query(
      `select * from  ${this.schemaTableStatement} cssa inner join ${process.env.POSTGRES_SCHEMA}.customer_satisfaction_survey css
      on css.customer_satisfaction_survey_id = cssa.customer_satisfaction_survey_id 
       where css.target_audience_id = $1 order by rating ${orderByRating}`,
      [targetAudience]
    );
    if (!answers.length) return [];

    return answers.map(
      (answer: {
        customer_satisfaction_survey_answer_id: string;
        customer_satisfaction_survey_id: string;
        rating: number;
        feedback: string;
        created_at: Date;
      }) =>
        new CustomerSatisfactionSurveyAnswer(
          answer.customer_satisfaction_survey_answer_id,
          answer.customer_satisfaction_survey_id,
          answer.rating,
          answer.feedback,
          answer.created_at
        )
    );
  }
}
