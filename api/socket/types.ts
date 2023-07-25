export type GearPreset = (speed: number) => GearPresetResult;
export type GearPresetResult = number | undefined;
export type GetMap = {username: string};
export type SetBooleanMap = {id: string, value: boolean};