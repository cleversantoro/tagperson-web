import { Injectable, computed, signal } from '@angular/core';
import { CharacterSheet } from '../models/character.models';
import { CharacterApiService } from './character-api.service';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class CharacterStore {
  private readonly api: CharacterApiService;
  private readonly auth: AuthService;

  private readonly _characters = signal<CharacterSheet[]>([]);
  readonly characters = computed(() => this._characters());

  private readonly _selectedId = signal<number | null>(null);
  readonly selectedId = computed(() => this._selectedId());

  readonly selected = computed(() => {
    const id = this._selectedId();
    return this._characters().find(c => c.id === id) ?? null;
  });

  private saveTimer?: ReturnType<typeof setTimeout>;

  constructor(api: CharacterApiService, auth: AuthService) {
    this.api = api;
    this.auth = auth;
    void this.load();
  }

  async load() {
    const ok = await this.auth.ensureToken();
    if (!ok) return;
    const list = await this.api.list();
    const mapped = list.map(x => this.api.mapListItem(x));
    this._characters.set(mapped);
    if (!this._selectedId() && mapped.length > 0) {
      await this.select(mapped[0].id);
    }
  }

  async select(id: number) {
    this._selectedId.set(id);
    const sheet = await this.api.getSheet(id);
    console.log(this.api.mapSheet(sheet));
    this.upsert(this.api.mapSheet(sheet), false);
  }

  async createNew() {
    const created = await this.api.create({
      name: 'Novo Personagem',
      level: 1
    });
    this.upsert(this.api.mapSheet(created), false);
    await this.select(created.id);
  }

  async createNewWithDetails(nome: string, player: string, racaId: number, profissaoId: number) {
    const created = await this.api.create({
      name: nome,
      player: player,
      level: 1,
      raceId: racaId,
      professionId: profissaoId
    });
    this.upsert(this.api.mapSheet(created), false);
    await this.select(created.id);
  }

  async delete(id: number) {
    await this.api.delete(id);
    const next = this._characters().filter(x => x.id !== id);
    this._characters.set(next);
    if (this._selectedId() === id) this._selectedId.set(next[0]?.id ?? null);
  }

  async addEquipment(characterId: number, equipmentId: number, qty?: number) {
    await this.api.addEquipment(characterId, equipmentId, qty);
    await this.select(characterId);
  }

  async addCharacterization(characterId: number, characterizationId: number, level?: number) {
    await this.api.addCharacterization(characterId, characterizationId, level);
    await this.select(characterId);
  }

  async addSkill(characterId: number, skillId: number, level?: number) {
    await this.api.addSkill(characterId, { skillId, level: level ?? null });
    await this.select(characterId);
  }

  async addSpell(characterId: number, spellId: number) {
    await this.api.addSpell(characterId, spellId);
    await this.select(characterId);
  }

  async updateTraits(characterId: number, updates: Partial<any>) {
    const sheet = this._characters().find(c => c.id === characterId);
    if (!sheet) return;

    const updated = {
      ...sheet,
      caracteristicas: {
        ...sheet.caracteristicas,
        ...updates
      },
      updatedAt: new Date().toISOString()
    };

    this.upsert(updated);
  }

  async updateMoney(characterId: number, money: { cobre: number; prata: number; ouro: number }) {
    const sheet = this._characters().find(c => c.id === characterId);
    if (!sheet) return;

    const updated = {
      ...sheet,
      caracteristicas: {
        ...sheet.caracteristicas,
        dinheiro: money
      },
      updatedAt: new Date().toISOString()
    };

    this.upsert(updated);
  }

  async updateGear(
    characterId: number,
    gear: Partial<{
      armadura: string;
      elmo: string;
      escudo: string;
      arma: string
      armas: { id: number; nome: string }[];
      pertences: { id: number; nome: string }[];
    }>){
    const sheet = this._characters().find(c => c.id === characterId);
    if (!sheet) return;

    const updated = {
      ...sheet,
      combate: {
        ...sheet.combate,
        ...gear
      },
      updatedAt: new Date().toISOString()
    };

    this.upsert(updated);
  }

  upsert(sheet: CharacterSheet, scheduleSave = true) {
    const list = this._characters();
    const idx = list.findIndex(x => x.id === sheet.id);
    const next = idx >= 0
      ? list.map(x => (x.id === sheet.id ? sheet : x))
      : [sheet, ...list];

    this._characters.set(next);
    if (scheduleSave) this.scheduleSave(sheet);
  }

  remove(id: number) {
    const next = this._characters().filter(x => x.id !== id);
    this._characters.set(next);
    if (this._selectedId() === id) this._selectedId.set(next[0]?.id ?? null);
  }

  private scheduleSave(sheet: CharacterSheet) {
    if (this.saveTimer) clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(async () => {
      await this.api.update(sheet.id, this.api.toUpdatePayload(sheet));
    }, 600);
  }
}
