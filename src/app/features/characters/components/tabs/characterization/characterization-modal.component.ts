import { Component, Inject, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { CharacterStore } from '../../../../../core/services/character-store.service';
import { CharacterizationService } from '../../../../../core/services/characterization.service';
import { CharacterizationGroup, CharacterizationItem, CharacterizationType } from '../../../../../core/models/characterization.models';


export interface CharacterizationFormData {
  characterizationTypeId: number | null;
  characterizationGroupId: number | null;
  characterizationItemId: number | null;
  characterizationLevel: number | null;
}

@Component({
  selector: 'app-characterization-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule
],
  templateUrl: './characterization-modal.component.html',
})
export class CharacterizationModalComponent {
  formData: CharacterizationFormData = {
    characterizationTypeId: null,
    characterizationGroupId: null,
    characterizationItemId: null,
    characterizationLevel: null,
  };

  private selectedCharacterizationTypeId = signal<number | null>(null);
  private selectedCharacterizationGroupId = signal<number | null>(null);
  private selectedCharacterizationId = signal<number | null>(null);
  private characterizationService = inject(CharacterizationService);

  characterizationTypes = signal<CharacterizationType[]>([]);
  characterizationGroups = signal<CharacterizationGroup[]>([]);
  characterizationItems = signal<CharacterizationItem[]>([]);
  isLoadingCharacterizations = signal(false);
  isSavingCharacterization = signal(false);
  characterizationLevel = signal<number | null>(null);
  characterId = signal<number | null>(null);


  constructor(
    public dialogRef: MatDialogRef<CharacterizationModalComponent>,
    private store: CharacterStore,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.characterizationTypes.set(data.types || []);
    this.characterizationGroups.set(data.groups || []);
    this.characterizationItems.set(data.items || []);
    this.characterId.set(data.characterId || null);
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

  isFormValid(): boolean {
    return (
      this.formData.characterizationTypeId !== null &&
      this.formData.characterizationGroupId !== null &&
      this.formData.characterizationItemId !== null &&
      this.formData.characterizationLevel !== null
    );
  }

  onSave(): void {
    if (this.isFormValid()) {
      this.dialogRef.close(this.formData);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
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

  async saveCharacterization(result?: { characterizationId: number; level?: number }) {
    const characterizationId = result?.characterizationId ?? this.selectedCharacterizationId();
    if (!characterizationId) return;

    const characterId = this.characterId();
    if (!characterId) return;

    try {
      this.isSavingCharacterization.set(true);
      const level = result?.level ?? this.characterizationLevel() ?? undefined;
      await this.store.addCharacterization(characterId, characterizationId, level);

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
}
