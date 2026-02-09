import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from './api-config';
import { CharacterSheet, AttributeKey } from '../models/character.models';
import { SpellFromGroup } from '../models/spells.models';
// import { CombatFromGroup } from '../models/combat.models';

interface ApiCharacterListItem {
  id: number;
  name: string;
  level: number | null;
  race?: { id: number; name: string } | null;
  profession?: { id: number; name: string } | null;
}

interface ApiCharacterSheet {
  id: number;
  name: string;
  level: number | null;
  experience?: number | null;
  player?: string | null;
  imageFile?: string | null;

  race?: { id: number; name: string } | null;
  profession?: { id: number; name: string } | null;
  classSocial?: { id: number; name: string } | null;
  birthPlace?: { id: number; name: string } | null;
  deity?: { id: number; name: string } | null;

  specialization?: {
    id: number;
    name?: string | null;
    description?: string | null;
    professionId: number;
    spellGroupId: number;
    combatGroupId: number;
  } | null;

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
  };

  coins: {
    copper: number | null;
    silver: number | null;
    gold: number | null;
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
    id: number;
    name: string;
    description: string;
    effects: string;
    duration?: string | null;
    evocation?: string | null;
    level: number | null;
    range?: string | null;
    cost: number;
    type: number;
  }>;

  combat: Array<{
    combatId: number;
    combatName: string;
    attributeCode?: string;
    effect?: string;
    notes?: string;
    requisite?: string;
    rollTable: string;
    improvement?: string;
    profEspId?: number;
    combatGroupId?: number;
    groupName?: number;
    categoryId?: number;
    categoryName?: string;
    cost: number;
    bonus?: number;
    reduction?: number;
    type?: number;
    level?: number;
  }>;

  equipments: Array<{
    equipmentId: number;
    groupid: number;
    name: string;
    description: string;
    price: number;
    isWeapon: number;
    isDefense: number;
    isArmor: number;
    isShield: number;
    isHelmet: number;
  }>;

  characterizations: Array<{
    characterizationId: number;
    name: string;
    characterizationTypeId: number;
    nameType: string;
    characterizationGroupId: number;
    nameGroup: string;
    description: string;
    notes: string;
    placeId: number;
    cost: number;
    isInitial: number;
    isRare: number;
    isAllowGame: number;
    level?: number | null;
  }>;

  startingEquipments: Array<{
    equipmentId: number;
    name: string;
  }>;
}

interface ApiCharacterUpdateRequest {
  name: string;
  player?: string | null;
  level?: number | null;
  raceId?: number | null;
  professionId?: number | null;

  age?: number | null;
  height?: number | null;
  weight?: number | null;
  eyes?: string | null;
  hair?: string | null;
  skin?: string | null;
  appearance?: string | null;
  history?: string | null;

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

interface ApiCharacterCreateRequest {
  name: string;
  player?: string | null;
  level?: number | null;
  raceId?: number | null;
  professionId?: number | null;
}

interface ApiAddSkillRequest {
  skillId: number;
  level?: number | null;
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
  constructor(private http: HttpClient) { }

  async list(): Promise<ApiCharacterListItem[]> {
    return await firstValueFrom(this.http.get<ApiCharacterListItem[]>(`${API_BASE_URL}/characters`));
  }

  async getSheet(id: number): Promise<ApiCharacterSheet> {
    return await firstValueFrom(this.http.get<ApiCharacterSheet>(`${API_BASE_URL}/characters/${id}/sheet`));
  }

  async create(payload: ApiCharacterCreateRequest): Promise<ApiCharacterSheet> {
    return await firstValueFrom(this.http.post<ApiCharacterSheet>(`${API_BASE_URL}/characters`, payload));
  }

  async update(id: number, payload: ApiCharacterUpdateRequest): Promise<void> {
    await firstValueFrom(this.http.put<void>(`${API_BASE_URL}/characters/${id}`, payload));
  }

  toUpdatePayload(sheet: CharacterSheet): ApiCharacterUpdateRequest {
    return {
      name: sheet.nome,
      player: sheet.jogador ?? null,
      level: sheet.nivel ?? null,
      raceId: sheet.racaId ? sheet.racaId : null,
      professionId: sheet.profissaoId ? sheet.profissaoId : null,

      eyes: sheet.caracteristicas.olhos ?? null,
      hair: sheet.caracteristicas.cabelo ?? null,
      skin: sheet.caracteristicas.pele ?? null,
      age: sheet.caracteristicas.idade ?? 0,
      weight: sheet.caracteristicas.peso ?? 0,
      height: sheet.caracteristicas.altura ?? 0,
      appearance: sheet.caracteristicas.aparencia ?? null,
      history: sheet.caracteristicas.historia ?? null,

      attAgi: sheet.atributos.values.AGILIDADE ?? 0,
      attPer: sheet.atributos.values.PERCEPCAO ?? 0,
      attInt: sheet.atributos.values.INTELECTO ?? 0,
      attAur: sheet.atributos.values.AURA ?? 0,
      attCar: sheet.atributos.values.CARISMA ?? 0,
      attFor: sheet.atributos.values.FORCA ?? 0,
      attFis: sheet.atributos.values.FISICO ?? 0,

      coinsCopper: sheet.dinheiro.cobre ?? 0,
      coinsSilver: sheet.dinheiro.prata ?? 0,
      coinsGold: sheet.dinheiro.ouro ?? 0,

      pointsSkill: sheet.pontos?.habilidade ?? 0,
      pointsWeapon: sheet.pontos?.arma ?? 0,
      pointsCombat: sheet.pontos?.combate ?? 0,
      pointsMagic: sheet.pontos?.magia ?? 0
    };
  }

  async addSkill(characterId: number, payload: ApiAddSkillRequest): Promise<void> {
    await firstValueFrom(this.http.post<void>(`${API_BASE_URL}/characters_skill/${characterId}/skills`, payload));
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
    await firstValueFrom(this.http.post<void>(`${API_BASE_URL}/characters_equipment/${characterId}/equipments`, {
      equipmentId,
      qty
    }));
  }

  async addSpell(characterId: number, spellId: number): Promise<void> {
    await firstValueFrom(this.http.post<void>(`${API_BASE_URL}/characters_spell/${characterId}/spells`, {
      spellId
    }));
  }

  async addCharacterization(characterId: number, characterizationId: number, level?: number): Promise<void> {
    await firstValueFrom(this.http.post<void>(`${API_BASE_URL}/characters_characterization/${characterId}/characterizations`, {
      characterizationId,
      level
    }));
  }

  // Busca as magias disponíveis para uma profissão específica
  getProfessionSpells(professionId: number) {
    return this.http.get<SpellFromGroup[]>(`${API_BASE_URL}/spells/views/${professionId}/spell_profession`);
  }

  // Busca as magias disponíveis para uma especialização específica
  getEspecializationSpells(especializationId: number) {
    return this.http.get<SpellFromGroup[]>(`${API_BASE_URL}/spells/views/${especializationId}/spell_especialization`);
  }

  // Adiciona uma magia ao personagem
  addCharacterSpell(characterId: number, spellId: number, spellGroupId: number, level: number, type: number) {
    // Assumindo que o payload espera o ID da magia. Ajuste conforme seu backend se necessário.
    return this.http.post<void>(`${API_BASE_URL}/characters/${characterId}/spells`, { spellId, spellGroupId, level, type });
  }

  mapListItem(item: ApiCharacterListItem): CharacterSheet {
    return {
      id: item.id,
      nome: item.name,
      nivel: item.level ?? 0,
      raca: item.race?.name ?? '',
      profissao: item.profession?.name ?? '',
      profissaoId: item.profession?.id ?? 0,
      racaId: item.race?.id ?? null,
      classeSocial: '',
      classeSocialId: 0,
      jogador: '',
      localidade: '',
      divindade: '',
      experiencia: 0,
      estagio: 0,
      especializacao: {
        id: 0,
        profissaoId: 0,
        magiaGrupoId: 0,
        combateGrupoId: 0,
        nome: ''
      },
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
      magias: { magiasProfissao: [], magiasEspecializacao: [] },
      combate: { tecnicasBasicas: [], tecnicasEspecializacao: [], tecnicasProfissao: [] },
      equipamentos: {
        armadura: { id: 0, grupoId: 0, nome: '', descricao: '', valor: 0 },
        escudo: { id: 0, grupoId: 0, nome: '', descricao: '', valor: 0 },
        capacete: { id: 0, grupoId: 0, nome: '', descricao: '', valor: 0 },
        armas: [],
        pertences: []
      },
      dinheiro: { cobre: 0, prata: 0, ouro: 0 },
      caracteristicas: {
        olhos: '',
        cabelo: '',
        pele: '',
        idade: 0,
        peso: 0,
        altura: 0,
        aparencia: '',
        historia: ''
      },
      caracterizacoes: [],
      equipamentosIniciais: [],
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

    const rawEquips = sheet.equipments ?? [];
    const rawSpells = sheet.spells ?? [];
    const rawCombat = sheet.combat ?? [];

    const mapEq = (e: typeof rawEquips[0]) => ({
      id: e.equipmentId,
      grupoId: e.groupid,
      nome: e.name,
      descricao: e.description,
      valor: e.price,
      isWeapon: e.isWeapon,
      isDefense: e.isDefense,
      isArmor: e.isArmor,
      isShield: e.isShield,
      isHelmet: e.isHelmet
    });

    const mapSpell = (e: typeof rawSpells[0]) => ({
      id: e.id,
      nome: e.name,
      descricao: e.description,
      efeitos: e.effects,
      evocacao: e.evocation ?? '',
      duracao: e.duration ?? '',
      nivel: e.level ?? 0,
      alcance: e.range ?? '',
      custo: e.cost,
      tipo: e.type
    });

    const mapCombat = (e: typeof rawCombat[0]) => ({
      id: e.combatId,
      nome: e.combatName,
      atributo: e.attributeCode ?? '',
      efeito: e.effect ?? '',
      observacoes: e.notes ?? '',
      requisições: e.requisite ?? '',
      quadroRolagem: e.rollTable,
      aprimoramento: e.improvement ?? '',
      profEspId: e.profEspId ?? 0,
      grupoCombateId: e.combatGroupId ?? 0,
      nomeGrupo: e.groupName ?? 0,
      categoriaId: e.categoryId ?? 0,
      categoria: e.categoryName ?? '',
      custo: e.cost,
      bonus: e.bonus,
      reducao: e.reduction,
      tipo: e.type,
      nivel: e.level ?? 0
    });

    const emptyEq = {
      id: 0,
      grupoId: 0,
      nome: '',
      descricao: '',
      valor: 0,
      isWeapon: 0,
      isDefense: 0,
      isArmor: 0,
      isShield: 0,
      isHelmet: 0
    };

    const armaduraItem = rawEquips.find(e => e.isArmor === 1);
    const escudoItem = rawEquips.find(e => e.isShield === 1);
    const capaceteItem = rawEquips.find(e => e.isHelmet === 1);
    const armas = rawEquips.filter(e => e.isWeapon === 1).map(mapEq);
    const pertences = rawEquips.filter(e => !e.isArmor && !e.isShield && !e.isHelmet && !e.isWeapon).map(mapEq)

    const tecnicasBasicas = rawCombat.filter(c => c.type === 1);
    const tecnicasProfissao = rawCombat.filter(c => c.type === 2);
    const tecnicasEspecializacao = rawCombat.filter(c => c.type === 3);

    const magiasProfissao = rawSpells.filter(c => c.type === 1);
    const magiasEspecializacao = rawSpells.filter(c => c.type === 2);

    return {
      id: sheet.id,
      nome: sheet.name,
      nivel: sheet.level ?? 0,
      jogador: sheet.player ?? '',
      imagem: sheet.imageFile ?? '',
      raca: sheet.race?.name ?? '',
      profissao: sheet.profession?.name ?? '',
      profissaoId: sheet.profession?.id ?? null,
      racaId: sheet.race?.id ?? null,
      classeSocial: sheet.classSocial?.name ?? '',
      classeSocialId: sheet.classSocial?.id ?? null,
      localidade: sheet.birthPlace?.name ?? '',
      divindade: sheet.deity?.name ?? '',
      experiencia: sheet.experience ?? 0,
      estagio: sheet.level ?? 0,
      especializacao: {
        id: sheet.specialization?.id ?? 0,
        nome: sheet.specialization?.name ?? '',
        descricao: sheet.specialization?.description ?? '',
        profissaoId: sheet.specialization?.professionId ?? 0,
        magiaGrupoId: sheet.specialization?.spellGroupId ?? 0,
        combateGrupoId: sheet.specialization?.combatGroupId ?? 0,
      },
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
      magias: {
        magiasProfissao: magiasProfissao.map(mapSpell),
        magiasEspecializacao: magiasEspecializacao.map(mapSpell)
      },
      combate: {
        tecnicasBasicas: tecnicasBasicas.map(mapCombat),
        tecnicasEspecializacao: tecnicasEspecializacao.map(mapCombat),
        tecnicasProfissao: tecnicasProfissao.map(mapCombat)
      },
      equipamentos: {
        armadura: armaduraItem ? mapEq(armaduraItem) : emptyEq,
        escudo: escudoItem ? mapEq(escudoItem) : emptyEq,
        capacete: capaceteItem ? mapEq(capaceteItem) : emptyEq,
        armas: armas,
        pertences: pertences,
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
      },
      dinheiro: {
        cobre: sheet.coins.copper ?? 0,
        prata: sheet.coins.silver ?? 0,
        ouro: sheet.coins.gold ?? 0
      },
      caracterizacoes: sheet.characterizations?.map(c => ({
        id: c.characterizationId,
        nome: c.name,
        caracterizacaoTipoId: c.characterizationTypeId ?? '',
        nomeTipo: c.nameType ?? '',
        caracterizacaoGrupoId: c.characterizationGroupId ?? '',
        nomeGrupo: c.nameGroup ?? '',
        descricao: c.description ?? '',
        obs: c.notes ?? '',
        localidade: c.placeId ?? 0,
        custo: c.cost ?? 0,
        inicio: c.isInitial ?? 0,
        raro: c.isRare ?? 0,
        permiteJogo: c.isAllowGame ?? 0,
        nivel: c.level ?? null
      })) ?? [],
      equipamentosIniciais: sheet.startingEquipments?.map(c => ({
        id: c.equipmentId,
        nome: c.name,
      })) ?? [],
      updatedAt: new Date().toISOString()
    };
  }

}
