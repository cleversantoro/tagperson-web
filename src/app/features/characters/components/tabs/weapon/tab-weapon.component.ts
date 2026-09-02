import { Component, Input, computed, inject, signal, OnInit, effect } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { CharacterSheet } from '../../../../../core/models/character.models';
import { RulesService } from '../../../../../core/services/rules.service';
import { CharacterStore } from '../../../../../core/services/character-store.service';
import { EquipmentRow } from '../../../../../core/models/equipment.models';

@Component({
  standalone: true,
  selector: 'app-tab-weapon',
  imports: [CommonModule, MatCardModule, MatFormFieldModule, MatSelectModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './tab-weapon.component.html',
  styleUrls: ['./tab-weapon.component.scss']
})
export class TabWeaponComponent implements OnInit {
  private readonly sheetSignal = signal<CharacterSheet | null>(null);
  @Input({ required: true }) set sheet(value: CharacterSheet) {
    this.sheetSignal.set(value);
  }

  get sheet(): CharacterSheet {
    return this.sheetSignal()!;
  }


  private rules = inject(RulesService);
  private store = inject(CharacterStore);

  // Sinais para rastrear IDs dos equipamentos atuais
  private currentArmorId = signal<number | null>(null);
  private currentHelmetId = signal<number | null>(null);
  private currentShieldId = signal<number | null>(null);

  // Sinais para editar armaduras/elmos/escudos
  private editingArmor = signal(false);

  private armorData = signal({
    armadura: '',
    elmo: '',
    escudo: '',
    armas: [] as EquipmentRow[],
    pertences: [] as EquipmentRow[]
  });

  // Sinais para editar arma
  addWeaponOpen = signal(false);
  selectedWeapon = signal('');
  selectedAccessory = signal(''); // Para adicionar pertences

  armaduras = computed(() => this.rules.equipments().filter(e => (e.isArmor ?? 0) === 1));
  elmos = computed(() => this.rules.equipments().filter(e => (e.isHelmet ?? 0) === 1));
  escudos = computed(() => this.rules.equipments().filter(e => (e.isShield ?? 0) === 1));
  armas = computed(() => this.rules.equipments().filter(e => (e.isWeapon ?? 0) === 1));
  pertences = computed(() => this.rules.equipments().filter(
    e => (e.isArmor ?? 0) !== 1
      && (e.isShield ?? 0) !== 1
      && (e.isHelmet ?? 0) !== 1
      && (e.isWeapon ?? 0) !== 1)
  );

  constructor() {
    // Efeito para reagir a mudanças no sheet
    effect(() => {
      if (this.sheetSignal()) {
        this.initializeArmorData();
        // Resetar modo de edição ao mudar de personagem
        this.editingArmor.set(false);
        this.addWeaponOpen.set(false);
      }
    });
  }

  ngOnInit() {
    this.initializeArmorData();
  }

  private initializeArmorData() {
    const armor = this.sheet.equipamentos.armadura;
    const helmet = this.sheet.equipamentos.capacete;
    const shield = this.sheet.equipamentos.escudo;

    // Encontrar IDs dos equipamentos atuais
    const armorItem = this.armaduras().find(a => a.name === armor.nome);
    const helmetItem = this.elmos().find(e => e.name === helmet.nome);
    const shieldItem = this.escudos().find(e => e.name === shield.nome);

    this.currentArmorId.set(armorItem?.id ?? null);
    this.currentHelmetId.set(helmetItem?.id ?? null);
    this.currentShieldId.set(shieldItem?.id ?? null);

    this.armorData.set({
      armadura: armor.nome || '',
      elmo: helmet.nome || '',
      escudo: shield.nome || '',
      armas: this.sheet.equipamentos.armas || [],
      pertences: this.sheet.equipamentos.pertences || []
    });
  }

  startEditingArmor() {
    this.editingArmor.set(true);
  }

  openAddWeapon() {
    this.selectedWeapon.set('');
    this.addWeaponOpen.set(true);
  }

  async saveArmor() {
    const data = this.armorData();

    // Processar Armadura
    await this.updateEquipment(
      'armor',
      this.currentArmorId(),
      data.armadura,
      this.armaduras()
    );

    // Processar Elmo
    await this.updateEquipment(
      'helmet',
      this.currentHelmetId(),
      data.elmo,
      this.elmos()
    );

    // Processar Escudo
    await this.updateEquipment(
      'shield',
      this.currentShieldId(),
      data.escudo,
      this.escudos()
    );

    this.editingArmor.set(false);
    // Recarregar dados
    await this.store.select(this.sheet.id);
  }

  private async updateEquipment(
    type: 'armor' | 'helmet' | 'shield',
    currentId: number | null,
    newName: string,
    equipmentList: any[]
  ) {
    const newItem = equipmentList.find(e => e.name === newName);
    const newId = newItem?.id ?? null;

    // Se removeu (newId é null e tinha algo)
    if (!newId && currentId) {
      await this.store.deleteEquipment(this.sheet.id, currentId);
      this.updateCurrentId(type, null);
      return;
    }

    // Se adicionou (newId existe e não tinha nada)
    if (newId && !currentId) {
      await this.store.addEquipment(this.sheet.id, newId, 1, true, this.slotFor(type));
      this.updateCurrentId(type, newId);
      return;
    }

    // Se mudou (newId diferente de currentId)
    if (newId && currentId && newId !== currentId) {
      if (!confirm('Substituir o equipamento atualmente usado neste slot?')) return;
      await this.store.addEquipment(this.sheet.id, newId, 1, true, this.slotFor(type));
      this.updateCurrentId(type, newId);
      return;
    }
  }

  private updateCurrentId(type: 'armor' | 'helmet' | 'shield', id: number | null) {
    if (type === 'armor') this.currentArmorId.set(id);
    if (type === 'helmet') this.currentHelmetId.set(id);
    if (type === 'shield') this.currentShieldId.set(id);
  }

  private slotFor(type: 'armor' | 'helmet' | 'shield') {
    return type === 'armor' ? 'armadura' : type === 'helmet' ? 'elmo' : 'escudo';
  }

  async saveWeapon() {
    if (!this.selectedWeapon()) return;

    const weapon = this.armas().find(w => w.name === this.selectedWeapon());
    if (weapon) {
      await this.store.addEquipment(this.sheet.id, weapon.id);
      this.addWeaponOpen.set(false);
    }
  }

  async deleteWeapon(itemId: number) {
    if (confirm('Tem certeza que deseja deletar esta arma?')) {
      await this.store.deleteEquipment(this.sheet.id, itemId);
    }
  }

  async deleteArmor() {
    if (confirm('Tem certeza que deseja remover a armadura?')) {
      if (this.currentArmorId()) {
        await this.store.deleteEquipment(this.sheet.id, this.currentArmorId()!);
        this.currentArmorId.set(null);
      }
      this.initializeArmorData();
    }
  }

  async deleteHelmet() {
    if (confirm('Tem certeza que deseja remover o elmo?')) {
      if (this.currentHelmetId()) {
        await this.store.deleteEquipment(this.sheet.id, this.currentHelmetId()!);
        this.currentHelmetId.set(null);
      }
      this.initializeArmorData();
    }
  }

  async deleteShield() {
    if (confirm('Tem certeza que deseja remover o escudo?')) {
      if (this.currentShieldId()) {
        await this.store.deleteEquipment(this.sheet.id, this.currentShieldId()!);
        this.currentShieldId.set(null);
      }
    }
  }

  cancelEditArmor() {
    this.initializeArmorData();
    this.editingArmor.set(false);
  }

  closeAddWeapon() {
    this.addWeaponOpen.set(false);
  }

  updateArmorField(field: 'armadura' | 'elmo' | 'escudo', value: string) {
    this.armorData.set({
      ...this.armorData(),
      [field]: value
    });
  }

  // Getters para template
  getEditingArmor() {
    return this.editingArmor();
  }

  getArmorData() {
    return this.armorData();
  }
}
