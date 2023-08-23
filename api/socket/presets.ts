import { GearPreset, GearPresetResult } from "./types.ts";

export const presets = {
    trailer: (speed: number): GearPresetResult => {
        if(speed > 95) {
            return 14;
        }else if(speed > 75) {
            return 13;
        } else if(speed > 60) {
            return 12;
        }else if(speed > 50) {
            return 11;
        }else if(speed > 30) {
            return 10;
        }else if(speed > 20) {
            return 8;
        }else if(speed > 10) {
            return 6;
        }else if(speed > 0) {
            return 4;
        }
    },
    no_trailer: (speed: number): GearPresetResult => {
        if(speed > 95) {
            return 14;
        }
        
        if(speed > 75) {
            return 13;
        }

        if(speed > 45) {
            return 12;
        }

        if(speed > 20) {
            return 10;
        }

        if(speed > 0) {
            return 6;
        }
    }
}

export const presetHandler = (gameData: any): GearPreset => {
    let presetToUse = "no_trailer";

    if(gameData.trailer.attached) presetToUse = "trailer";

    const preset: GearPreset = (presets as any)[presetToUse];

    return preset;
}