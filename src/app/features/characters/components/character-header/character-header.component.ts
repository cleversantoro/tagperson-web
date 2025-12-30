import { Component, Input, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CharacterSheet } from '../../../../core/models/character.models';
import { CharacterStore } from '../../../../core/services/character-store.service';
import { RulesService } from '../../../../core/services/rules.service';

@Component({
  standalone: true,
  selector: 'app-character-header',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './character-header.component.html',
  styleUrls: ['./character-header.component.scss']
})
export class CharacterHeaderComponent {
  @Input({ required: true }) sheet!: CharacterSheet;

  private fb = inject(FormBuilder);
  private store = inject(CharacterStore);
  private rules = inject(RulesService);

  racas = this.rules.races;
  profs = this.rules.professions;

  form = this.fb.nonNullable.group({
    nome: '',
    jogador: '',
    divindade: '',
    racaId: 0,
    profissaoId: 0,
    experiencia: 0,
    estagio: 1,
  });

  ngOnChanges() {
    if (!this.sheet) return;
    this.form.patchValue({
      nome: this.sheet.nome ?? '',
      jogador: this.sheet.jogador ?? '',
      divindade: this.sheet.divindade ?? '',
      racaId: this.sheet.racaId ?? 0,
      profissaoId: this.sheet.profissaoId ?? 0,
      experiencia: this.sheet.experiencia,
      estagio: this.sheet.estagio,
    }, { emitEvent: false });
  }

  commit() {
    const v = this.form.getRawValue();
    const racaName = this.racas().find(x => x.id === v.racaId)?.name ?? this.sheet.raca;
    const profName = this.profs().find(x => x.id === v.profissaoId)?.name ?? this.sheet.profissao;
    this.store.upsert({
      ...this.sheet,
      ...v,
      raca: racaName,
      profissao: profName,
      updatedAt: new Date().toISOString()
    });
  }
}

