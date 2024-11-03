import { faker } from "@faker-js/faker";
import CreateCustomerSatisfactionSurvey from "src/application/usecase/create-customer-satisfaction-survey";
import CreateCustomerSatisfactionSurveyAnswer from "src/application/usecase/create-customer-satisfaction-survey-answer";
import GetTargetAudience from "src/application/usecase/get-target-audience";
import BusinessError from "src/domain/errors/business-error";
import { BUSINESS_ERRORS } from "src/domain/errors/errors";

let createSatisfactionSurveyAnswer: CreateCustomerSatisfactionSurveyAnswer;
let createSatisfactionSurvey: CreateCustomerSatisfactionSurvey;
let getTargetAudience: GetTargetAudience;
let targetAudienceId: string;

beforeAll(async () => {
  createSatisfactionSurveyAnswer = new CreateCustomerSatisfactionSurveyAnswer();
  createSatisfactionSurvey = new CreateCustomerSatisfactionSurvey();
  getTargetAudience = new GetTargetAudience();
  targetAudienceId = (await getTargetAudience.execute()).ids[0];
});

test("Should not create a customer satisfaction survey answer with a non existant survey", async function () {
  const inputCreateSurvey = {
    title: faker.lorem.words(3),
    description: faker.lorem.words(5),
    maxRating: faker.number.int({ max: 10, min: 1 }),
    targetAudienceId,
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

  const inputCreateSurveyAnswer = {
    customerSatisfactionSurveyId: faker.string.uuid(),
    feedback: faker.lorem.words(5),
    rating: faker.number.int({ max: 10, min: 1 }),
  };

  await expect(() =>
    createSatisfactionSurveyAnswer.execute(inputCreateSurveyAnswer)
  ).rejects.toThrow(
    new BusinessError(BUSINESS_ERRORS.CUSTOMER_SATISFACTION_SURVEY_NOT_FOUND)
  );
});

test("Should not create a customer satisfaction survey answer with a maxRating greater than in the survey", async function () {
  const inputCreateSurvey = {
    title: faker.lorem.words(3),
    description: faker.lorem.words(5),
    maxRating: 1,
    targetAudienceId,
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

  const inputCreateSurveyAnswer = {
    customerSatisfactionSurveyId: responseCreateSurvey.id,
    feedback: faker.lorem.words(5),
    rating: 2,
  };

  await expect(() =>
    createSatisfactionSurveyAnswer.execute(inputCreateSurveyAnswer)
  ).rejects.toThrow(
    new BusinessError(BUSINESS_ERRORS.RATING_GREATER_THAN_ALLOWED)
  );
});

test("Should  create a customer satisfaction survey answer", async function () {
  const inputCreateSurvey = {
    title: faker.lorem.words(3),
    description: faker.lorem.words(5),
    maxRating: 2,
    targetAudienceId,
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

  const inputCreateSurveyAnswer = {
    customerSatisfactionSurveyId: responseCreateSurvey.id,
    feedback: faker.lorem.words(5),
    rating: 2,
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
});
