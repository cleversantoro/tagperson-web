export type Race = 'Humano' | 'Elfo' | 'Anão' | 'Meio-Elfo' | 'Halfling' | string;
export type Profession = 'Guerreiro' | 'Mago' | 'Ladino' | 'Sacerdote' | string;

export type AttributeKey =
  | 'AGILIDADE'
  | 'PERCEPCAO'
  | 'INTELECTO'
  | 'AURA'
  | 'CARISMA'
  | 'FORCA'
  | 'FISICO';

export interface Attributes {
  values: Record<AttributeKey, number>; // -4..+6 (igual a tela)
  pointsTotal: number;
  pointsUsed: number;
}

export interface CharacterPoints {
  habilidade: number;
  arma: number;
  combate: number;
  magia: number;
}

export interface DerivedStats {
  resistenciaFisica: number;
  resistenciaMagia: number;
  velocidade: number;
  karma: number;
  defesaAtiva: number;
  defesaPassiva: number;
  energiaFisicaAtual: number;
  energiaFisicaMax: number;
  energiaHeroica: number;
}

export interface Money {
  cobre: number;
  prata: number;
  ouro: number;
}

export interface SkillRow {
  id: number;
  nome: string;
  restrito?: boolean;
  nivel: number;
  ajuste: string; // ex: "INT", "AGI"...
  hasSpecialization?: boolean;
}

export interface SkillSpecializationRow {
  id: number;
  skillId: number;
  specializationId?: number | null;
  specialization?: string | null;
  nivel?: number | null;
}

export interface SpellRow {
  id: number;
  nome: string;
  nivel: number;
  custo: number;
  total: number;
  grupo: 'Basica' | 'Especializacao';
  evocacao?: string;
  alcance?: string;
  duracao?: string;
  efeitos?: string;
  descricao?: string;
}

export interface CombatState {
  armadura?: string;
  elmo?: string;
  escudo?: string;
  arma?: string;
  tecnicas?: Array<{ id: number; nivel: number }>;
  tecnicasBasicas: Array<{ nome: string; nivel: number; custo: number; ajuste: string; total: number; categoria: string }>;
  tecnicasEspecializacao: Array<{ nome: string; nivel: number; custo: number; ajuste: string; total: number; categoria: string }>;
  tecnicasRestritas: Array<{ nome: string; nivel: number; custo: number; ajuste: string; total: number; categoria: string }>;
}

export interface Traits {
  olhos?: string;
  cabelo?: string;
  pele?: string;
  idade?: number;
  peso?: number;
  altura?: number;
  aparencia?: string;
  personalidadeObjetivos?: string;
  historia?: string;
  pertences: Array<{ equipmentId: number; nome: string; descricao?: string; valor?: string; quantidade?: number }>;
  equipamentosIniciais: string[];
  dinheiro: Money;
}

export interface CharacterSheet {
  id: number;
  nome: string;
  nivel: number;

  jogador?: string;
  divindade?: string;

  raca: Race;
  racaId?: number | null;
  profissao: Profession;
  profissaoId?: number | null;
  classeSocial?: string;

  experiencia: number;
  estagio: number;
  especializacao?: string;

  atributos: Attributes;
  pontos?: CharacterPoints;
  derivados: DerivedStats;

  habilidades: SkillRow[];
  magias: SpellRow[];
  combate: CombatState;
  caracteristicas: Traits;

  updatedAt: string;
}
