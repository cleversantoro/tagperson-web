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
  nome: string;
  descricao?: string;
  profissaoId: number;
  magiaGrupoId: number;
  combateGrupoId: number;
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

/*****Habilidade*****/
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

/*****Equipamento*****/
export interface EquipmentRow {
  id: number;
  grupoId: number;
  nome: string;
  descricao: string;
  valor: number;
}

export interface EquipmentState {
  armadura: EquipmentRow;
  escudo: EquipmentRow;
  capacete: EquipmentRow;
  armas?: EquipmentRow[]
  pertences?: EquipmentRow[]
}

/*****Magia*****/
export interface SpellRow {
  id: number;
  nome: string;
  descricao?: string;
  evocacao?: string;
  alcance?: string;
  duracao?: string;
  efeitos?: string;
  custo: number;
  nivel: number;
  tipo?: number | null
  //total: number
}

export interface SpellState {
  magiasProfissao?: SpellRow[];
  magiasEspecializacao?: SpellRow[];
}

/*****Combate*****/
export interface CombatRow {
  id: number;
  nome: string;
  atributo?: string;
  efeito?: string;
  observacoes?: string;
  requisicoes?: string;
  quadroRolagem: string;
  aprimoramento?: string;
  ProfEspId?: number;
  GrupoCombateId?: number;
  nomeGrupo?: number;
  categoriaId?: number;
  categoria?: string;
  custo: number;
  bonus?: number;
  reducao?: number;
  tipo?: number;
  nivel?: number;
  //ajuste: string;
  //total: number;
}

export interface CombatState {
  tecnicasBasicas?: CombatRow[];
  tecnicasEspecializacao?: CombatRow[];
  tecnicasProfissao?: CombatRow[];
}

export interface CharacterizationRow {
  id: number;
  nome: string;
  nivel?: number | null;
}

export interface StartingEquipments {
  id: number;
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
  historia?: string;
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

  updatedAt: string;
}
