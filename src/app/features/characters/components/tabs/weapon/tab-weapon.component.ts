import { Component, Input, computed, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CharacterSheet } from '../../../../../core/models/character.models';
import { RulesService } from '../../../../../core/services/rules.service';
import { CharacterStore } from '../../../../../core/services/character-store.service';

@Component({
  standalone: true,
  selector: 'app-tab-weapon',
  imports: [MatCardModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './tab-weapon.component.html',
  styleUrls: ['./tab-weapon.component.scss']
})
export class TabWeaponComponent {
  @Input({ required: true }) sheet!: CharacterSheet;

  private rules = inject(RulesService);
  private store = inject(CharacterStore);

  armaduras = computed(() => this.rules.equipments().filter(e => (e.isArmor ?? 0) === 1));
  elmos = computed(() => this.rules.equipments().filter(e => (e.isHelmet ?? 0) === 1));
  escudos = computed(() => this.rules.equipments().filter(e => (e.isShield ?? 0) === 1));
  armas = computed(() => this.rules.equipments().filter(e => (e.isWeapon ?? 0) === 1));

  setGear(field: 'armadura' | 'elmo' | 'escudo' | 'arma', value: string) {
    this.store.upsert({
      ...this.sheet,
      combate: { ...this.sheet.combate, [field]: value },
      updatedAt: new Date().toISOString()
    });
  }
}
