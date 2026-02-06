export interface CombatGroup {
  id: number;
  name: string;
  parentId?: number | null;
  //tecnica?: string | null;
}

export interface CombatFromGroup {
  // id: number;
  // name: string;
  // cost?: number | null;
  // bonus?: number | null;
  // hasSpecialization?: number | null;
  // attributeCode?: string | null;
  // categoryId?: number | null;
  // effect?: string | null;
  // improvement?: string | null;
  // notes?: string | null;
  // reduction?: number | null;
  // requisite?: string | null;
  // rollTable?: number | null;

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
