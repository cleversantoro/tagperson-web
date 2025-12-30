import { Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/services/auth.service';
import { CharacterStore } from '../../core/services/character-store.service';
import { RulesService } from '../../core/services/rules.service';

@Component({
  standalone: true,
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {
  error = signal('');
  form;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private store: CharacterStore,
    private rules: RulesService,
    private router: Router
  ) {
    this.form = this.fb.nonNullable.group({
      username: 'admin',
      password: 'admin123'
    });
  }

  async submit() {
    this.error.set('');
    const { username, password } = this.form.getRawValue();
    try {
      await this.auth.login(username, password);
      await this.rules.load();
      await this.store.load();
      await this.router.navigateByUrl('/');
    } catch {
      this.error.set('Usuario ou senha invalidos.');
    }
  }
}
