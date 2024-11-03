import { ExportService } from "src/infra/export/export-to-csv";
import BusinessError from "../../../src/domain/errors/business-error";
import { BUSINESS_ERRORS } from "../../../src/domain/errors/errors";
import { inject } from "../../../src/infra/di/di";
import { CustomerSatisfactionSurveyAnswerRepositoryInterface } from "../../../src/infra/repository/customer-satisfaction-survey-answer-repository";
import { TargetAudienceRepositoryInterface } from "../../../src/infra/repository/target-audience-repository";

export type ANSWERS_CSV_TYPE = { feedback: string; rating: number };
export default class ExportCustomerSatisfactionSurveyAnswers {
  @inject("customerSatisfactionSurveyAnswerRepository")
  private customerSatisfactionSurveyAnswerRepository: CustomerSatisfactionSurveyAnswerRepositoryInterface;
  @inject("targetAudienceRepository")
  private targetAudienceRepository: TargetAudienceRepositoryInterface;
  @inject("exportService")
  private exportService: ExportService<
    ANSWERS_CSV_TYPE,
    {
      header: string;
      key: string;
      property: string;
    }[],
    Buffer
  >;
  async execute(input: Input): Promise<Output> {
    const getTargetAudience = await this.targetAudienceRepository.findById(
      input.targetAudienceId
    );

    if (!getTargetAudience)
      throw new BusinessError(BUSINESS_ERRORS.TARGET_AUDIENCE_NOT_FOUND);

    const response =
      await this.customerSatisfactionSurveyAnswerRepository.findByTargetAudience(
        input.targetAudienceId,
        input.order
      );

    const columns = getColumnsToExport();

    const csvResponse = await this.exportService.exportDataToCsv(
      response.map((answer) => ({
        feedback: answer.Feedback,
        rating: answer.Rating,
        surveyTitle: answer.CustomerSatisfactionSurvey.Title,
        surveyDescription: answer.CustomerSatisfactionSurvey.Description,
      })),
      columns
    );

    return csvResponse;
  }
}

const getColumnsToExport = () => {
  return [
    {
      header: "Titulo da pergunta",
      key: "surveyTitle",
      property: "surveyTitle",
    },
    {
      header: "Descricao da pergunta",
      key: "surveyDescription",
      property: "surveyDescription",
    },
    { header: "Feedback", key: "feedback", property: "feedback" },
    { header: "Quantidade de estrelas", key: "rating", property: "rating" },
  ];
};

type Input = { targetAudienceId: string; order?: "asc" | "desc" };
type Output = Buffer;
