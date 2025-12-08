export class LocationHelper {
  static calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Raio da Terra em km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distância em km
    
    return distance;
  }

  static deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  static isValidLatitude(lat: number): boolean {
    return lat >= -90 && lat <= 90;
  }

  static isValidLongitude(lon: number): boolean {
    return lon >= -180 && lon <= 180;
  }

  static formatCoordinates(lat: number, lon: number): string {
    const latDir = lat >= 0 ? 'N' : 'S';
    const lonDir = lon >= 0 ? 'E' : 'W';
    
    const absLat = Math.abs(lat);
    const absLon = Math.abs(lon);
    
    const latDeg = Math.floor(absLat);
    const latMin = Math.floor((absLat - latDeg) * 60);
    const latSec = ((absLat - latDeg) * 60 - latMin) * 60;
    
    const lonDeg = Math.floor(absLon);
    const lonMin = Math.floor((absLon - lonDeg) * 60);
    const lonSec = ((absLon - lonDeg) * 60 - lonMin) * 60;
    
    return `${latDeg}°${latMin}'${latSec.toFixed(2)}"${latDir} ${lonDeg}°${lonMin}'${lonSec.toFixed(2)}"${lonDir}`;
  }

  static getAddressFromCoordinates(lat: number, lon: number): Promise<string> {
    // Em implementação real, integraria com Google Maps API ou similar
    return Promise.resolve(`${lat.toFixed(6)}, ${lon.toFixed(6)}`);
  }

  static getNearbyMunicipalities(
    lat: number,
    lon: number,
    radiusKm: number = 50
  ): string[] {
    // Em implementação real, consultaria banco de dados de municípios
    // Retornando municípios dentro do raio
    return ['Recife', 'Olinda', 'Jaboatão dos Guararapes'];
  }
}