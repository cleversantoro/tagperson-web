export type Race = 'Humano' | 'Pequenino' | 'Anão' | 'Elfo Florestal' | 'Elfo Dourado' | 'Meio Elfo' | string;
export type Profession = 'Guerreiro' | 'Ladino' | 'Sacerdote' | 'Mago' | 'Rastreador' | 'Bardo' | string;
export type AttributeKey = 'AGILIDADE' | 'PERCEPCAO' | 'INTELECTO' | 'AURA' | 'CARISMA' | 'FORCA' | 'FISICO';
export type SocialClass = 'Alta nobreza' | 'Artífice' | 'Baixa nobreza' | 'Ex-escravo' | 'Ex-servo' | 'Grande comerciante' | 'Livre' | 'Pequeno comerciante' | string;

export interface Attributes {
  values: Record<AttributeKey, number>; // -4..+6 (igual a tela)
  pointsTotal: number;
  pointsUsed: number;
}

export interface Specialization {
  id: number;
  profissaoId: number;
  magiaGrupoId: number;
  combateGrupoId: number;
  nome: string;
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

export interface CharacterizationRow {
  id: number;
  nome: string;
  nivel?: number | null;
}

export interface StartingEquipments {
  nome: string;
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
  pertences: Array<{ equipmentId: number; nome: string; quantidade?: number }>;
  dinheiro: Money;
}

export interface CharacterSheet {
  id: number;
  nome: string;
  nivel: number;
  imagem?: string;

  jogador?: string;
  divindade?: string;
  localidade?: string;

  olhos?: string;
  cabelo?: string;
  pele?: string;
  idade?: number;
  peso?: number;
  altura?: number;
  aparencia?: string;
  historia?: string;

  raca: Race;
  racaId?: number | null;
  profissao: Profession;
  profissaoId?: number | null;
  classeSocial: SocialClass;
  classeSocialId?: number | null;

  experiencia: number;
  estagio: number;

  especializacao?: Specialization;
  atributos: Attributes;
  pontos?: CharacterPoints;
  derivados: DerivedStats;

  habilidades: SkillRow[];
  magias: SpellRow[];
  combate: CombatState;
  caracteristicas: Traits;
  caracterizacoes: CharacterizationRow[];
  equipamentosIniciais: StartingEquipments[];

  updatedAt: string;
}
