/*****Habilidade - Especializações*****/
export interface SkillSpecializationRow {
  id: number;
  skillId: number;
  specializationId?: number | null;
  specialization?: string | null;
  nivel?: number | null;
}

export interface SkillRow {
  id: number;
  nome: string;
  restrito?: boolean;
  nivel: number;
  ajuste: string; // ex: "INT", "AGI"...
  hasSpecialization?: boolean;
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

export interface SkillSpecializationSuggestion {
  id: number;
  skillId: number;
  suggestion?: string | null;
}
