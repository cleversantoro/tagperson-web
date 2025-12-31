import { Component, Input, computed, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CharacterSheet } from '../../../../../core/models/character.models';
import { RulesService } from '../../../../../core/services/rules.service';
import { CombatFromGroup } from '../../../../../core/models/combat.models';
import { CharacterStore } from '../../../../../core/services/character-store.service';

@Component({
  standalone: true,
  selector: 'app-tab-combat',
  imports: [MatCardModule],
  templateUrl: './tab-combat.component.html',
  styleUrls: ['./tab-combat.component.scss']
})
export class TabCombatComponent {
  @Input({ required: true }) sheet!: CharacterSheet;

  private rules = inject(RulesService);
  private store = inject(CharacterStore);
  groups = this.rules.combatGroups;

  private techMap = computed(() => {
    const map = new Map<number, number>();
    for (const t of this.sheet.combate.tecnicas ?? []) {
      map.set(t.id, t.nivel ?? 0);
    }
    return map;
  });

  private ownedTechIds = computed(() => new Set((this.sheet.combate.tecnicas ?? []).map(t => t.id)));

  basicas = computed(() => this.filterOwned(this.byGroupId(1)));
  especializacao = computed(() =>
    this.filterOwned(this.byGroupName(3, this.sheet.especializacao ?? ''))
  );
  restritas = computed(() =>
    this.filterOwned(this.byGroupName(2, this.sheet.profissao ?? ''))
  );

  addCombatOpen = signal(false);
  selectedCombatId = signal<number | null>(null);
  newCombatLevel = signal(0);

  availableBasicTechniques = computed(() => {
    const basics = this.byGroupId(1);
    const owned = this.ownedTechIds();
    return basics
      .filter(t => !owned.has(t.id))
      .sort((a, b) => a.name.localeCompare(b.name));
  });

  levelOf(id: number) {
    return this.techMap().get(id) ?? 0;
  }

  totalOf(item: CombatFromGroup) {
    const level = this.levelOf(item.id);
    const bonus = item.bonus ?? 0;
    return level + bonus;
  }

  categoryName(categoryId?: number | null) {
    const cat = this.rules.categories().find(c => c.id === categoryId);
    return cat?.name ?? '-';
  }

  openAddCombat() {
    const list = this.availableBasicTechniques();
    this.selectedCombatId.set(list[0]?.id ?? null);
    this.newCombatLevel.set(0);
    this.addCombatOpen.set(true);
  }

  closeAddCombat() {
    this.addCombatOpen.set(false);
  }

  async saveCombat() {
    const combatSkillId = this.selectedCombatId();
    if (!combatSkillId) return;
    await this.store.addCombatSkill(this.sheet.id, combatSkillId, this.newCombatLevel());
    this.addCombatOpen.set(false);
  }

  private filterOwned(items: CombatFromGroup[]) {
    const owned = this.ownedTechIds();
    return items.filter(i => owned.has(i.id));
  }

  private byGroupId(groupId: number) {
    const group = (this.groups() ?? []).find(g => g.group.id === groupId);
    return group?.items ?? [];
  }

  private byGroupName(parentId: number, name: string) {
    const groups = this.groups() ?? [];
    const target = this.normalizeName(name);
    if (!target) return [];
    const match = groups.find(g =>
      g.group.parentId === parentId && this.normalizeName(g.group.name).includes(target)
    );
    return match?.items ?? [];
  }

  private normalizeName(value: string) {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }
}
