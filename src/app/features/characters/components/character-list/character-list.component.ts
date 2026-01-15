import { Component, computed, signal, inject } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { CharacterStore } from '../../../../core/services/character-store.service';
import { NewCharacterDialogComponent } from '../new-character-dialog/new-character-dialog.component';

@Component({
  standalone: true,
  selector: 'app-character-list',
  imports: [MatListModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.scss']
})
export class CharacterListComponent {
  q = signal('');
  filtered = computed(() => {
    const q = this.q().trim().toLowerCase();
    const list = this.store.characters();
    return q ? list.filter(x => x.nome.toLowerCase().includes(q)) : list;
  });

  private dialog = inject(MatDialog);

  constructor(public store: CharacterStore) {}

  create() {
    this.dialog.open(NewCharacterDialogComponent).afterClosed().subscribe(async (result) => {
      if (result) {
        await this.store.createNewWithDetails(result.nome, result.jogador, result.racaId, result.profissaoId);
      }
    });
  }
}

