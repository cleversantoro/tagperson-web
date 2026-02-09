export interface EquipmentGroup {
  id: number;
  name: string;
}

export interface EquipmentFromGroup {
  id: number;
  name: string;
  description?: string | null;
  value?: number | null;
  groupId?: number | null;
}

export interface EquipmentGroupWithItems {
  group: EquipmentGroup;
  items: EquipmentFromGroup[];
}

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

export interface EquipmentLookup {
  id: number;
  name: string;
  isWeapon?: number | null;
  isDefense?: number | null;
  isArmor?: number | null;
  isShield?: number | null;
  isHelmet?: number | null;
}

export interface EquipmentBelongings {
  id: number;
  name: string;
  descriptio?: string | null;
  value?: number | null;
}
