export class VehicleResponseDTO {
  id: string;
  plate: string;
  name: string;
  active: boolean;
  occurrencesCount: number;
  lastOccurrence?: Date;
  createdAt: Date;

  constructor(vehicle: any) {
    this.id = vehicle.id;
    this.plate = vehicle.plate;
    this.name = vehicle.name;
    this.active = vehicle.active;
    
    this.occurrencesCount = vehicle.occurrences ? vehicle.occurrences.length : 0;
    
    if (vehicle.occurrences && vehicle.occurrences.length > 0) {
      const dates = vehicle.occurrences
        .map((occ: any) => new Date(occ.occurrenceDate).getTime())
        .filter((date: number) => !isNaN(date));
      
      if (dates.length > 0) {
        this.lastOccurrence = new Date(Math.max(...dates));
      }
    }

    this.createdAt = vehicle.createdAt;
  }

  static fromEntity(vehicle: any): VehicleResponseDTO {
    return new VehicleResponseDTO(vehicle);
  }

  static fromEntities(vehicles: any[]): VehicleResponseDTO[] {
    return vehicles.map(vehicle => new VehicleResponseDTO(vehicle));
  }

  static fromEntityWithDetails(vehicle: any): any {
    const occurrencesByType = vehicle.occurrences ? 
      vehicle.occurrences.reduce((acc: any, occ: any) => {
        acc[occ.type] = (acc[occ.type] || 0) + 1;
        return acc;
      }, {}) : {};

    return {
      id: vehicle.id,
      plate: vehicle.plate,
      name: vehicle.name,
      active: vehicle.active,
      statistics: {
        totalOccurrences: vehicle.occurrences ? vehicle.occurrences.length : 0,
        occurrencesByType,
        lastOccurrence: vehicle.occurrences && vehicle.occurrences.length > 0 ?
          new Date(Math.max(...vehicle.occurrences
            .map((occ: any) => new Date(occ.occurrenceDate).getTime())
            .filter((date: number) => !isNaN(date)))) : null
      },
      recentOccurrences: vehicle.occurrences ? 
        vehicle.occurrences
          .slice(0, 5)
          .map((occ: any) => ({
            id: occ.id,
            type: occ.type,
            date: occ.occurrenceDate,
            status: occ.status,
            municipality: occ.municipality
          })) : [],
      createdAt: vehicle.createdAt
    };
  }
}