import { Component, Input } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { MatCardModule } from '@angular/material/card';
import { CharacterSheet, AttributeKey } from '../../../../../core/models/character.models';
import { CharacterStore } from '../../../../../core/services/character-store.service';
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

  constructor(private store: CharacterStore) {}

  value(k: AttributeKey) { return this.sheet.atributos.values[k] ?? 0; }

  set(k: AttributeKey, v: number) {
    const nextValues = { ...this.sheet.atributos.values, [k]: v };
    // aqui você coloca a regra real de pontos do Tagmar depois (custo/limites)
    this.store.upsert({
      ...this.sheet,
      atributos: {
        ...this.sheet.atributos,
        values: nextValues,
        pointsUsed: this.computeUsed(nextValues),
      },
      updatedAt: new Date().toISOString()
    });
  }

  private computeUsed(values: Record<AttributeKey, number>) {
    // placeholder: soma dos positivos como “gasto”
    return Object.values(values).reduce((acc, n) => acc + Math.max(0, n), 0);
  }
}

