export interface EquipmentLookup {
  id: number;
  name: string;
  isWeapon?: number | null;
  isDefense?: number | null;
  isArmor?: number | null;
  isShield?: number | null;
  isHelmet?: number | null;
}

export interface CategoryLookup {
  id: number;
  name: string;
  icon?: string | null;
}

export interface SkillGroup {
  id: number;
  name: string;
  parentId?: number | null;
}

export interface SkillFromGroup {
  id: number;
  name: string;
  cost?: number | null;
  bonus?: number | null;
  hasSpecialization?: number | null;
  restricted?: number | null;
  attributeCode?: string | null;
}

export interface SkillGroupWithSkills {
  group: SkillGroup;
  skills: SkillFromGroup[];
}
