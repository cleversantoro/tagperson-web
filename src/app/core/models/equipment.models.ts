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
