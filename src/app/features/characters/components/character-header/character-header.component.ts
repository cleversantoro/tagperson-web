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
  divindades = this.rules.deities;
  classesSociais = this.rules.socialClasses;
  localidades = this.rules.places;
  especializacoes = this.rules.specializations;

  form = this.fb.nonNullable.group({
    nome: '',
    jogador: '',
    divindadeId: 0,
    especializacaoId: 0,
    classeSocialId: 0,
    localidadeId: 0,
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
      divindadeId: this.sheet.divindadeId ?? 0,
      especializacaoId: this.sheet.especializacao?.id ?? 0,
      classeSocialId: this.sheet.classeSocialId ?? 0,
      localidadeId: this.sheet.localidadeId ?? 0,
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
      especializacao: this.especializacoes().find(x => x.id === v.especializacaoId)
        ? { ...this.sheet.especializacao!, id: v.especializacaoId, nome: this.especializacoes().find(x => x.id === v.especializacaoId)!.name }
        : this.sheet.especializacao,
      raca: racaName,
      profissao: profName,
      divindade: this.divindades().find(x => x.id === v.divindadeId)?.name ?? '',
      classeSocial: this.classesSociais().find(x => x.id === v.classeSocialId)?.name ?? '',
      localidade: this.localidades().find(x => x.id === v.localidadeId)?.name ?? '',
    });
  }
}

