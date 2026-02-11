export interface CombatGroup {
  id: number;
  name: string;
  parentId?: number | null;
}

export interface CombatFromGroup {
  combatId?:  number ;
  combatName?: string;
  attributeCode?: string;
  effect?: string;
  notes?: string;
  requisite?: string;
  rollTable?: string;
  improvement?: string;
  profEspId?: number;
  combatGroupId?: number;
  groupName?: string;
  categoryId?: number;
  categoryName?: string;
  cost?: number;
  bonus?: number;
  reduction?: number;
  type?: number;
  level?: number;

}

export interface CombatGroupWithItems {
  group: CombatGroup;
  items: CombatFromGroup[];
}

export interface ApiAddCombatSkillRequest {
  combatSkillId: number;
  combatGroupId?: number | null;
  level?: number | null;
  type?: number | null;
}

export interface CombatRow {
  id: number;
  nome: string;
  atributo?: string;
  efeito?: string;
  observacoes?: string;
  requisicoes?: string;
  quadroRolagem: string;
  aprimoramento?: string;
  profEspId?: number;
  grupoCombateId?: number;
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
