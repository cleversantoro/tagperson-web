import { CharacterizationRow } from "./characterization.models";
import { CombatState } from "./combat.models";
import { EquipmentState } from "./equipment.models";
import { SkillRow } from "./skills.models";
import { SpellState } from "./spells.models";

export type Race = 'Humano' | 'Pequenino' | 'Anão' | 'Elfo Florestal' | 'Elfo Dourado' | 'Meio Elfo' | string;
export type Profession = 'Guerreiro' | 'Ladino' | 'Sacerdote' | 'Mago' | 'Rastreador' | 'Bardo' | string;
export type AttributeKey = 'AGILIDADE' | 'PERCEPCAO' | 'INTELECTO' | 'AURA' | 'CARISMA' | 'FORCA' | 'FISICO';
export type SocialClass = 'Alta nobreza' | 'Artífice' | 'Baixa nobreza' | 'Ex-escravo' | 'Ex-servo' | 'Grande comerciante' | 'Livre' | 'Pequeno comerciante' | string;

/*****Atributos*****/
export interface Attributes {
  values: Record<AttributeKey, number>; // -4..+6 (igual a tela)
  pointsTotal: number;
  pointsUsed: number;
}

/*****Especialização*****/
export interface Specialization {
  id: number;
  nome: string;
  descricao?: string;
  profissaoId: number;
  magiaGrupoId: number;
  combateGrupoId: number;
}

/*****Pontos*****/
export interface CharacterPoints {
  habilidade: number;
  arma: number;
  combate: number;
  magia: number;
}

/*****Derivados*****/
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

/*****Dinheiro*****/
export interface Money {
  cobre: number;
  prata: number;
  ouro: number;
}

/*****Equipamentos iniciais*****/
export interface StartingEquipments {
  id: number;
  nome: string;
}

/*****Características*****/
export interface Traits {
  olhos?: string;
  cabelo?: string;
  pele?: string;
  idade?: number;
  peso?: number;
  altura?: number;
  aparencia?: string;
  historia?: string;
}

/*******Ficha Personagem*******/
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
  dinheiro: Money;

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
  magias: SpellState;
  combate: CombatState;
  equipamentos: EquipmentState;
  caracteristicas: Traits;
  caracterizacoes: CharacterizationRow[];
  equipamentosIniciais: StartingEquipments[];
}
