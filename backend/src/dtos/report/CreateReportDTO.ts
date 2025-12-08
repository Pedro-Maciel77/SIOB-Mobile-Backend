export class CreateReportDTO {
  content: string;

  constructor(data: any) {
    this.content = data.content?.trim();
  }

  validate(): string[] {
    const errors: string[] = [];

    // Conteúdo
    if (!this.content) {
      errors.push('Conteúdo do relatório é obrigatório');
    } else if (this.content.length < 10) {
      errors.push('Relatório muito curto (mínimo 10 caracteres)');
    } else if (this.content.length > 10000) {
      errors.push('Relatório muito longo (máximo 10.000 caracteres)');
    }

    return errors;
  }

  toEntity(): any {
    return {
      content: this.content
    };
  }
}