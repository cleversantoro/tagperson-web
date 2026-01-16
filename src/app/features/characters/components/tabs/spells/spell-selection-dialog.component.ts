import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { SpellFromGroup } from '../../../../../core/models/spells.models';

interface DialogData {
  spells: SpellFromGroup[];
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
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>
      <mat-form-field appearance="outline" class="search-field">
        <mat-label>Buscar magia</mat-label>
        <input matInput [(ngModel)]="searchText" />
      </mat-form-field>

      <mat-list>
        @for (spell of filteredSpells(); track spell.id) {
          <mat-list-item class="spell-item" (click)="selectSpell(spell)">
            <strong>{{ spell.name }}</strong>
            @if (spell.cost) {
              <span class="spell-cost">Custo: {{ spell.cost }}</span>
            }
          </mat-list-item>
        }
      </mat-list>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="cancel()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="confirm()" [disabled]="!selected()">
        Adicionar
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .search-field {
      width: 100%;
      margin-bottom: 16px;
    }

    mat-list {
      max-height: 400px;
      overflow-y: auto;
    }

    .spell-item {
      cursor: pointer;
      padding: 8px;
      border-radius: 4px;
      transition: background-color 0.2s;

      &:hover {
        background-color: rgba(0, 0, 0, 0.04);
      }
    }

    .spell-cost {
      margin-left: auto;
      font-size: 0.9em;
      color: #666;
    }

    mat-dialog-actions {
      padding-top: 16px;
    }
  `]
})
export class SpellSelectionDialogComponent {
  searchText = '';
  selectedSpell: SpellFromGroup | null = null;

  filteredSpells = () => {
    const search = this.searchText.toLowerCase().trim();
    return search
      ? this.data.spells.filter(s => s.name.toLowerCase().includes(search))
      : this.data.spells;
  };

  selected = () => this.selectedSpell;

  constructor(
    public dialogRef: MatDialogRef<SpellSelectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  selectSpell(spell: SpellFromGroup) {
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
