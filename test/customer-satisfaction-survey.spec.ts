import BusinessError from "src/domain/errors/business-error";

import { faker } from "@faker-js/faker";
import CustomerSatisfactionSurvey from "src/domain/entity/customer-satisfaction-survey";
import { BUSINESS_ERRORS } from "src/domain/errors/errors";
import UUID from "src/domain/vo/uuid";
import { SATISFACTION_SURVEY_STATUSES } from "src/domain/vo/customer-satisfaction-survey-status";
import TargetAudience from "src/domain/entity/target-audience";

test("Should not allow creating a customer satisfaction survey without a title", function () {
  expect(() =>
    CustomerSatisfactionSurvey.create(
      "",
      faker.lorem.words(3),
      1,
      TargetAudience.create("sasas"),
      faker.internet.email()
    )
  ).toThrow(new BusinessError(BUSINESS_ERRORS.INVALID_TITLE));
});

test("Should not allow creating a customer satisfaction survey with less than 3 words", function () {
  expect(() =>
    CustomerSatisfactionSurvey.create(
      faker.lorem.words(2),
      "description description description",
      1,
      TargetAudience.create("sasas"),
      faker.internet.email()
    )
  ).toThrow(new BusinessError(BUSINESS_ERRORS.INVALID_TITLE));
});

test("Should not allow creating a customer satisfaction description with less than 5 words", function () {
  expect(() =>
    CustomerSatisfactionSurvey.create(
      faker.lorem.words(3),
      faker.lorem.words(4),
      1,
      TargetAudience.create("sasas"),
      faker.internet.email()
    )
  ).toThrow(new BusinessError(BUSINESS_ERRORS.INVALID_DESCRIPTION));
});

test("Should not allow creating a satisfaction survey with a rating less than 1", function () {
  expect(() =>
    CustomerSatisfactionSurvey.create(
      faker.lorem.words(3),
      faker.lorem.words(5),
      0,
      TargetAudience.create("sasas"),
      faker.internet.email()
    )
  ).toThrow(new BusinessError(BUSINESS_ERRORS.INVALID_RATING));
});

test("Should not allow creating a satisfaction survey with a rating greater than 10", function () {
  expect(() =>
    CustomerSatisfactionSurvey.create(
      faker.lorem.words(3),
      faker.lorem.words(5),
      11,
      TargetAudience.create("sasas"),
      faker.internet.email()
    )
  ).toThrow(new BusinessError(BUSINESS_ERRORS.INVALID_RATING));
});

test("Should not allow creating a satisfaction survey with a invalid email", function () {
  expect(() =>
    CustomerSatisfactionSurvey.create(
      faker.lorem.words(3),
      faker.lorem.words(5),
      10,
      TargetAudience.create("sasas"),
      "invalidemail@teste."
    )
  ).toThrow(new BusinessError(BUSINESS_ERRORS.INVALID_EMAIL));
});
