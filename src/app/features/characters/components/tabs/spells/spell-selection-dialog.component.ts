import { Component, Inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';


import { SpellFromGroup, SpellTechniquesDto} from '../../../../../core/models/spells.models';
import { CharacterApiService } from '../../../../../core/services/character-api.service';
import { Observable } from 'rxjs';

interface DialogData {
  professionId?: number;
  especializationId?: number;
  magiaGrupoId?: number;
  type?: number;
  characterId?: number;
  title: string;
}


@Component({
  selector: 'app-spell-selection-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule
  ],
  templateUrl: './spell-selection-dialog.component.html',
  styleUrls: ['./spell-selection-dialog.component.scss']
})
export class SpellSelectionDialogComponent {
  spells$: Observable<SpellFromGroup[]>;
  availableSpells = signal<SpellTechniquesDto[]>([]);
  selectedSpellId = signal<number | null>(null);
  spellLevel = signal(0);

  searchText = '';
  selectedSpell: SpellFromGroup | null = null;

  filteredSpells = () => {
    const search = this.searchText.toLowerCase().trim();
    return search
    //? this.data.spells.filter(s => s.name.toLowerCase().includes(search))
    //: this.data.spells;
  };

  selected = () => this.selectedSpell;

  constructor(
    private api: CharacterApiService,
    private dialogRef: MatDialogRef<SpellSelectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.spells$ = this.data.type === 1
      ? this.api.getProfessionSpells(this.data.professionId ?? 0)
      : this.api.getEspecializationSpells(this.data.especializationId ?? 0);

    // Load spells into availableSpells signal
    this.spells$.subscribe((spells) => {
      const flatSpells = spells.flatMap(g => g ?? []);
      this.availableSpells.set(flatSpells);
      if (flatSpells.length > 0) {
        this.selectedSpellId.set(flatSpells[0].id);
      }
    });
  }

  select(spell: SpellTechniquesDto) {
    this.api.addCharacterSpell(
      this.data.characterId ?? 0,
      spell.id,
      spell.spellGroupId ?? 0,
      0,
      this.data.type ?? 0
    )
      .subscribe(() => { this.dialogRef.close(true); });
  }

  selectSpell(spell: SpellTechniquesDto) {
    this.selectedSpell = spell;
  }

  confirm() {
    if (this.selectedSpellId()) {
      const selectedSpell = this.availableSpells().find(s => s.id === this.selectedSpellId());
      if (selectedSpell) {
        this.api.addCharacterSpell(
          this.data.characterId ?? 0,
          selectedSpell.id,
          selectedSpell.spellGroupId ?? 0,
          this.spellLevel(),
          this.data.type ?? 0
        )
          .subscribe(() => { this.dialogRef.close(true); });
      }
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
