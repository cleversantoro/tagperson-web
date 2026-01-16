import { Component, Input, computed, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { CharacterSheet } from '../../../../../core/models/character.models';
import { RulesService } from '../../../../../core/services/rules.service';
import { SpellFromGroup, SpellGroupWithSpells } from '../../../../../core/models/spells.models';
import { CharacterStore } from '../../../../../core/services/character-store.service';
import { SpellSelectionDialogComponent } from './spell-selection-dialog.component';

@Component({
  standalone: true,
  selector: 'app-tab-spells',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule
  ],
  templateUrl: './tab-spells.component.html',
  styleUrls: ['./tab-spells.component.scss']
})
export class TabSpellsComponent {
  private readonly sheetSignal = signal<CharacterSheet | null>(null);
  @Input({ required: true }) set sheet(value: CharacterSheet) {
    this.sheetSignal.set(value);
  }

  get sheet(): CharacterSheet {
    return this.sheetSignal()!;
  }

  private rules = inject(RulesService);
  private dialog = inject(MatDialog);
  private store = inject(CharacterStore);
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

  // Calcula magias básicas (grupos com parentId = null ou -1)
  basicas = computed(() => {
    const all = this.groups() ?? [];
    const characterIds = this.characterSpellIds();
    const basicGroups = all.filter(g => !g.group.parentId || g.group.parentId === -1);
    return basicGroups.flatMap(g => g.spells).filter(s => characterIds.has(s.id));
  });

  // Calcula magias de especialização (apenas se personagem tem especialização e nível >= 5)
  especializacao = computed(() => {
    const all = this.groups() ?? [];
    const characterIds = this.characterSpellIds();

    // Verifica se pode ter magias de especialização
    if (!this.canLearnSpecializationSpells()) {
      return [];
    }

    const specializationGroups = all.filter(
      g => g.group.parentId && g.group.parentId !== -1 && g.group.id === this.sheet.especializacao?.magiaGrupoId
    );

    return specializationGroups.flatMap(g => g.spells).filter(s => characterIds.has(s.id));
  });

  // Magias disponíveis para adicionar (básicas)
  availableBasicSpells = computed(() => {
    const all = this.groups() ?? [];
    const characterIds = this.characterSpellIds();
    const basicGroups = all.filter(g => !g.group.parentId || g.group.parentId === -1);
    const allBasic = basicGroups.flatMap(g => g.spells);
    return allBasic.filter(s => !characterIds.has(s.id));
  });

  // Magias disponíveis para adicionar (especialização)
  availableSpecializationSpells = computed(() => {
    if (!this.canLearnSpecializationSpells()) {
      return [];
    }
    const all = this.groups() ?? [];
    const characterIds = this.characterSpellIds();
    const specializationGroups = all.filter(g => g.group.parentId && g.group.parentId !== -1 && g.group.id === this.sheet.especializacao?.magiaGrupoId);
    const allSpecialization = specializationGroups.flatMap(g => g.spells);
    return allSpecialization.filter(s => !characterIds.has(s.id));
  });

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

  /**
   * Verifica se o personagem pode aprender magias de especialização
   * Requisitos:
   * 1. Nível >= 5
   * 2. Especialização cadastrada
   */
  canLearnSpecializationSpells(): boolean {
    return (this.sheet.nivel ?? 0) >= 5 && !!this.sheet.especializacao;
  }

  /**
   * Abre diálogo para adicionar magia básica
   */
  addBasicSpell() {
    const spells = this.availableBasicSpells();
    if (spells.length === 0) {
      return; // Nenhuma magia disponível
    }

    this.dialog.open(SpellSelectionDialogComponent, {
      data: {
        spells,
        title: 'Adicionar Magia Básica'
      },
      width: '600px'
    }).afterClosed().subscribe(async (spell: SpellFromGroup | undefined) => {
      if (spell) {
        await this.addSpell(spell.id);
      }
    });
  }

  /**
   * Abre diálogo para adicionar magia de especialização
   */
  addSpecializationSpell() {
    if (!this.canLearnSpecializationSpells()) {
      return; // Não pode adicionar
    }

    const spells = this.availableSpecializationSpells();
    if (spells.length === 0) {
      return; // Nenhuma magia disponível
    }

    this.dialog.open(SpellSelectionDialogComponent, {
      data: {
        spells,
        title: 'Adicionar Magia de Especialização'
      },
      width: '600px'
    }).afterClosed().subscribe(async (spell: SpellFromGroup | undefined) => {
      if (spell) {
        await this.addSpell(spell.id);
      }
    });
  }

  /**
   * Adiciona uma magia ao personagem
   */
  private async addSpell(spellId: number) {
    try {
      await this.store.addSpell(this.sheet.id, spellId);
    } catch (error) {
      console.error('Erro ao adicionar magia:', error);
    }
  }
}


