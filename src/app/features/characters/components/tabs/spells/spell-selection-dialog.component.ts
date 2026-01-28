import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
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
    FormsModule
  ],
  templateUrl: './spell-selection-dialog.component.html',
  styleUrls: ['./spell-selection-dialog.component.scss']
})
export class SpellSelectionDialogComponent {
  spells$: Observable<SpellFromGroup[]>;

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
  }

  select(spell: SpellTechniquesDto) {
    this.api.addCharacterSpell(
      this.data.characterId ?? 0,
      spell.id,
      spell.spellGroupId ?? 0,//type === 1 ? this.data.professionId ?? 0 : this.data.especializationId ?? 0,
      0,
      this.data.type ?? 0
    )
      .subscribe(() => { this.dialogRef.close(true); });
  }

  selectSpell(spell: SpellTechniquesDto) {
    this.selectedSpell = spell;
  }

  confirm() {
    if (this.selectedSpell) {
      this.dialogRef.close(this.selectedSpell);
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
