import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CharacterListComponent } from '../../features/characters/components/character-list/character-list.component';
import { CharacterPageComponent } from '../../features/characters/pages/character-page.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    MatSidenavModule, MatToolbarModule, MatIconModule, MatButtonModule,
    CharacterListComponent, CharacterPageComponent
  ],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.scss'
})
export class AppShellComponent {}
