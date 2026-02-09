import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from './api-config';
import { CharacterizationGroup, CharacterizationItem, CharacterizationType } from '../models/characterization.models';



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
