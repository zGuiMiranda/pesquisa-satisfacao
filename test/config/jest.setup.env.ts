import * as dotenv from "dotenv";
import { PgPromiseAdapter } from "src/infra/database/database-connection";
import { Registry } from "src/infra/di/di";
import ExcelJSExportService from "src/infra/export/export-to-csv";
import CustomerSatisfactionSurveyAnswerRepository from "src/infra/repository/customer-satisfaction-survey-answer-repository";
import CustomerSatisfactionSurveyRepository from "src/infra/repository/customer-satisfaction-survey-repository";
import TargetAudienceRepository from "src/infra/repository/target-audience-repository";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
Registry.getInstance().provide("connection", PgPromiseAdapter.getInstance());
Registry.getInstance().provide(
  "customerSatisfactionSurveyRepository",
  CustomerSatisfactionSurveyRepository.getInstance()
);
Registry.getInstance().provide(
  "targetAudienceRepository",
  TargetAudienceRepository.getInstance()
);
Registry.getInstance().provide(
  "customerSatisfactionSurveyAnswerRepository",
  CustomerSatisfactionSurveyAnswerRepository.getInstance()
);
