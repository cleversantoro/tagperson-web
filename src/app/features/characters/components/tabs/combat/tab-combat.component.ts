import { Component, Input, computed, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CharacterSheet } from '../../../../../core/models/character.models';
import { RulesService } from '../../../../../core/services/rules.service';
import { CombatFromGroup, CombatGroupWithItems } from '../../../../../core/models/combat.models';
import { CharacterStore } from '../../../../../core/services/character-store.service';

@Component({
  standalone: true,
  selector: 'app-tab-combat',
  imports: [MatCardModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './tab-combat.component.html',
  styleUrls: ['./tab-combat.component.scss']
})
export class TabCombatComponent {
  @Input({ required: true }) sheet!: CharacterSheet;

  private rules = inject(RulesService);
  private store = inject(CharacterStore);
  groups = this.rules.combatGroups;

  armaduras = computed(() => this.rules.equipments().filter(e => (e.isArmor ?? 0) === 1));
  elmos = computed(() => this.rules.equipments().filter(e => (e.isHelmet ?? 0) === 1));
  escudos = computed(() => this.rules.equipments().filter(e => (e.isShield ?? 0) === 1));
  armas = computed(() => this.rules.equipments().filter(e => (e.isWeapon ?? 0) === 1));

  private techMap = computed(() => {
    const map = new Map<number, number>();
    for (const t of this.sheet.combate.tecnicas ?? []) {
      map.set(t.id, t.nivel ?? 0);
    }
    return map;
  });

  basicas = computed(() => this.filterByName(this.groups(), 'básicas'));
  //basicas = computed(() => this.filterById(this.groups(), -1));
  especializacao = computed(() => this.filterByName(this.groups(), 'avançadas'));
  //especializacao = computed(() => this.filterById(this.groups(), -1));
  restritas = computed(() => this.filterByName(this.groups(), 'restritas'));
  //restritas = computed(() => this.filterById(this.groups(), -1));

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

  setGear(field: 'armadura' | 'elmo' | 'escudo' | 'arma', value: string) {
    this.store.upsert({
      ...this.sheet,
      combate: { ...this.sheet.combate, [field]: value },
      updatedAt: new Date().toISOString()
    });
  }

  private filterByName(groups: CombatGroupWithItems[], hint: string) {
    const lowered = hint.toLowerCase();
    const list = groups.filter(g => g.group.name.toLowerCase().includes(lowered));
    if (list.length > 0) return list.flatMap(g => g.items);
    return groups.flatMap(g => g.items);
  }

  private filterById(groups: CombatGroupWithItems[], id: number) {
    //const lowered = hint.toLowerCase();
    const list = groups.filter(g => g.group.parentId === id);
    if (list.length > 0) return list.flatMap(g => g.items);
    return groups.flatMap(g => g.items);
  }

}


