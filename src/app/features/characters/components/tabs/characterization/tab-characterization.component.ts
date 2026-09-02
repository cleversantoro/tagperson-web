import { Component, Input, computed, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FormsModule } from '@angular/forms';
import { CharacterSheet  } from '../../../../../core/models/character.models';
import { RulesService } from '../../../../../core/services/rules.service';

import { MatDialog } from '@angular/material/dialog';
import { CharacterizationModalComponent } from './characterization-modal.component';
import { CharacterizationGroup, CharacterizationItem, CharacterizationType } from '../../../../../core/models/characterization.models';
import { CharacterStore } from '../../../../../core/services/character-store.service';


@Component({
  standalone: true,
  selector: 'app-tab-characterization',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatTooltipModule,
    FormsModule
  ],
  templateUrl: './tab-characterization.component.html',
  styleUrls: ['./tab-characterization.component.scss']
})
export class TabCharacterizationComponent {
  @Input({ required: true }) sheet!: CharacterSheet;

  private selectedGroupId = signal<number | null>(null);
  private rules = inject(RulesService);
  private store = inject(CharacterStore);
  private selectedCharacterization = signal<any | null>(null);

  groups = this.rules.equipmentGroups;

  characterizationTypes = signal<CharacterizationType[]>([]);
  characterizationGroups = signal<CharacterizationGroup[]>([]);
  characterizationItems = signal<CharacterizationItem[]>([]);
  isLoadingCharacterizations = signal(false);
  isSavingCharacterization = signal(false);

  displayedColumns: string[] = ['nome', 'nivel', 'acoes'];

  items = computed(() => {
    const groupId = this.selectedGroupId();
    if (!groupId) return [];
    const group = this.groups().find(g => g.group.id === groupId);
    return group?.items ?? [];
  });

  constructor(private dialog: MatDialog,) { }

  openCharacterizationModal(): void {
    const dialogRef = this.dialog.open(CharacterizationModalComponent, {
      width: '1000px',
      data: {
        types: this.characterizationTypes(),
        groups: this.characterizationGroups(),
        items: this.characterizationItems(),
        characterId: this.sheet.id
      },
    });
  }

  selectCharacterization(element: any): void {
    this.selectedCharacterization.set(element);
  }

  selected() {
    return this.selectedCharacterization();
  }

  /**
   * Deleta uma caracterização do personagem
   */
  async deleteCharacterization(characterizationId: number) {
    if (confirm(`Tem certeza que deseja deletar?`)) {
      // await this.combatApi.deleteCombat(
      //   this.sheet.id,
      //   combat.id,
      //   combat.grupoCombateId ?? 0
      // );
      try {
        await this.store.deleteCharacterization(this.sheet.id, characterizationId);
        this.selectedCharacterization.set(null);
      } catch (error) {
        console.error('Erro ao deletar caracterização:', error);
      }

      //this.store.select(this.sheet.id);
    }
  }

}


