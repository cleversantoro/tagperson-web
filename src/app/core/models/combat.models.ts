export interface CombatGroup {
  id: number;
  name: string;
  parentId?: number | null;
  //tecnica?: string | null;
}

export interface CombatFromGroup {
  id: number;
  name: string;
  cost?: number | null;
  bonus?: number | null;
  hasSpecialization?: number | null;
  attributeCode?: string | null;
  categoryId?: number | null;
}

export interface CombatGroupWithItems {
  group: CombatGroup;
  items: CombatFromGroup[];
}
