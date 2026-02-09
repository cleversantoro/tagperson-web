import { Component, Input, computed, inject, signal, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { CharacterSheet, Traits } from '../../../../../core/models/character.models';
import { CharacterStore } from '../../../../../core/services/character-store.service';
import { RulesService } from '../../../../../core/services/rules.service';
import { EquipmentRow } from '../../../../../core/models/equipment.models';

@Component({
  standalone: true,
  selector: 'app-tab-traits',
  imports: [CommonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatSelectModule],
  templateUrl: './tab-traits.component.html',
  styleUrls: ['./tab-traits.component.scss']
})
export class TabTraitsComponent implements OnInit {
  @Input({ required: true }) sheet!: CharacterSheet;

  // Expose parseInt to template
  readonly parseInt = parseInt;

  private selectedGroupId = signal<number | null>(null);
  private selectedEquipmentId = signal<number | null>(null);

  // Sinais para características físicas
  private editingPhysicalTraits = signal(false);
  private physicalTraits = signal({
    olhos: '',
    cabelo: '',
    pele: '',
    idade: 0,
    peso: 0,
    altura: 0
  });

  // Sinais para dinheiro
  private editingMoney = signal(false);
  private money = signal({
    cobre: 0,
    prata: 0,
    ouro: 0
  });

  // Sinais para aparência e história
  private editingAparencia = signal(false);
  private editingHistoria = signal(false);
  aparencia = signal('');
  historia = signal('');
  pertences = signal([] as Array<EquipmentRow>)

  private rules = inject(RulesService);
  private store = inject(CharacterStore);
  groups = this.rules.equipmentGroups;

  // Computed signals para controle de UI
  isEditingPhysicalTraits = computed(() => this.editingPhysicalTraits());
  isEditingMoney = computed(() => this.editingMoney());
  isEditingAparencia = computed(() => this.editingAparencia());
  isEditingHistoria = computed(() => this.editingHistoria());

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

  ngOnInit() {
    this.initializeEditingFields();
  }

  private initializeEditingFields() {
    this.physicalTraits.set({
      olhos: this.sheet.caracteristicas.olhos ?? '',
      cabelo: this.sheet.caracteristicas.cabelo ?? '',
      pele: this.sheet.caracteristicas.pele ?? '',
      idade: this.sheet.caracteristicas.idade ?? 0,
      peso: this.sheet.caracteristicas.peso ?? 0,
      altura: this.sheet.caracteristicas.altura ?? 0
    });

    this.money.set({
      cobre: this.sheet.dinheiro.cobre,
      prata: this.sheet.dinheiro.prata,
      ouro: this.sheet.dinheiro.ouro
    });

    this.pertences.set(this.sheet.equipamentos.pertences ?? []);

    this.aparencia.set(this.sheet.caracteristicas.aparencia ?? '');
    this.historia.set(this.sheet.caracteristicas.historia ?? '');
  }

  // Métodos para características físicas
  startEditingPhysicalTraits() {
    this.editingPhysicalTraits.set(true);
  }

  async savePhysicalTraits() {
    const traits = this.physicalTraits();
    await this.store.updateTraits(this.sheet.id, {
      olhos: traits.olhos,
      cabelo: traits.cabelo,
      pele: traits.pele,
      idade: traits.idade,
      peso: traits.peso,
      altura: traits.altura
    });
    this.editingPhysicalTraits.set(false);
  }

  cancelEditingPhysicalTraits() {
    this.initializeEditingFields();
    this.editingPhysicalTraits.set(false);
  }

  // Métodos para dinheiro
  startEditingMoney() {
    this.editingMoney.set(true);
  }

  async saveMoney() {
    const money = this.money();
    await this.store.updateMoney(this.sheet.id, {
      cobre: money.cobre,
      prata: money.prata,
      ouro: money.ouro
    });
    this.editingMoney.set(false);
  }

  cancelEditingMoney() {
    this.initializeEditingFields();
    this.editingMoney.set(false);
  }

  // Métodos para aparência
  startEditingAparencia() {
    this.editingAparencia.set(true);
  }

  async saveAparencia() {
    await this.store.updateTraits(this.sheet.id, {
      aparencia: this.aparencia()
    });
    this.editingAparencia.set(false);
  }

  cancelEditingAparencia() {
    this.initializeEditingFields();
    this.editingAparencia.set(false);
  }

  // Métodos para história
  startEditingHistoria() {
    this.editingHistoria.set(true);
  }

  async saveHistoria() {
    await this.store.updateTraits(this.sheet.id, {
      historia: this.historia()
    });
    this.editingHistoria.set(false);
  }

  cancelEditingHistoria() {
    this.initializeEditingFields();
    this.editingHistoria.set(false);
  }

  // Métodos auxiliares para acesso aos sinais
  getPhysicalTraits() {
    return this.physicalTraits();
  }

  getMoney() {
    return this.money();
  }

  getAparencia() {
    return this.aparencia();
  }

  getPertences() {
    return this.pertences();
  }

  getHistoria() {
    return this.historia();
  }

  // Métodos para atualizar sinais
  updatePhysicalTrait(field: string, value: any) {
    const traits = this.physicalTraits();
    this.physicalTraits.set({ ...traits, [field]: value });
  }

  updateMoney(field: string, value: any) {
    const money = this.money();
    this.money.set({ ...money, [field]: value });
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


