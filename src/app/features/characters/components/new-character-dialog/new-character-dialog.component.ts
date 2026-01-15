import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { RulesService } from '../../../../core/services/rules.service';

@Component({
  standalone: true,
  selector: 'app-new-character-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './new-character-dialog.component.html',
  styleUrls: ['./new-character-dialog.component.scss']
})
export class NewCharacterDialogComponent {
  private dialogRef = inject(MatDialogRef<NewCharacterDialogComponent>);
  private fb = inject(FormBuilder);
  private rules = inject(RulesService);

  racas = this.rules.races;
  profs = this.rules.professions;

  form = this.fb.nonNullable.group({
    nome: ['', Validators.required],
    jogador: ['', Validators.required],
    racaId: [0, Validators.required],
    profissaoId: [0, Validators.required],
  });

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.form.invalid) return;
    const value = this.form.getRawValue();
    this.dialogRef.close({
      jogador: value.jogador,
      nome: value.nome,
      racaId: value.racaId,
      profissaoId: value.profissaoId,
    });
  }
}
