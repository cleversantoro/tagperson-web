import { Component, Input, computed, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { CharacterSheet, Traits } from '../../../../../core/models/character.models';
import { CharacterStore } from '../../../../../core/services/character-store.service';
import { RulesService } from '../../../../../core/services/rules.service';

@Component({
  standalone: true,
  selector: 'app-tab-traits',
  imports: [MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatSelectModule],
  templateUrl: './tab-traits.component.html',
  styleUrls: ['./tab-traits.component.scss']
})
export class TabTraitsComponent {
  @Input({ required: true }) sheet!: CharacterSheet;

  private selectedGroupId = signal<number | null>(null);
  private selectedEquipmentId = signal<number | null>(null);

  private rules = inject(RulesService);
  groups = this.rules.equipmentGroups;

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

  constructor(private store: CharacterStore) {}

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


