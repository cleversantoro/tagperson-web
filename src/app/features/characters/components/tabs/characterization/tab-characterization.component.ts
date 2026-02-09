import { Component, Input, computed, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { FormsModule } from '@angular/forms';
import { CharacterSheet  } from '../../../../../core/models/character.models';
import { RulesService } from '../../../../../core/services/rules.service';

import { MatDialog } from '@angular/material/dialog';
import { CharacterizationModalComponent } from './characterization-modal.component';
import { CharacterizationDetailsModalComponent } from './characterization-details-modal.component';
import { CharacterizationGroup, CharacterizationItem, CharacterizationType } from '../../../../../core/models/characterization.models';


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
    FormsModule
  ],
  templateUrl: './tab-characterization.component.html',
  styleUrls: ['./tab-characterization.component.scss']
})
export class TabCharacterizationComponent {
  @Input({ required: true }) sheet!: CharacterSheet;

  private selectedGroupId = signal<number | null>(null);
  private rules = inject(RulesService);

  groups = this.rules.equipmentGroups;

  characterizationTypes = signal<CharacterizationType[]>([]);
  characterizationGroups = signal<CharacterizationGroup[]>([]);
  characterizationItems = signal<CharacterizationItem[]>([]);
  isLoadingCharacterizations = signal(false);
  isSavingCharacterization = signal(false);

  displayedColumns: string[] = ['nome', 'nivel', 'info'];

  items = computed(() => {
    const groupId = this.selectedGroupId();
    if (!groupId) return [];
    const group = this.groups().find(g => g.group.id === groupId);
    return group?.items ?? [];
  });

  constructor(private dialog: MatDialog,) { }

  openCharacterizationModal(): void {
    const dialogRef = this.dialog.open(CharacterizationModalComponent, {
      width: '800px',
      data: {
        types: this.characterizationTypes(),
        groups: this.characterizationGroups(),
        items: this.characterizationItems(),
        characterId: this.sheet.id
      },
    });
  }

  openDetailsModal(element: any): void {
    this.dialog.open(CharacterizationDetailsModalComponent, {
      width: '800px',
      data: {
        description: element.descricao,
        notes: element.obs,
      },
    });
  }

}


