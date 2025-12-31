import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from './api-config';
import { AuthService } from './auth.service';
import { SkillFromGroup, SkillGroup, SkillGroupWithSkills, SkillSpecializationSuggestion, EquipmentLookup, CategoryLookup } from '../models/rules.models';
import { CombatGroup, CombatGroupWithItems, CombatFromGroup } from '../models/combat.models';
import { SpellGroup, SpellGroupWithSpells, SpellFromGroup } from '../models/spells.models';
import { EquipmentGroup, EquipmentGroupWithItems, EquipmentFromGroup } from '../models/equipment.models';

interface LookupItem {
  id: number;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class RulesService {
  readonly races = signal<LookupItem[]>([]);
  readonly professions = signal<LookupItem[]>([]);
  readonly skillGroups = signal<SkillGroupWithSkills[]>([]);
  readonly combatGroups = signal<CombatGroupWithItems[]>([]);
  readonly spellGroups = signal<SpellGroupWithSpells[]>([]);
  readonly equipmentGroups = signal<EquipmentGroupWithItems[]>([]);
  readonly equipments = signal<EquipmentLookup[]>([]);
  readonly categories = signal<CategoryLookup[]>([]);

  constructor(private http: HttpClient, private auth: AuthService) {
    void this.load();
  }

  async load() {
    const ok = await this.auth.ensureToken();
    if (!ok) return;
    const [races, profs, groups, combatGroups, spellGroups, equipmentGroups, equipments, categories] = await Promise.all([
      firstValueFrom(this.http.get<LookupItem[]>(`${API_BASE_URL}/lookups/races`)),
      firstValueFrom(this.http.get<LookupItem[]>(`${API_BASE_URL}/lookups/professions`)),
      firstValueFrom(this.http.get<SkillGroup[]>(`${API_BASE_URL}/skills/groups`)),
      firstValueFrom(this.http.get<CombatGroup[]>(`${API_BASE_URL}/combat/groups`)),
      firstValueFrom(this.http.get<SpellGroup[]>(`${API_BASE_URL}/spells/groups`)),
      firstValueFrom(this.http.get<EquipmentGroup[]>(`${API_BASE_URL}/equipments/groups`)),
      firstValueFrom(this.http.get<EquipmentLookup[]>(`${API_BASE_URL}/lookups/equipments`)),
      firstValueFrom(this.http.get<CategoryLookup[]>(`${API_BASE_URL}/lookups/categories`))
    ]);
    this.races.set(races);
    this.professions.set(profs);
    this.equipments.set(equipments);
    this.categories.set(categories);
    await this.loadSkills(groups);
    await this.loadCombat(combatGroups);
    await this.loadSpells(spellGroups);
    await this.loadEquipmentGroups(equipmentGroups);
  }

  private async loadSkills(groups: SkillGroup[]) {
    const childrenLists = await Promise.all(
      groups.map(g => firstValueFrom(this.http.get<SkillGroup[]>(`${API_BASE_URL}/skills/groups/${g.id}/children`)))
    );

    const flatGroups = this.mergeGroupsPreferParents(groups, childrenLists);

    const skillsLists = await Promise.all(
      flatGroups.map(g => firstValueFrom(this.http.get<SkillFromGroup[]>(`${API_BASE_URL}/skills/groups/${g.id}/skills`)))
    );

    const merged: SkillGroupWithSkills[] = flatGroups.map((group, idx) => ({
      group,
      skills: skillsLists[idx]
    }));

    this.skillGroups.set(merged);
  }

  private async loadCombat(groups: CombatGroup[]) {
    const childrenLists = await Promise.all(
      groups.map(g => firstValueFrom(this.http.get<CombatGroup[]>(`${API_BASE_URL}/combat/groups/${g.id}/children`)))
    );

    // const flatGroups = childrenLists.flatMap((children, idx) =>
    //   children.length ? children : [groups[idx]]
    // );

    const flatGroups = this.mergeGroupsPreferParents(groups, childrenLists);

    const itemsLists = await Promise.all(
      flatGroups.map(g => firstValueFrom(this.http.get<CombatFromGroup[]>(`${API_BASE_URL}/combat/groups/${g.id}/items`)))
    );

    const merged: CombatGroupWithItems[] = flatGroups.map((group, idx) => ({
      group: {...group },
      items: itemsLists[idx]
    }));

    this.combatGroups.set(merged);
  }

  private mergeGroupsPreferParents<T extends { id: number }>(parents: T[], childrenLists: T[][]): T[] {
    const map = new Map<number, T>();
    childrenLists.forEach(list => list.forEach(c => map.set(c.id, c)));
    parents.forEach(p => map.set(p.id, p));
    return Array.from(map.values());
  }

  private async loadSpells(groups: SpellGroup[]) {
    const childrenLists = await Promise.all(
      groups.map(g => firstValueFrom(this.http.get<SpellGroup[]>(`${API_BASE_URL}/spells/groups/${g.id}/children`)))
    );

    const flatGroups = childrenLists.flatMap((children, idx) =>
      children.length ? children : [groups[idx]]
    );

    const spellsLists = await Promise.all(
      flatGroups.map(g => firstValueFrom(this.http.get<SpellFromGroup[]>(`${API_BASE_URL}/spells/groups/${g.id}/spells`)))
    );

    const merged: SpellGroupWithSpells[] = flatGroups.map((group, idx) => ({
      group,
      spells: spellsLists[idx]
    }));

    this.spellGroups.set(merged);
  }

  private async loadEquipmentGroups(groups: EquipmentGroup[]) {
    const itemsLists = await Promise.all(
      groups.map(g => firstValueFrom(this.http.get<EquipmentFromGroup[]>(`${API_BASE_URL}/equipments/groups/${g.id}/items`)))
    );

    const merged: EquipmentGroupWithItems[] = groups.map((group, idx) => ({
      group,
      items: itemsLists[idx]
    }));

    this.equipmentGroups.set(merged);
  }

  async getSkillSpecializationSuggestions(skillId: number): Promise<SkillSpecializationSuggestion[]> {
    const ok = await this.auth.ensureToken();
    if (!ok) return [];
    return await firstValueFrom(
      this.http.get<SkillSpecializationSuggestion[]>(`${API_BASE_URL}/skills/${skillId}/specializations`)
    );
  }
}
