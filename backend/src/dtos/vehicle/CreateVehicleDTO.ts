export class CreateVehicleDTO {
  plate: string;
  name: string;
  active: boolean;

  constructor(data: any) {
    this.plate = data.plate?.trim().toUpperCase();
    this.name = data.name?.trim();
    this.active = data.active !== undefined ? Boolean(data.active) : true;
  }

  validate(): string[] {
    const errors: string[] = [];

    // Placa
    if (!this.plate) {
      errors.push('Placa é obrigatória');
    } else if (!this.isValidPlate(this.plate)) {
      errors.push('Formato de placa inválido. Use: ABC-1234 ou ABC1D23');
    }

    // Nome
    if (!this.name) {
      errors.push('Nome da viatura é obrigatório');
    } else if (this.name.length < 2) {
      errors.push('Nome deve ter pelo menos 2 caracteres');
    } else if (this.name.length > 100) {
      errors.push('Nome deve ter no máximo 100 caracteres');
    }

    return errors;
  }

  private isValidPlate(plate: string): boolean {
    // Aceita formatos: ABC-1234 (antigo) ou ABC1D23 (Mercosul)
    const plateRegex = /^[A-Z]{3}-\d{4}$|^[A-Z]{3}\d[A-Z]\d{2}$/;
    return plateRegex.test(plate);
  }

  toEntity(): any {
    return {
      plate: this.plate,
      name: this.name,
      active: this.active
    };
  }
}