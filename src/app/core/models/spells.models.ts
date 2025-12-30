export interface SpellGroup {
  id: number;
  name: string;
  parentId?: number | null;
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

export interface SpellGroupWithSpells {
  group: SpellGroup;
  spells: SpellFromGroup[];
}
