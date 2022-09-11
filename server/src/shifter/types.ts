export type GearPreset = (speed: number) => GearPresetResult;
export type GearPresetResult = number | undefined;