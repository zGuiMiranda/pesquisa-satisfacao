import * as ExcelJS from "exceljs";

export interface ExportService<T, R, O> {
  exportDataToCsv(data: T[], columns: R): Promise<O>;
}

export default class ExcelJSExportService<T>
  implements ExportService<T, ExcelJS.Column[], ExcelJS.Buffer>
{
  private static instance: ExcelJSExportService<unknown> | null = null;
  private constructor() {}

  static getInstance() {
    if (!this.instance) {
      this.instance = new this();
    }
    return this.instance;
  }
  async exportDataToCsv(
    data: unknown[],
    columns: ExcelJS.Column[]
  ): Promise<ExcelJS.Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Data");

    worksheet.columns = columns;

    data.forEach((item) => {
      worksheet.addRow(item);
    });

    const csvBuffer = await workbook.csv.writeBuffer();
    return csvBuffer;
  }
}
