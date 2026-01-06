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
import { CharacterSheet, Traits } from '../../../../../core/models/character.models';
import { CharacterStore } from '../../../../../core/services/character-store.service';
import { RulesService } from '../../../../../core/services/rules.service';

import { CharacterizationService, CharacterizationType, CharacterizationGroup, CharacterizationItem } from '../../../../../core/services/characterization.service';

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
  private selectedEquipmentId = signal<number | null>(null);
  private selectedCharacterizationTypeId = signal<number | null>(null);
  private selectedCharacterizationGroupId = signal<number | null>(null);
  private selectedCharacterizationId = signal<number | null>(null);
  characterizationLevel = signal<number | null>(null);

  private rules = inject(RulesService);
  private characterizationService = inject(CharacterizationService);

  groups = this.rules.equipmentGroups;

  characterizationTypes = signal<CharacterizationType[]>([]);
  characterizationGroups = signal<CharacterizationGroup[]>([]);
  characterizationItems = signal<CharacterizationItem[]>([]);
  isLoadingCharacterizations = signal(false);
  isSavingCharacterization = signal(false);

  displayedColumns: string[] = ['nome', 'nivel'];

  items = computed(() => {
    const groupId = this.selectedGroupId();
    if (!groupId) return [];
    const group = this.groups().find(g => g.group.id === groupId);
    return group?.items ?? [];
  });

  private equipmentMap = computed(() => {
    const map = new Map<number, { description?: string | null; value?: number | null }>();
    for (const g of this.groups()) {
      for (const item of g.items) {
        map.set(item.id, { description: item.description, value: item.value });
      }
    }
    return map;
  });

  constructor(private store: CharacterStore) {
    this.loadCharacterizationTypes();
  }

  private async loadCharacterizationTypes() {
    try {
      const types = await this.characterizationService.getTypes();
      this.characterizationTypes.set(types);
    } catch (error) {
      console.error('Erro ao carregar tipos de caracterização:', error);
    }
  }

  async selectCharacterizationType(typeId: number | null) {
    this.selectedCharacterizationTypeId.set(typeId);
    this.selectedCharacterizationGroupId.set(null);
    this.selectedCharacterizationId.set(null);
    this.characterizationGroups.set([]);
    this.characterizationItems.set([]);

    if (!typeId) return;

    try {
      this.isLoadingCharacterizations.set(true);
      const groups = await this.characterizationService.getGroups(typeId);
      this.characterizationGroups.set(groups);
    } catch (error) {
      console.error('Erro ao carregar grupos de caracterização:', error);
    } finally {
      this.isLoadingCharacterizations.set(false);
    }
  }

  async selectCharacterizationGroup(groupId: number | null) {
    this.selectedCharacterizationGroupId.set(groupId);
    this.selectedCharacterizationId.set(null);
    this.characterizationItems.set([]);

    if (!groupId) return;

    const typeId = this.selectedCharacterizationTypeId();
    if (!typeId) return;

    try {
      this.isLoadingCharacterizations.set(true);
      const items = await this.characterizationService.getCharacterizations(typeId, groupId);
      this.characterizationItems.set(items);
    } catch (error) {
      console.error('Erro ao carregar itens de caracterização:', error);
    } finally {
      this.isLoadingCharacterizations.set(false);
    }
  }

  selectCharacterizationItem(itemId: number | null) {
    this.selectedCharacterizationId.set(itemId);
  }

  async saveCharacterization() {
    const characterizationId = this.selectedCharacterizationId();
    if (!characterizationId) return;

    try {
      this.isSavingCharacterization.set(true);
      const level = this.characterizationLevel() ?? undefined;
      await this.store.addCharacterization(this.sheet.id, characterizationId, level);

      // Reset form
      this.selectedCharacterizationTypeId.set(null);
      this.selectedCharacterizationGroupId.set(null);
      this.selectedCharacterizationId.set(null);
      this.characterizationLevel.set(null);
      this.characterizationGroups.set([]);
      this.characterizationItems.set([]);
    } catch (error) {
      console.error('Erro ao salvar caracterização:', error);
    } finally {
      this.isSavingCharacterization.set(false);
    }
  }

  updateText(field: 'aparencia' | 'historia', value: string) {
    this.updateTraits({ [field]: value } as Partial<Traits>);
  }

  selectGroup(groupId: number | null) {
    this.selectedGroupId.set(groupId);
    const first = this.items()[0];
    this.selectedEquipmentId.set(first?.id ?? null);
  }

  selectEquipment(equipmentId: number | null) {
    this.selectedEquipmentId.set(equipmentId);
  }

  async addEquipment() {
    const equipmentId = this.selectedEquipmentId();
    if (!equipmentId) return;
    await this.store.addEquipment(this.sheet.id, equipmentId, 1);
  }

  equipmentDescription(equipmentId: number) {
    return this.equipmentMap().get(equipmentId)?.description ?? '';
  }

  equipmentValue(equipmentId: number) {
    const value = this.equipmentMap().get(equipmentId)?.value;
    return value ? `${value} m.o.` : '';
  }

  private updateTraits(update: Partial<Traits>) {
    this.store.upsert({
      ...this.sheet,
      caracteristicas: { ...this.sheet.caracteristicas, ...update },
      updatedAt: new Date().toISOString()
    });
  }
}


