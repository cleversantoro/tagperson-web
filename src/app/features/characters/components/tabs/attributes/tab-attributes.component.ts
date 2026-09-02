import { Component, Input, signal } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { MatCardModule } from '@angular/material/card';
import { CharacterSheet, AttributeKey } from '../../../../../core/models/character.models';
import { CharacterStore } from '../../../../../core/services/character-store.service';
import { CharacterApiService } from '../../../../../core/services/character-api.service';
import { AttributesCardComponent } from "./attributes-card.component";

@Component({
  standalone: true,
  selector: 'app-tab-attributes',
  imports: [MatSliderModule, MatCardModule, AttributesCardComponent],
  templateUrl: './tab-attributes.component.html',
  styleUrls: ['./tab-attributes.component.scss']
})
export class TabAttributesComponent {
  @Input({ required: true }) sheet!: CharacterSheet;

  keys: AttributeKey[] = ['AGILIDADE','PERCEPCAO','INTELECTO','AURA','CARISMA','FORCA','FISICO'];
  labels: Record<AttributeKey,string> = {
    AGILIDADE: 'AGILIDADE',
    PERCEPCAO: 'PERCEPÇÃO',
    INTELECTO: 'INTELECTO',
    AURA: 'AURA',
    CARISMA: 'CARISMA',
    FORCA: 'FORÇA',
    FISICO: 'FÍSICO',
  };

  constructor(private store: CharacterStore, private api: CharacterApiService) {}

  error = signal('');

  value(k: AttributeKey) { return this.sheet.atributos.values[k] ?? 0; }

  async set(k: AttributeKey, v: number) {
    const nextValues = { ...this.sheet.atributos.values, [k]: v };
    try {
      await this.api.applyAttributes(this.sheet.id, {
        attAgi: nextValues.AGILIDADE,
        attPer: nextValues.PERCEPCAO,
        attInt: nextValues.INTELECTO,
        attAur: nextValues.AURA,
        attCar: nextValues.CARISMA,
        attFor: nextValues.FORCA,
        attFis: nextValues.FISICO
      });
      this.error.set('');
      await this.store.select(this.sheet.id);
    } catch {
      this.error.set('A distribuição de atributos excede os limites permitidos.');
    }
  }
}

