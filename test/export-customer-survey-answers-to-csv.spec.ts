import { faker } from "@faker-js/faker";
import CreateCustomerSatisfactionSurvey from "src/application/usecase/create-customer-satisfaction-survey";
import CreateCustomerSatisfactionSurveyAnswer from "src/application/usecase/create-customer-satisfaction-survey-answer";
import ExportCustomerSatisfactionSurveyAnswers, {
  ANSWERS_CSV_TYPE,
} from "src/application/usecase/export-customer-satisfaction-survey-answers";
import GetTargetAudience from "src/application/usecase/get-target-audience";
import { Registry } from "src/infra/di/di";
import { ExportService } from "src/infra/export/export-to-csv";

let createSatisfactionSurveyAnswer: CreateCustomerSatisfactionSurveyAnswer;
let createSatisfactionSurvey: CreateCustomerSatisfactionSurvey;
let getTargetAudience: GetTargetAudience;
let exportCustomerSatisfactionSurveyAnswers: ExportCustomerSatisfactionSurveyAnswers;

let targetAudienceIds: string[];

let exportServiceMock: ExportService<
  ANSWERS_CSV_TYPE,
  {
    header: string;
    key: string;
    property: string;
  }[],
  Buffer
>;

beforeAll(async () => {
  exportServiceMock = {
    exportDataToCsv: jest.fn(),
  };

  Registry.getInstance().provide("exportService", exportServiceMock);

  createSatisfactionSurveyAnswer = new CreateCustomerSatisfactionSurveyAnswer();
  createSatisfactionSurvey = new CreateCustomerSatisfactionSurvey();
  getTargetAudience = new GetTargetAudience();
  targetAudienceIds = (await getTargetAudience.execute()).ids;
  exportCustomerSatisfactionSurveyAnswers =
    new ExportCustomerSatisfactionSurveyAnswers();
});

test("Should  create a customer satisfaction survey answer by asc", async function () {
  const inputCreateSurvey = {
    title: faker.lorem.words(3),
    description: faker.lorem.words(5),
    maxRating: 10,
    targetAudienceId: targetAudienceIds[0],
    contactEmail: faker.internet.email(),
  };
  const responseCreateSurvey = await createSatisfactionSurvey.execute(
    inputCreateSurvey
  );

  expect(responseCreateSurvey.description).toEqual(
    inputCreateSurvey.description
  );
  expect(responseCreateSurvey.title).toEqual(inputCreateSurvey.title);
  expect(responseCreateSurvey.maxRating).toEqual(inputCreateSurvey.maxRating);
  expect(responseCreateSurvey.targetAudienceId).toEqual(
    inputCreateSurvey.targetAudienceId
  );
  expect(responseCreateSurvey.contactEmail).toEqual(
    inputCreateSurvey.contactEmail
  );

  for (let i = 0; i < 5; i++) {
    const inputCreateSurveyAnswer = {
      customerSatisfactionSurveyId: responseCreateSurvey.id,
      feedback: faker.lorem.words(5),
      rating: faker.number.int({ max: 10, min: 1 }),
    };

    const answerResponse = await createSatisfactionSurveyAnswer.execute(
      inputCreateSurveyAnswer
    );
    expect(answerResponse.createdAt).toBeInstanceOf(Date);
    expect(answerResponse.customerSatisfactionSurveyId).toEqual(
      inputCreateSurveyAnswer.customerSatisfactionSurveyId
    );
    expect(answerResponse.rating).toEqual(inputCreateSurveyAnswer.rating);
    expect(answerResponse.feedback).toEqual(inputCreateSurveyAnswer.feedback);
    expect(answerResponse.customerSatisfactionSurveyAnswerId).toBeDefined();
  }

  await exportCustomerSatisfactionSurveyAnswers.execute({
    targetAudienceId: responseCreateSurvey.targetAudienceId,
    order: "asc",
  });

  expect(exportServiceMock.exportDataToCsv).toHaveBeenCalledTimes(1);

  expect(exportServiceMock.exportDataToCsv).toHaveBeenCalledWith(
    expect.arrayContaining([
      expect.objectContaining({
        feedback: expect.any(String),
        rating: expect.any(Number),
      }),
    ]),
    expect.arrayContaining([
      expect.objectContaining({
        header: "Feedback",
        key: "feedback",
        property: "feedback",
      }),
      expect.objectContaining({
        header: "Quantidade de estrelas",
        key: "rating",
        property: "rating",
      }),
      expect.objectContaining({
        header: "Titulo da pergunta",
        key: "surveyTitle",
        property: "surveyTitle",
      }),
      expect.objectContaining({
        header: "Descricao da pergunta",
        key: "surveyDescription",
        property: "surveyDescription",
      }),
    ])
  );
});
