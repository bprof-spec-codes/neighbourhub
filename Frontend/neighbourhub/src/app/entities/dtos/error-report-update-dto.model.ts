export class ErrorReportUpdateDto {
  constructor(
    public title: string,
    public description: string,
    public category: string,
    public priority: string,
    public status: string,
    public scheduledRepairDate: string | null
  ) {}
}
