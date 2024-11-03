import { faker } from "@faker-js/faker";
import CreateCustomerSatisfactionSurvey from "src/application/usecase/create-customer-satisfaction-survey";
import GetTargetAudience from "src/application/usecase/get-target-audience";
import UpdateCustomerSatisfactionSurvey from "src/application/usecase/update-customer-satisfaction-survey";
import BusinessError from "src/domain/errors/business-error";
import { BUSINESS_ERRORS } from "src/domain/errors/errors";
import { SATISFACTION_SURVEY_STATUSES } from "src/domain/vo/customer-satisfaction-survey-status";

let createSatisfactionSurvey: CreateCustomerSatisfactionSurvey;
let updateSatisfactionSurvey: UpdateCustomerSatisfactionSurvey;
let getTargetAudience: GetTargetAudience;
let targetAudienceId: string;

beforeAll(async () => {
  updateSatisfactionSurvey = new UpdateCustomerSatisfactionSurvey();
  createSatisfactionSurvey = new CreateCustomerSatisfactionSurvey();
  getTargetAudience = new GetTargetAudience();
  targetAudienceId = (await getTargetAudience.execute()).ids[0];
});

test("Should not update a non existant customer satisfaction survey", async function () {
  const createInput = {
    title: faker.lorem.words(3),
    description: faker.lorem.words(5),
    maxRating: faker.number.int({ max: 10, min: 1 }),
    targetAudienceId,
    contactEmail: faker.internet.email(),
  };
  const createResponse = await createSatisfactionSurvey.execute(createInput);

  expect(createResponse.description).toEqual(createInput.description);
  expect(createResponse.title).toEqual(createInput.title);
  expect(createResponse.maxRating).toEqual(createInput.maxRating);
  expect(createResponse.targetAudienceId).toEqual(createInput.targetAudienceId);
  expect(createResponse.contactEmail).toEqual(createInput.contactEmail);

  const updateInput = {
    id: faker.string.uuid(),
    title: faker.lorem.words(3),
    description: faker.lorem.words(5),
    maxRating: faker.number.int({ max: 10, min: 1 }),
    targetAudienceId,
    contactEmail: faker.internet.email(),
    status: SATISFACTION_SURVEY_STATUSES.ACTIVE,
  };

  await expect(() =>
    updateSatisfactionSurvey.execute(updateInput)
  ).rejects.toThrow(
    new BusinessError(BUSINESS_ERRORS.CUSTOMER_SATISFACTION_SURVEY_NOT_FOUND)
  );
});

test("Should  update a  existant customer satisfaction survey", async function () {
  const createInput = {
    title: faker.lorem.words(3),
    description: faker.lorem.words(5),
    maxRating: faker.number.int({ max: 10, min: 1 }),
    targetAudienceId,
    contactEmail: faker.internet.email(),
  };
  const createResponse = await createSatisfactionSurvey.execute(createInput);

  expect(createResponse.description).toEqual(createInput.description);
  expect(createResponse.title).toEqual(createInput.title);
  expect(createResponse.maxRating).toEqual(createInput.maxRating);
  expect(createResponse.targetAudienceId).toEqual(createInput.targetAudienceId);
  expect(createResponse.contactEmail).toEqual(createInput.contactEmail);

  const updateInput = {
    id: createResponse.id,
    title: faker.lorem.words(3),
    description: faker.lorem.words(5),
    maxRating: faker.number.int({ max: 10, min: 1 }),
    targetAudienceId,
    contactEmail: faker.internet.email(),
    status: SATISFACTION_SURVEY_STATUSES.ACTIVE,
  };

  const updateRFesponse = await updateSatisfactionSurvey.execute(updateInput);
  expect(updateRFesponse.contactEmail).toBe(updateInput.contactEmail);
  expect(updateRFesponse.title).toBe(updateInput.title);
  expect(updateRFesponse.description).toBe(updateInput.description);
  expect(updateRFesponse.id).toBe(updateInput.id);
  expect(updateRFesponse.maxRating).toBe(updateInput.maxRating);

  expect(updateRFesponse.updatedAt).not.toBeNull();
  expect(updateRFesponse.updatedAt).toBeInstanceOf(Date);
});
