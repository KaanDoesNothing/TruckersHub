import fs from "fs";

const cities = JSON.parse(fs.readFileSync("./cities.json", "utf-8")).citiesList;
const fuelPrices = {
    austria: 2.02,
    belgium: 1.90,
    bulgaria: 1.52,
    czech: 1.92,
    denmark: 2.11,
    estonia: 1.90,
    finland: 2.22,
    france: 1.15,
    germany: 2.18,
    hungary: 1.28,
    italy: 1.83,
    latvia: 1.83,
    lithuania: 1.78,
    luxembourg: 1.91,
    netherlands: 2.15,
    norway: 2.26,
    poland: 1.55,
    portugal: 2.00,
    romania: 1.70,
    russia: 0.51,
    slovakia: 1.69,
    spain: 1.85,
    sweden: 2.45,
    switzerland: 2.08,
    turkey: 1.46,
    uk: 2.11
};

export const closestCity = (player: {X: number, Y: number, Z: number}) => {
    function getDistance(city: any, player: {X: number, Y: number, Z: number}) {
        city = {
            x: parseInt(city.x),
            z: parseInt(city.z)
        }

        return Math.sqrt(Math.pow(city.x - player.X, 2) + Math.pow(city.z - player.Z, 2))
    }
    
    return cities.reduce((a: any, b: any) => getDistance(a, player) < getDistance(b, player) ? a : b);
}

export const fuelPrice = (country: string) => {
    //@ts-ignore
    return fuelPrices[country] || 0;
}