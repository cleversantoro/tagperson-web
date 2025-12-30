import { Component, Input, computed, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CharacterSheet, SkillSpecializationRow } from '../../../../../core/models/character.models';
import { CharacterStore } from '../../../../../core/services/character-store.service';
import { RulesService } from '../../../../../core/services/rules.service';
import { SkillFromGroup } from '../../../../../core/models/rules.models';
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

  specializationOpen = signal(false);
  specializationLoading = signal(false);
  specializationSkillName = signal('');
  specializationRows = signal<SkillSpecializationRow[]>([]);

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
    const list = this.availableSkills();
    this.selectedSkillId.set(list[0]?.id ?? null);
    this.newSkillLevel.set(0);
    this.addSkillOpen.set(true);
  }

  closeAddSkill() {
    this.addSkillOpen.set(false);
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
    try {
      const rows = await this.api.getSkillSpecializations(this.sheet.id, skill.id);
      this.specializationRows.set(rows.map(r => ({
        id: r.id,
        skillId: r.skillId,
        specializationId: r.skillSpecializationId,
        specialization: r.specialization,
        nivel: r.level
      })));
    } finally {
      this.specializationLoading.set(false);
    }
  }

  closeSpecializations() {
    this.specializationOpen.set(false);
    this.specializationRows.set([]);
  }

  skillsBought() {
    return (this.sheetSignal()?.habilidades ?? []).filter(s => (s.nivel ?? 0) > 0).length;
  }

  skillsToBuy() {
    return this.sheetSignal()?.habilidades?.length ?? 0;
  }
}


