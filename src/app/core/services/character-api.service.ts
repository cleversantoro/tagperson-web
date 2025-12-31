import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from './api-config';
import { CharacterSheet, AttributeKey } from '../models/character.models';

interface ApiCharacterListItem {
  id: number;
  name: string;
  level: number | null;
  race?: { id: number; name: string }  | null;
  profession?: { id: number; name: string }  | null;
}

interface ApiCharacterSheet {
  id: number;
  name: string;
  level: number | null;
  player?: string | null;
  race?: { id: number; name: string } | null;
  profession?: { id: number; name: string } | null;
  specialization?: { id: number; name: string } | null;
  attributes: {
    agi: number | null;
    per: number | null;
    intel: number | null;
    aur: number | null;
    car: number | null;
    for: number | null;
    fis: number | null;
  };
  points: {
    pointsSkill: number | null;
    pointsWeapon: number | null;
    pointsCombat: number | null;
    pointsMagic: number | null;
  };
  features: {
    age?: number | null;
    height?: number | null;
    weight?: number | null;
    eyes?: string | null;
    hair?: string | null;
    skin?: string | null;
    appearance?: string | null;
    history?: string | null;
    coins: {
      coinsCopper: number | null;
      coinsSilver: number | null;
      coinsGold: number | null;
    };
  };
  derived: {
    resistenciaFisica: number;
    resistenciaMagica: number;
    velocidade: number;
    karma: number;
    defesaAtiva: number;
    defesaPassiva: number;
    absorcao: number;
    pontosMagia: number;
    maxEf: number;
  };
  skills: Array<{
    skillId: number;
    name: string;
    level: number | null;
    attributeCode?: string | null;
    restricted?: number | null;
    hasSpecialization?: number | null;
  }>;
  spells: Array<{
    spellId: number;
    name: string;
    level: number | null;
    evocation?: string | null;
    range?: string | null;
    duration?: string | null;
  }>;
  combat: Array<{
    combatSkillId: number;
    name: string;
    level: number | null;
    attributeCode?: string | null;
  }>;
  equipments: Array<{
    equipmentId: number;
    name: string;
    qty?: number | null;
  }>;
}

interface ApiUpdateRequest {
  name: string;
  player?: string | null;
  level?: number | null;
  raceId?: number | null;
  professionId?: number | null;
  attAgi?: number | null;
  attPer?: number | null;
  attInt?: number | null;
  attAur?: number | null;
  attCar?: number | null;
  attFor?: number | null;
  attFis?: number | null;
  coinsCopper?: number | null;
  coinsSilver?: number | null;
  coinsGold?: number | null;
  pointsSkill?: number | null;
  pointsWeapon?: number | null;
  pointsCombat?: number | null;
  pointsMagic?: number | null;
}

interface ApiAddSkillRequest {
  skillId: number;
  level?: number | null;
}

interface ApiAddCombatSkillRequest {
  combatSkillId: number;
  level?: number | null;
}

interface ApiCreateRequest {
  name: string;
  player?: string | null;
  level?: number | null;
  raceId?: number | null;
  professionId?: number | null;
}

interface ApiCharacterSkillSpecialization {
  id: number;
  skillId: number;
  skillSpecializationId?: number | null;
  specialization?: string | null;
  level?: number | null;
}

interface ApiCharacterSkillSpecializationRequest {
  specialization?: string | null;
  level?: number | null;
  skillSpecializationId?: number | null;
  id?: number | null;
}

@Injectable({ providedIn: 'root' })
export class CharacterApiService {
  constructor(private http: HttpClient) {}

  async list(): Promise<ApiCharacterListItem[]> {
    return await firstValueFrom(this.http.get<ApiCharacterListItem[]>(`${API_BASE_URL}/characters`));
  }

  async getSheet(id: number): Promise<ApiCharacterSheet> {
    return await firstValueFrom(this.http.get<ApiCharacterSheet>(`${API_BASE_URL}/characters/${id}/sheet`));
  }

  async create(payload: ApiCreateRequest): Promise<ApiCharacterSheet> {
    return await firstValueFrom(this.http.post<ApiCharacterSheet>(`${API_BASE_URL}/characters`, payload));
  }

  async update(id: number, payload: ApiUpdateRequest): Promise<void> {
    await firstValueFrom(this.http.put<void>(`${API_BASE_URL}/characters/${id}`, payload));
  }

  async addSkill(characterId: number, payload: ApiAddSkillRequest): Promise<void> {
    await firstValueFrom(this.http.post<void>(`${API_BASE_URL}/characters/${characterId}/skills`, payload));
  }

  async addCombatSkill(characterId: number, payload: ApiAddCombatSkillRequest): Promise<void> {
    await firstValueFrom(this.http.post<void>(`${API_BASE_URL}/characters/${characterId}/combat`, payload));
  }

  async getSkillSpecializations(characterId: number, skillId: number): Promise<ApiCharacterSkillSpecialization[]> {
    return await firstValueFrom(
      this.http.get<ApiCharacterSkillSpecialization[]>(
        `${API_BASE_URL}/characters/${characterId}/skills/${skillId}/specializations`
      )
    );
  }

  async addSkillSpecialization(
    characterId: number,
    skillId: number,
    payload: ApiCharacterSkillSpecializationRequest
  ): Promise<void> {
    await firstValueFrom(
      this.http.post<void>(`${API_BASE_URL}/characters/${characterId}/skills/${skillId}/specializations`, payload)
    );
  }

  async delete(id: number): Promise<void> {
    await firstValueFrom(this.http.delete<void>(`${API_BASE_URL}/characters/${id}`));
  }

  async addEquipment(characterId: number, equipmentId: number, qty?: number): Promise<void> {
    await firstValueFrom(this.http.post<void>(`${API_BASE_URL}/characters/${characterId}/equipments`, {
      equipmentId,
      qty
    }));
  }

  mapListItem(item: ApiCharacterListItem): CharacterSheet {
    return {
      id: item.id,
      nome: item.name,
      nivel: item.level ?? 0,
      raca: item.race?.name ?? '',
      profissao: item.profession?.name ?? '',
      experiencia: 0,
      estagio: 0,
      atributos: {
        pointsTotal: 0,
        pointsUsed: 0,
        values: {
          AGILIDADE: 0,
          PERCEPCAO: 0,
          INTELECTO: 0,
          AURA: 0,
          CARISMA: 0,
          FORCA: 0,
          FISICO: 0
        }
      },
      derivados: {
        resistenciaFisica: 0,
        resistenciaMagia: 0,
        velocidade: 0,
        karma: 0,
        defesaAtiva: 0,
        defesaPassiva: 0,
        energiaFisicaAtual: 0,
        energiaFisicaMax: 0,
        energiaHeroica: 0
      },
      habilidades: [],
      magias: [],
      combate: { tecnicas: [], tecnicasBasicas: [], tecnicasEspecializacao: [], tecnicasRestritas: [] },
      caracteristicas: { pertences: [], equipamentosIniciais: [], dinheiro: { cobre: 0, prata: 0, ouro: 0 } },
      updatedAt: new Date().toISOString()
    };
  }

  mapSheet(sheet: ApiCharacterSheet): CharacterSheet {
    const values: Record<AttributeKey, number> = {
      AGILIDADE: sheet.attributes.agi ?? 0,
      PERCEPCAO: sheet.attributes.per ?? 0,
      INTELECTO: sheet.attributes.intel ?? 0,
      AURA: sheet.attributes.aur ?? 0,
      CARISMA: sheet.attributes.car ?? 0,
      FORCA: sheet.attributes.for ?? 0,
      FISICO: sheet.attributes.fis ?? 0
    };

    const maxEf = sheet.derived.maxEf ?? 0;

    return {
      id: sheet.id,
      nome: sheet.name,
      nivel: sheet.level ?? 0,
      jogador: sheet.player ?? '',
      raca: sheet.race?.name ?? '',
      profissao: sheet.profession?.name ?? '',
      especializacao: sheet.specialization?.name ?? '',
      racaId: sheet.race?.id ?? null,
      profissaoId: sheet.profession?.id ?? null,
      experiencia: 0,
      estagio: 0,
      atributos: {
        pointsTotal: sheet.points.pointsSkill ?? 0,
        pointsUsed: 0,
        values
      },
      pontos: {
        habilidade: sheet.points.pointsSkill ?? 0,
        arma: sheet.points.pointsWeapon ?? 0,
        combate: sheet.points.pointsCombat ?? 0,
        magia: sheet.points.pointsMagic ?? 0
      },
      derivados: {
        resistenciaFisica: sheet.derived.resistenciaFisica ?? 0,
        resistenciaMagia: sheet.derived.resistenciaMagica ?? 0,
        velocidade: sheet.derived.velocidade ?? 0,
        karma: sheet.derived.karma ?? 0,
        defesaAtiva: sheet.derived.defesaAtiva ?? 0,
        defesaPassiva: sheet.derived.defesaPassiva ?? 0,
        energiaFisicaAtual: maxEf,
        energiaFisicaMax: maxEf,
        energiaHeroica: 0
      },
      habilidades: sheet.skills?.map(s => ({
        id: s.skillId,
        nome: s.name,
        nivel: s.level ?? 0,
        restrito: (s.restricted ?? 0) === 1,
        ajuste: s.attributeCode ?? '',
        hasSpecialization: (s.hasSpecialization ?? 0) === 1
      })) ?? [],
      magias: sheet.spells?.map(s => ({
        id: s.spellId,
        nome: s.name,
        nivel: s.level ?? 0,
        custo: 0,
        total: 0,
        grupo: 'Basica',
        evocacao: s.evocation ?? '',
        alcance: s.range ?? '',
        duracao: s.duration ?? ''
      })) ?? [],
      combate: {
        tecnicas: sheet.combat?.map(c => ({
          id: c.combatSkillId,
          nivel: c.level ?? 0
        })) ?? [],
        tecnicasBasicas: [],
        tecnicasEspecializacao: [],
        tecnicasRestritas: []
      },
      caracteristicas: {
        olhos: sheet.features.eyes ?? '',
        cabelo: sheet.features.hair ?? '',
        pele: sheet.features.skin ?? '',
        idade: sheet.features.age ?? 0,
        peso: sheet.features.weight ?? 0,
        altura: sheet.features.height ?? 0,
        aparencia: sheet.features.appearance ?? '',
        historia: sheet.features.history ?? '',
        pertences: sheet.equipments?.map(e => ({
          equipmentId: e.equipmentId,
          nome: e.name,
          quantidade: e.qty ?? 1
        })) ?? [],
        equipamentosIniciais: sheet.equipments?.map(e => {
          if (e.qty && e.qty > 1) return `${e.name} x${e.qty}`;
          return e.name;
        }) ?? [],
        dinheiro: {
          cobre: sheet.features.coins.coinsCopper ?? 0,
          prata: sheet.features.coins.coinsSilver ?? 0,
          ouro: sheet.features.coins.coinsGold ?? 0
        }
      },
      updatedAt: new Date().toISOString()
    };
  }

  toUpdatePayload(sheet: CharacterSheet): ApiUpdateRequest {
    return {
      name: sheet.nome,
      player: sheet.jogador ?? null,
      level: sheet.nivel ?? null,
      raceId: sheet.racaId ? sheet.racaId : null,
      professionId: sheet.profissaoId ? sheet.profissaoId : null,
      attAgi: sheet.atributos.values.AGILIDADE ?? 0,
      attPer: sheet.atributos.values.PERCEPCAO ?? 0,
      attInt: sheet.atributos.values.INTELECTO ?? 0,
      attAur: sheet.atributos.values.AURA ?? 0,
      attCar: sheet.atributos.values.CARISMA ?? 0,
      attFor: sheet.atributos.values.FORCA ?? 0,
      attFis: sheet.atributos.values.FISICO ?? 0,
      coinsCopper: sheet.caracteristicas.dinheiro.cobre ?? 0,
      coinsSilver: sheet.caracteristicas.dinheiro.prata ?? 0,
      coinsGold: sheet.caracteristicas.dinheiro.ouro ?? 0,
      pointsSkill: sheet.pontos?.habilidade ?? 0,
      pointsWeapon: sheet.pontos?.arma ?? 0,
      pointsCombat: sheet.pontos?.combate ?? 0,
      pointsMagic: sheet.pontos?.magia ?? 0
    };
  }
}
