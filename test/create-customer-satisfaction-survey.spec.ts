import { faker } from "@faker-js/faker";
import CreateCustomerSatisfactionSurvey from "src/application/usecase/create-customer-satisfaction-survey";
import GetTargetAudience from "src/application/usecase/get-target-audience";
import BusinessError from "src/domain/errors/business-error";
import { BUSINESS_ERRORS } from "src/domain/errors/errors";

let createSatisfactionSurvey: CreateCustomerSatisfactionSurvey;
let getTargetAudience: GetTargetAudience;

let targetAudienceId: string;
beforeAll(async () => {
  createSatisfactionSurvey = new CreateCustomerSatisfactionSurvey();
  getTargetAudience = new GetTargetAudience();
  targetAudienceId = (await getTargetAudience.execute()).ids[0];
});

test("Should not create a customer satisfaction survey with a non existant target audience", async function () {
  const input = {
    title: faker.lorem.words(3),
    description: faker.lorem.words(5),
    maxRating: 1,
    targetAudienceId: faker.string.uuid(),
    contactEmail: faker.internet.email(),
  };
  await expect(() => createSatisfactionSurvey.execute(input)).rejects.toThrow(
    new BusinessError(BUSINESS_ERRORS.TARGET_AUDIENCE_NOT_FOUND)
  );
});
test("Should create a customer satisfaction survey", async function () {
  const input = {
    title: faker.lorem.words(3),
    description: faker.lorem.words(5),
    maxRating: faker.number.int({ max: 10, min: 1 }),
    targetAudienceId,
    contactEmail: faker.internet.email(),
  };
  const response = await createSatisfactionSurvey.execute(input);

  expect(response.description).toEqual(input.description);
  expect(response.title).toEqual(input.title);
  expect(response.maxRating).toEqual(input.maxRating);
  expect(response.targetAudienceId).toEqual(input.targetAudienceId);
  expect(response.contactEmail).toEqual(input.contactEmail);
});
