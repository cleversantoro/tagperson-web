import { Component, Input, computed, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CharacterSheet, SkillSpecializationRow } from '../../../../../core/models/character.models';
import { CharacterStore } from '../../../../../core/services/character-store.service';
import { RulesService } from '../../../../../core/services/rules.service';
import { SkillFromGroup, SkillSpecializationSuggestion } from '../../../../../core/models/rules.models';
import { CharacterApiService } from '../../../../../core/services/character-api.service';

@Component({
  standalone: true,
  selector: 'app-tab-skills',
  imports: [MatCardModule],
  templateUrl: './tab-skills.component.html',
  styleUrls: ['./tab-skills.component.scss']
})
export class TabSkillsComponent {
  private readonly sheetSignal = signal<CharacterSheet | null>(null);
  @Input({ required: true }) set sheet(value: CharacterSheet) {
    this.sheetSignal.set(value);
  }
  get sheet(): CharacterSheet {
    return this.sheetSignal()!;
  }

  private rules = inject(RulesService);
  private store = inject(CharacterStore);
  private api = inject(CharacterApiService);
  groups = this.rules.skillGroups;

  private skillMap = computed(() => {
    const map = new Map<number, number>();
    for (const s of this.sheetSignal()?.habilidades ?? []) {
      map.set(s.id, s.nivel ?? 0);
    }
    return map;
  });

  filteredGroups = computed(() => {
    const ids = new Set((this.sheetSignal()?.habilidades ?? []).map(s => s.id));
    return (this.groups() ?? [])
      .map(g => ({
        group: g.group,
        skills: g.skills.filter(s => ids.has(s.id))
      }))
      .filter(g => g.skills.length > 0);
  });

  availableSkills = computed(() => {
    const current = new Set((this.sheetSignal()?.habilidades ?? []).map(s => s.id));
    const all = (this.groups() ?? []).flatMap(g => g.skills);
    return all
      .filter(s => !current.has(s.id))
      .sort((a, b) => a.name.localeCompare(b.name));
  });

  addSkillOpen = signal(false);
  selectedSkillId = signal<number | null>(null);
  newSkillLevel = signal(0);
  selectedGroupId = signal<number | null>(null);

  groupOptions = computed(() => {
    const groups = this.groups() ?? [];
    return [{ id: null, name: 'Todos' }, ...groups
      .map(g => ({ id: g.group.id, name: g.group.name }))
      .sort((a, b) => a.name.localeCompare(b.name))];
  });

  filteredAvailableSkills = computed(() => {
    const groupId = this.selectedGroupId();
    if (!groupId) return this.availableSkills();
    const group = (this.groups() ?? []).find(g => g.group.id === groupId);
    if (!group) return [];
    const current = new Set((this.sheetSignal()?.habilidades ?? []).map(s => s.id));
    return group.skills
      .filter(s => !current.has(s.id))
      .sort((a, b) => a.name.localeCompare(b.name));
  });

  specializationOpen = signal(false);
  specializationLoading = signal(false);
  specializationSkillName = signal('');
  specializationSkillId = signal<number | null>(null);
  specializationRows = signal<SkillSpecializationRow[]>([]);
  addSpecializationOpen = signal(false);
  specializationSuggestions = signal<SkillSpecializationSuggestion[]>([]);
  selectedSpecializationId = signal<number | null>(null);
  selectedSpecializationText = signal('');
  newSpecializationLevel = signal(0);

  levelOf(id: number) {
    return this.skillMap().get(id) ?? 0;
  }

  isRestricted(skill: SkillFromGroup) {
    return (skill.restricted ?? 0) === 1;
  }

  totalOf(skill: SkillFromGroup) {
    const level = this.levelOf(skill.id);
    const bonus = skill.bonus ?? 0;
    return level + bonus;
  }

  openAddSkill() {
    this.selectedGroupId.set(null);
    const filtered = this.filteredAvailableSkills();
    this.selectedSkillId.set(filtered[0]?.id ?? null);
    this.newSkillLevel.set(0);
    this.addSkillOpen.set(true);
  }

  closeAddSkill() {
    this.addSkillOpen.set(false);
  }

  onGroupChange(value: number | null) {
    this.selectedGroupId.set(value);
    const filtered = this.filteredAvailableSkills();
    this.selectedSkillId.set(filtered[0]?.id ?? null);
  }

  async saveSkill() {
    const skillId = this.selectedSkillId();
    if (!skillId) return;
    await this.store.addSkill(this.sheet.id, skillId, this.newSkillLevel());
    this.addSkillOpen.set(false);
  }

  async openSpecializations(skill: SkillFromGroup) {
    this.specializationOpen.set(true);
    this.specializationLoading.set(true);
    this.specializationSkillName.set(skill.name);
    this.specializationSkillId.set(skill.id);
    try {
      await this.loadSpecializations(skill.id);
    } finally {
      this.specializationLoading.set(false);
    }
  }

  closeSpecializations() {
    this.specializationOpen.set(false);
    this.specializationRows.set([]);
    this.addSpecializationOpen.set(false);
  }

  openAddSpecialization() {
    const skillId = this.specializationSkillId();
    if (!skillId) return;
    this.specializationSuggestions.set([]);
    this.selectedSpecializationId.set(null);
    this.selectedSpecializationText.set('');
    this.newSpecializationLevel.set(0);
    this.addSpecializationOpen.set(true);
    void this.loadSpecializationSuggestions(skillId);
  }

  closeAddSpecialization() {
    this.addSpecializationOpen.set(false);
  }

  async saveSpecialization() {
    const skillId = this.specializationSkillId();
    const specializationId = this.selectedSpecializationId();
    const specializationText = this.selectedSpecializationText().trim();
    if (!skillId || !specializationId || !specializationText) return;
    await this.api.addSkillSpecialization(this.sheet.id, skillId, {
      specialization: specializationText,
      level: this.newSpecializationLevel(),
      skillSpecializationId: specializationId
    });
    await this.loadSpecializations(skillId);
    this.addSpecializationOpen.set(false);
  }

  private async loadSpecializationSuggestions(skillId: number) {
    const list = await this.rules.getSkillSpecializationSuggestions(skillId);
    const filtered = list.filter(s => (s.suggestion ?? '').trim().length > 0);
    this.specializationSuggestions.set(filtered);
    const first = filtered[0];
    this.selectedSpecializationId.set(first?.id ?? null);
    this.selectedSpecializationText.set(first?.suggestion ?? '');
  }

  onSpecializationChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const value = select.value ? Number(select.value) : null;
    const text = select.options[select.selectedIndex]?.text ?? '';
    this.selectedSpecializationId.set(value);
    this.selectedSpecializationText.set(text);
  }

  private async loadSpecializations(skillId: number) {
    const rows = await this.api.getSkillSpecializations(this.sheet.id, skillId);
    this.specializationRows.set(rows.map(r => ({
      id: r.id,
      skillId: r.skillId,
      specializationId: r.skillSpecializationId,
      specialization: r.specialization,
      nivel: r.level
    })));
  }

  skillsBought() {
    return (this.sheetSignal()?.habilidades ?? []).filter(s => (s.nivel ?? 0) > 0).length;
  }

  skillsToBuy() {
    return this.sheetSignal()?.habilidades?.length ?? 0;
  }
}

