import { Component, Input, computed, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CharacterSheet } from '../../../../../core/models/character.models';
import { RulesService } from '../../../../../core/services/rules.service';
import { CombatService } from '../../../../../core/services/combat.service';
import { CombatFromGroup, CombatRow } from '../../../../../core/models/combat.models';
import { CharacterStore } from '../../../../../core/services/character-store.service';

@Component({
  standalone: true,
  selector: 'app-tab-combat',
  imports: [MatCardModule, MatIconModule],
  templateUrl: './tab-combat.component.html',
  styleUrls: ['./tab-combat.component.scss']
})

export class TabCombatComponent {
  private readonly sheetSignal = signal<CharacterSheet | null>(null);
  private rules = inject(RulesService);
  private combatApi = inject(CombatService);
  private store = inject(CharacterStore);

  addCombatOpen = signal(false);
  addCombatType = signal<'basic' | 'profession' | 'specialization'>('basic');
  newCombatLevel = signal(0);
  selectedCombatId = signal<number | null>(null);
  availableTechniques = signal<CombatFromGroup[]>([]);

  groups = this.rules.combatGroups;

  @Input({ required: true }) set sheet(value: CharacterSheet) {
    this.sheetSignal.set(value);
  }

  get sheet(): CharacterSheet {
    return this.sheetSignal()!;
  }

  private professionMainGroup = computed(() => {
    const prof = this.normalizeName(this.sheetSignal()?.profissao ?? '');
    if (!prof) return null;

    const groups = this.groups() ?? [];
    return groups.find(g => {
      const gName = this.normalizeName(g.group.name);
      return gName.includes(prof) && !gName.includes('-');
    });
  });

  basicas = computed(() => {
    const basic = this.sheetSignal()?.combate.tecnicasBasicas ?? [];
    const basics = basic;
    const rt = basics.flatMap(g => g).filter(s => s.tipo === 1);
    return rt;
  });

  especializacao = computed(() => {
    const prof = this.sheetSignal()?.combate.tecnicasEspecializacao ?? [];
    const basics = prof;
    const rt = basics.flatMap(g => g).filter(s => s.tipo === 3);
    return rt;
  });

  profissao = computed(() => {
    const esp = this.sheetSignal()?.combate.tecnicasProfissao ?? [];
    const basics = esp;
    const rt = basics.flatMap(g => g).filter(s => s.tipo === 2);
    return rt;
  });

  totalOf(item: CombatRow) {
    const level = item.nivel ?? 0;
    const bonus = item.bonus ?? 0;
    return level + bonus;
  }

  openAddCombat(type: string) {
    const list = this.availableTechniques();
    this.selectedCombatId.set(list[0]?.combatId ?? null);
    this.newCombatLevel.set(0);
    this.addCombatOpen.set(true);
    this.addCombatType.set(type as any);


    switch (type) {
      case 'basic':
        this.combatApi.getBasicCombat().subscribe((data) => {
          this.availableTechniques.set(data);
        });
        break;

      case 'profession':
        this.combatApi.getProfessionCombat(this.sheetSignal()?.profissaoId ?? 0).subscribe((data) => {
          this.availableTechniques.set(data);
        });
        break;

      case 'specialization':
        this.combatApi.getEspecializationCombat(this.sheetSignal()?.especializacao?.id ?? 0).subscribe((data) => {
          this.availableTechniques.set(data);
        });
        break;
    }
  }

  closeAddCombat() {
    this.addCombatOpen.set(false);
  }

  async saveCombat() {
    const combatSkillId = this.selectedCombatId();
    if (!combatSkillId) return;

    const type = this.addCombatType();
    const group = type === 'basic' ? 1 : type === 'profession' ? 2 : 3;


    await this.combatApi.addCombatSkill(
      this.sheet.id,
      combatSkillId,

      type === 'basic'
        ? 1
        : type === 'profession'
          ? this.sheet.profissaoId ?? 0
          : this.sheet.especializacao?.combateGrupoId ?? 0,

      this.newCombatLevel(),
      group
    );

    this.addCombatOpen.set(false);
    this.store.select(this.sheet.id);
  }

  async deleteCombat(combat: CombatRow) {
    if (confirm(`Tem certeza que deseja deletar "${combat.nome}"?`)) {
      await this.combatApi.deleteCombat(
        this.sheet.id,
        combat.id,
        combat.grupoCombateId ?? 0
      );
      this.store.select(this.sheet.id);
    }
  }

  private normalizeName(value: string) {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  get canAddProfession() {
    return !!this.professionMainGroup();
  }

  canAddProfessionTechnique = computed(() => {
    const level = this.sheetSignal()?.nivel ?? 0;
    return level >= 5;
  });

  canAddSpecializationTechnique = computed(() => {
    const level = this.sheetSignal()?.nivel ?? 0;
    return level >= 5;
  });

  detailsOpen = signal(false);
  selectedCombatDetails = signal<CombatRow | null>(null);
  combatDetailsData = signal<any>(null);

  openCombatDetails(combat: CombatRow) {
    this.selectedCombatDetails.set(combat);
    this.detailsOpen.set(true);
    this.combatDetailsData.set(combat);
  }

  closeCombatDetails() {
    this.detailsOpen.set(false);
    this.selectedCombatDetails.set(null);
    this.combatDetailsData.set(null);
  }}
