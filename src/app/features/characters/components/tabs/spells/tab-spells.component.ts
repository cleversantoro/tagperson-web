import { Component, Input, computed, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CharacterSheet } from '../../../../../core/models/character.models';
import { RulesService } from '../../../../../core/services/rules.service';
import { SpellFromGroup, SpellGroupWithSpells } from '../../../../../core/models/spells.models';

@Component({
  standalone: true,
  selector: 'app-tab-spells',
  imports: [MatCardModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './tab-spells.component.html',
  styleUrls: ['./tab-spells.component.scss']
})
export class TabSpellsComponent {
  @Input({ required: true }) sheet!: CharacterSheet;

  private rules = inject(RulesService);
  private selectedSpell = signal<SpellFromGroup | null>(null);

  groups = this.rules.spellGroups;

  private spellMap = computed(() => {
    const map = new Map<number, number>();
    for (const s of this.sheet.magias ?? []) {
      map.set(s.id, s.nivel ?? 0);
    }
    return map;
  });

  private characterSpellIds = computed(() => {
    const ids = new Set<number>();
    for (const s of this.sheet.magias ?? []) {
      ids.add(s.id);
    }
    return ids;
  });

  basicas = computed(() => this.filterByName(this.groups(), 'bas'));
  especializacao = computed(() => this.filterByName(this.groups(), 'esp'));

  levelOf(id: number) {
    return this.spellMap().get(id) ?? 0;
  }

  totalOf(spell: SpellFromGroup) {
    const level = this.levelOf(spell.id);
    const cost = spell.cost ?? 0;
    return level * cost;
  }

  selectSpell(spell: SpellFromGroup) {
    this.selectedSpell.set(spell);
  }

  selected() {
    return this.selectedSpell();
  }

  effectsText() {
    const effects = this.selectedSpell()?.effects ?? '';
    return effects ? effects.replaceAll('|', '\n') : '';
  }

  private filterByName(groups: SpellGroupWithSpells[], hint: string) {
    const lowered = hint.toLowerCase();
    const characterIds = this.characterSpellIds();

    const list = groups.filter(g => g.group.name.toLowerCase().includes(lowered));

    if (list.length > 0) {
      return list.flatMap(g => g.spells).filter(s => characterIds.has(s.id));
    }

    return groups.flatMap(g => g.spells).filter(s => characterIds.has(s.id));
  }

  private filterParentId(parentId: number) {
    const groups = this.groups() ?? [];
    const characterIds = this.characterSpellIds();

    const list = groups.filter(g => g.group.parentId === parentId);

    if (list.length > 0) {
      return list.flatMap(g => g.spells).filter(s => characterIds.has(s.id));
    }

    return groups
    .filter(g => g.group.parentId === parentId)
    .flatMap(g => g.spells)
    .filter(s => characterIds.has(s.id));

  }
}


