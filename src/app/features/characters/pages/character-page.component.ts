import { Component, signal } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CharacterHeaderComponent } from '../components/character-header/character-header.component';
import { TabAttributesComponent } from '../components/tabs/attributes/tab-attributes.component';
import { TabSkillsComponent } from '../components/tabs/skills/tab-skills.component';
import { TabCombatComponent } from '../components/tabs/combat/tab-combat.component';
import { TabWeaponComponent } from '../components/tabs/weapon/tab-weapon.component';
import { TabSpellsComponent } from '../components/tabs/spells/tab-spells.component';
import { TabTraitsComponent } from '../components/tabs/traits/tab-traits.component';
import { TabCharacterizationComponent } from "../components/tabs/characterization/tab-characterization.component";
import { CharacterStore } from '../../../core/services/character-store.service';

@Component({
  standalone: true,
  selector: 'app-character-page',
  imports: [
    MatTabsModule, MatCardModule,
    MatButtonModule, MatIconModule,
    CharacterHeaderComponent,
    TabAttributesComponent,
    TabSkillsComponent,
    TabCombatComponent,
    TabWeaponComponent,
    TabSpellsComponent,
    TabTraitsComponent,
    TabCharacterizationComponent
],
  templateUrl: './character-page.component.html',
  styleUrl: './character-page.component.scss'
})
export class CharacterPageComponent {
  constructor(public store: CharacterStore) {}

  exporting = signal(false);
  exportError = signal('');

  async exportPdf(characterId: number) {
    this.exporting.set(true);
    this.exportError.set('');
    try {
      await this.store.exportPdf(characterId);
    } catch {
      this.exportError.set('Não foi possível exportar a ficha em PDF.');
    } finally {
      this.exporting.set(false);
    }
  }

  canAccessSpellsTab(profession: string | undefined): boolean {
    if (!profession) return true;
    const professionLower = profession.toLowerCase();
    return professionLower !== 'guerreiro' && professionLower !== 'ladino' && professionLower !== 'ladrão';
  }
}
