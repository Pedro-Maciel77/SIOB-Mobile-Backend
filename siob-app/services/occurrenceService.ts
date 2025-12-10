// services/occurrenceService.ts
import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CreateOccurrenceData {
  type: 'acidente' | 'resgate' | 'incendio' | 'atropelamento' | 'outros';
  municipality: string;
  neighborhood?: string;
  address: string;
  latitude?: number;
  longitude?: number;
  occurrenceDate: string; // ISO string
  activationDate: string; // ISO string
  status: 'aberto' | 'em_andamento' | 'finalizado' | 'alerta';
  victimName?: string;
  victimContact?: string;
  vehicleNumber?: string;
  description: string;
  vehicleId?: string;
}

export interface Occurrence {
  id: string;
  type: string;
  municipality: string;
  neighborhood?: string;
  address: string;
  latitude?: number;
  longitude?: number;
  occurrenceDate: string;
  activationDate: string;
  status: string;
  victimName?: string;
  victimContact?: string;
  vehicleNumber?: string;
  description: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  vehicle?: {
    id: string;
    plate: string;
    name: string;
  };
  images: Array<{
    id: string;
    filename: string;
    path: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export const occurrenceService = {
  // Criar nova ocorrência
  async createOccurrence(data: CreateOccurrenceData): Promise<Occurrence> {
    try {
      const token = await AsyncStorage.getItem('@SIOB:token');
      if (!token) {
        throw new Error('Token não encontrado');
      }

      console.log('📤 Enviando ocorrência:', data);

      const response = await api.post('/occurrences', data, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000
      });

      if (response.data.success === false) {
        throw new Error(response.data.message || 'Erro ao criar ocorrência');
      }

      console.log('✅ Ocorrência criada com sucesso:', response.data.data?.id);
      return response.data.data;
      
    } catch (error: any) {
      console.error('❌ Erro ao criar ocorrência:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    }
  },

  // Upload de imagem para ocorrência
  async uploadImage(occurrenceId: string, imageUri: string): Promise<any> {
    try {
      const token = await AsyncStorage.getItem('@SIOB:token');
      if (!token) {
        throw new Error('Token não encontrado');
      }

      // Cria FormData para upload
      const formData = new FormData();
      
      // Extrai nome do arquivo da URI
      const filename = imageUri.split('/').pop() || `image_${Date.now()}.jpg`;
      
      // Converte URI para blob (forma simplificada para React Native)
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: filename
      } as any);

      const response = await api.post(`/occurrences/${occurrenceId}/images`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        timeout: 30000
      });

      return response.data.data;
      
    } catch (error: any) {
      console.error('❌ Erro ao fazer upload da imagem:', error);
      throw error;
    }
  },

  // Buscar veículos disponíveis
  async getVehicles(): Promise<any[]> {
    try {
      const token = await AsyncStorage.getItem('@SIOB:token');
      if (!token) {
        return [];
      }

      const response = await api.get('/vehicles', {
        headers: { Authorization: `Bearer ${token}` },
        params: { active: true }
      });

      return response.data.data || [];
      
    } catch (error) {
      console.warn('Erro ao buscar viaturas:', error);
      return [];
    }
  },

  // Buscar municípios (se tiver endpoint)
  async getMunicipalities(): Promise<any[]> {
    try {
      const token = await AsyncStorage.getItem('@SIOB:token');
      if (!token) {
        return [];
      }

      const response = await api.get('/municipalities', {
        headers: { Authorization: `Bearer ${token}` },
        params: { active: true }
      });

      return response.data.data || [];
      
    } catch (error) {
      console.warn('Erro ao buscar municípios:', error);
      return [];
    }
  },

  // Converter localização para município/bairro
  async geocodeLocation(latitude: number, longitude: number): Promise<{
    municipality?: string;
    neighborhood?: string;
    address?: string;
  }> {
    try {
      // Usa serviço de geocodificação (exemplo com OpenStreetMap)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
      );
      
      const data = await response.json();
      
      if (data.address) {
        return {
          municipality: data.address.city || data.address.town || data.address.village,
          neighborhood: data.address.suburb || data.address.neighbourhood,
          address: data.display_name
        };
      }
      
      return {};
      
    } catch (error) {
      console.warn('Erro no geocoding:', error);
      return {};
    }
  }
};