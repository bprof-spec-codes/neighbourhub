export class ErrorReportCreateDto {
  constructor(
    public title: string,
    public description: string,
    public category: string
  ) {}
}
