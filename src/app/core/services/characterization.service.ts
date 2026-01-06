import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from './api-config';

export interface CharacterizationType {
  id: number;
  name: string;
  description?: string;
  displayOrder?: number;
}

export interface CharacterizationGroup {
  id: number;
  name: string;
  characterizationTypeId: number;
  displayOrder?: number;
}

export interface CharacterizationItem {
  id: number;
  characterizationTypeId?: number;
  characterizationGroupId?: number;
  placeId?: number;
  name: string;
  description?: string;
  notes?: string;
  cost?: number;
  isInitial?: number;
  isRare?: number;
  isAllowGame?: number;
}

@Injectable({ providedIn: 'root' })
export class CharacterizationService {
  constructor(private http: HttpClient) {}

  async getTypes(): Promise<CharacterizationType[]> {
    return await firstValueFrom(
      this.http.get<CharacterizationType[]>(`${API_BASE_URL}/characterization/types`)
    );
  }

  async getGroups(typeId: number): Promise<CharacterizationGroup[]> {
    return await firstValueFrom(
      this.http.get<CharacterizationGroup[]>(`${API_BASE_URL}/characterization/groups${typeId}`)
    );
  }

  async getCharacterizations(typeId: number, groupId: number): Promise<CharacterizationItem[]> {
    return await firstValueFrom(
      this.http.get<CharacterizationItem[]>(
        `${API_BASE_URL}/characterization/${typeId}/type/${groupId}/group`
      )
    );
  }
}
