import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { CharacterHeaderComponent } from '../components/character-header/character-header.component';
import { TabAttributesComponent } from '../components/tabs/attributes/tab-attributes.component';
import { TabSkillsComponent } from '../components/tabs/skills/tab-skills.component';
import { TabCombatComponent } from '../components/tabs/combat/tab-combat.component';
import { TabWeaponComponent } from '../components/tabs/weapon/tab-weapon.component';
import { TabSpellsComponent } from '../components/tabs/spells/tab-spells.component';
import { TabTraitsComponent } from '../components/tabs/traits/tab-traits.component';
import { CharacterStore } from '../../../core/services/character-store.service';

@Component({
  standalone: true,
  selector: 'app-character-page',
  imports: [
    MatTabsModule, MatCardModule,
    CharacterHeaderComponent,
    TabAttributesComponent,
    TabSkillsComponent,
    TabCombatComponent,
    TabWeaponComponent,
    TabSpellsComponent,
    TabTraitsComponent
  ],
  templateUrl: './character-page.component.html',
  styleUrl: './character-page.component.scss'
})
export class CharacterPageComponent {
  constructor(public store: CharacterStore) {}
}
