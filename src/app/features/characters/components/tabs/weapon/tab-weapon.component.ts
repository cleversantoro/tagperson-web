import { Component, Input, computed, inject, signal, OnInit, effect } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { CharacterSheet, EquipmentRow } from '../../../../../core/models/character.models';
import { RulesService } from '../../../../../core/services/rules.service';
import { CharacterStore } from '../../../../../core/services/character-store.service';

@Component({
  standalone: true,
  selector: 'app-tab-weapon',
  imports: [CommonModule, MatCardModule, MatFormFieldModule, MatSelectModule, MatButtonModule, MatIconModule],
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

  // Sinais para editar armaduras/elmos/escudos
  private editingArmor = signal(false);
  private armorData = signal({
    armadura: '' ,
    elmo: '',
    escudo: '',
    armas: [] as EquipmentRow[],
    pertences: [] as EquipmentRow[]
  });

  // Sinais para editar arma
  addWeaponOpen = signal(false);
  selectedWeapon = signal('');

  armaduras = computed(() => this.rules.equipments().filter(e => (e.isArmor ?? 0) === 1));
  elmos = computed(() => this.rules.equipments().filter(e => (e.isHelmet ?? 0) === 1));
  escudos = computed(() => this.rules.equipments().filter(e => (e.isShield ?? 0) === 1));
  armas = computed(() => this.rules.equipments().filter(e => (e.isWeapon ?? 0) === 1));

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
    this.armorData.set({
      armadura: this.sheet.equipamentos.armadura.nome || '',
      elmo: this.sheet.equipamentos.capacete.nome || '',
      escudo: this.sheet.equipamentos.escudo.nome || '',
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
    await this.store.updateGear(this.sheet.id, {
      armadura: data.armadura,
      elmo: data.elmo,
      escudo: data.escudo,
    });
    this.editingArmor.set(false);
  }

  async saveWeapon() {
    await this.store.updateGear(this.sheet.id, {
      arma: this.selectedWeapon()
    });
    this.addWeaponOpen.set(false);
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
