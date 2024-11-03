import { faker } from "@faker-js/faker";
import CreateCustomerSatisfactionSurvey from "src/application/usecase/create-customer-satisfaction-survey";
import CreateCustomerSatisfactionSurveyAnswer from "src/application/usecase/create-customer-satisfaction-survey-answer";
import GetCustomerSatisfactionSurveyAnswers from "src/application/usecase/get-customer-satisfaction-survey-answers";
import GetTargetAudience from "src/application/usecase/get-target-audience";

let createSatisfactionSurveyAnswer: CreateCustomerSatisfactionSurveyAnswer;
let createSatisfactionSurvey: CreateCustomerSatisfactionSurvey;
let getTargetAudience: GetTargetAudience;
let getSatisfactionSurveyAnswers: GetCustomerSatisfactionSurveyAnswers;

let targetAudienceIds: string[];

beforeAll(async () => {
  createSatisfactionSurveyAnswer = new CreateCustomerSatisfactionSurveyAnswer();
  createSatisfactionSurvey = new CreateCustomerSatisfactionSurvey();
  getTargetAudience = new GetTargetAudience();
  targetAudienceIds = (await getTargetAudience.execute()).ids;
  getSatisfactionSurveyAnswers = new GetCustomerSatisfactionSurveyAnswers();
});

test("Should  get customer satisfaction survey answers by asc", async function () {
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

  const getAnswersOrderedByRatingAsc =
    await getSatisfactionSurveyAnswers.execute({
      targetAudienceId: responseCreateSurvey.targetAudienceId,
      order: "asc",
    });

  expect(
    getAnswersOrderedByRatingAsc.every(
      (value, index) =>
        index === 0 || getAnswersOrderedByRatingAsc[index - 1] <= value
    )
  ).toBe(true);
});

test("Should  get customer satisfaction survey answers by desc", async function () {
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

  const getAnswersOrderedByRatingDesc =
    await getSatisfactionSurveyAnswers.execute({
      targetAudienceId: responseCreateSurvey.targetAudienceId,
      order: "desc",
    });

  expect(
    getAnswersOrderedByRatingDesc.every(
      (value, index) =>
        index === 0 || getAnswersOrderedByRatingDesc[index - 1] >= value
    )
  ).toBe(true);
});
