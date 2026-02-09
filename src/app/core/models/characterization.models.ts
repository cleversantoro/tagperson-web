export interface CharacterizationType {
  id: number;
  name: string;
  description?: string;
  displayOrder?: number;
}

export interface CharacterizationGroup {
  id: number;
  name: string;
  characterizationTypeId: number;
  displayOrder?: number;
}

export interface CharacterizationItem {
  id: number;
  characterizationTypeId?: number;
  characterizationGroupId?: number;
  placeId?: number;
  name: string;
  description?: string;
  notes?: string;
  cost?: number;
  isInitial?: number;
  isRare?: number;
  isAllowGame?: number;
}

/*****Caracterização*****/
export interface CharacterizationRow {
  id: number;
  nome: string;
  caracterizacaoTipoId?: number;
  nomeTipo?: string;
  caracterizacaoGrupoId?: number;
  nomeGrupo?: string;
  descricao?: string;
  obs?: string;
  localidade?: number;
  custo?: number;
  inicio?: number;
  raro?: number;
  permiteJogo?: number;
  nivel?: number | null;
}
