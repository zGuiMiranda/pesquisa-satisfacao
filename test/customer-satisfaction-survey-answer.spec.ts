import BusinessError from "src/domain/errors/business-error";

import { faker } from "@faker-js/faker";
import CustomerSatisfactionSurveyAnswer from "src/domain/entity/customer-satisfaction-survey-answer";
import { BUSINESS_ERRORS } from "src/domain/errors/errors";

test("Should not allow creating a customer satisfaction survey answer with feedback too long (length longer than 250)", function () {
  expect(() =>
    CustomerSatisfactionSurveyAnswer.create(
      faker.string.uuid(),
      faker.number.int({ max: 10, min: 1 }),
      faker.lorem.paragraphs(5).slice(0, 251)
    )
  ).toThrow(new BusinessError(BUSINESS_ERRORS.INVALID_FEEDBACK_LENGTH));
});
