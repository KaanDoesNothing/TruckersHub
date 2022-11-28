export type GearPreset = (speed: number) => GearPresetResult;
export type GearPresetResult = number | undefined;
export type GetMap = {id: string};
export type SetBooleanMap = {id: string, value: boolean};