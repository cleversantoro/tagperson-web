import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { API_BASE_URL } from './api-config';
import { CombatFromGroup, ApiAddCombatSkillRequest } from '../models/combat.models';

@Injectable({ providedIn: 'root' })
export class CombatService {
  constructor(private http: HttpClient) { }

  async addCombat(characterId: number, payload: ApiAddCombatSkillRequest): Promise<void> {
    await firstValueFrom(this.http.post<void>(`${API_BASE_URL}/characters/${characterId}/combat`, payload));
  }

  async addCombatSkill(characterId: number, combatSkillId: number, combatGroupId: number, level?: number, type?: number) {
      await this.addCombat(
        characterId,
        {
          combatSkillId,
          combatGroupId: combatGroupId ?? 0,
          level: level ?? 0,
          type: type ?? 0
        }
      );
  }

  getBasicCombat(): Observable<CombatFromGroup[]> {
    return this.http.get<CombatFromGroup[]>(`${API_BASE_URL}/combat/views/combat_basic`);
  }

  getProfessionCombat(professionId: number): Observable<CombatFromGroup[]> {
    return this.http.get<CombatFromGroup[]>(`${API_BASE_URL}/combat/views/${professionId}/combat_profession`);
  }

  getEspecializationCombat(especialiationId: number): Observable<CombatFromGroup[]> {
    return this.http.get<CombatFromGroup[]>(`${API_BASE_URL}/combat/views/${especialiationId}/combat_especialization`);
  }

}
