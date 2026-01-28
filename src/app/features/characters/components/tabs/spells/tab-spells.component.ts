import { Component, Input, computed, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { CharacterSheet, SpellRow } from '../../../../../core/models/character.models';
import { RulesService } from '../../../../../core/services/rules.service';
import { SpellFromGroup, SpellTechniquesDto } from '../../../../../core/models/spells.models';
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
  private selectedSpell = signal<SpellRow | null>(null);

  groups = this.rules.spellGroups;

  private spellMap = computed(() => {
    const sheet = this.sheetSignal();
    const map = new Map<number, number>();
    if (!sheet) return map;
    for (const s of sheet.magias.magiasProfissao ?? []) {
      map.set(s.id, s.nivel ?? 0);
    }
    for (const s of sheet.magias.magiasEspecializacao ?? []) {
      map.set(s.id, s.nivel ?? 0);
    }
    return map;
  });

  basicas = computed(() => {
    const profission = this.sheetSignal()?.magias.magiasProfissao ?? [];
    const basics = profission;
    const rt = basics.flatMap(g => g).filter(s => s.tipo === 1);
    return rt;
  });

  especializacao = computed(() => {
    const sheet = this.sheetSignal();
    if (!this.canLearnSpecializationSpells() || !sheet) {
      return [];
    }
    const profission = this.sheetSignal()?.magias.magiasEspecializacao ?? [];
    const basics = profission;
    const rt = basics.flatMap(g => g).filter(s => s.tipo === 2);
    return rt;
  });

  levelOf(id: number) {
    return this.spellMap().get(id) ?? 0;
  }

  totalOf(spell: SpellRow) {
    const level = this.levelOf(spell.id);
    const cost = spell.custo ?? 0;
    return level * cost;
  }

  selectSpell(spell: SpellRow) {
    this.selectedSpell.set(spell);
  }

  selected() {
    return this.selectedSpell();
  }

  effectsText() {
    const effects = this.selectedSpell()?.efeitos ?? '';
    return effects ? effects.replaceAll('|', '\n') : '';
  }

  /**
   * Verifica se o personagem pode aprender magias de especialização
   * Requisitos:
   * 1. Nível >= 5
   * 2. Especialização cadastrada
   */
  canLearnSpecializationSpells(): boolean {
    const sheet = this.sheetSignal();
    return !!sheet && (sheet.nivel ?? 0) >= 5; //&& this.sheet.especializacao?.magiaGrupoId > 0;
  }

  addBasicSpell() {
    // Abre o diálogo passando o ID da profissão e do personagem
    const dialogRef = this.dialog.open(SpellSelectionDialogComponent, {
      data: {
        professionId: this.sheet.profissaoId,
        especializationId: this.sheet.especializacao?.id,
        spellGroupId: this.sheet.especializacao?.magiaGrupoId,
        characterId: this.sheet.id,
        title: 'Adicionar Magia da Profissão',
        type: 1
      },
      width: '600px'
    });

    // Se salvou com sucesso (retornou true), recarrega o personagem
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.select(this.sheet.id);
      }
    });
  }

  /**
   * Abre diálogo para adicionar magia de especialização
   */
  addSpecializationSpell() {
    if (!this.canLearnSpecializationSpells()) {
      return;
    }
    this.dialog.open(SpellSelectionDialogComponent, {
      data: {
        professionId: this.sheet.profissaoId,
        especializationId: this.sheet.especializacao?.id,
        spellGroupId: this.sheet.especializacao?.magiaGrupoId,
        type: 2,
        characterId: this.sheet.id,
        title: 'Adicionar Magia de Especialização'
      },
      width: '600px'
    }).afterClosed().subscribe(async (spell: SpellFromGroup | undefined) => {
      if (spell) {
        await this.addSpell(spell.id);
        this.store.select(this.sheet.id);
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
