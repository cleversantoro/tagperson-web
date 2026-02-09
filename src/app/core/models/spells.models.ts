export interface SpellGroup {
  id: number;
  name: string;
  parentId?: number | null;
  profession:number | null;
  especialization:number | null;
}

export interface SpellFromGroup {
  id: number;
  name: string;
  cost?: number | null;
  evocation?: string | null;
  range?: string | null;
  duration?: string | null;
  description?: string | null;
  effects?: string | null;
}

export interface SpellTechniquesDto {
  id: number ,
  name: string,
  profEspId?: number | null,
  spellGroupId?: number | null,
  groupName?: string | null,
  description?: string | null,
  evocation?: string | null,
  range?: string | null,
  duration?: string | null,
  effects?: string | null,
  cost?: number | null
}

export interface SpellGroupWithSpells {
  group: SpellGroup;
  spells: SpellFromGroup[];
}

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
