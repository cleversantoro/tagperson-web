import { Component, computed, signal } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CharacterStore } from '../../../../core/services/character-store.service';

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

  constructor(public store: CharacterStore) {}

  create() {
    void this.store.createNew();
  }
}

