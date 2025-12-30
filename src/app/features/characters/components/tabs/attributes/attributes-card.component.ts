import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CharacterSheet } from '../../../../../core/models/character.models';

@Component({
  standalone: true,
  selector: 'app-attributes-card',
  imports: [MatCardModule],
  templateUrl: './attributes-card.component.html',
  styleUrls: ['./attributes-card.component.scss']
})
export class AttributesCardComponent {
  @Input({ required: true }) sheet!: CharacterSheet;
}

