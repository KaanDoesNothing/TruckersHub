import { TRUCKERSMP_API, TruckersMP_krashnz, TRUCKERSMP_MAP } from "../constants.ts";
import { cacheInstance } from "../lib/cache.ts";
import { User } from "../lib/db.ts";

const cities = JSON.parse(await Deno.readTextFile("./assets/cities.json")).citiesList;
const citiesPromods = JSON.parse(await Deno.readTextFile("./assets/cities_promods.json")).citiesList;
citiesPromods.forEach((row: any) => cities.push(row));

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


const getServers = async () => {
    const res = await (await fetch(`${TruckersMP_krashnz}/servers`)).json();

    return res;
}

const getPlayer = async ({id}: {id: string}) => {
    const res = await (await fetch(`${TRUCKERSMP_API}/player/${id}`)).json();

    return res;
}

export const getPlayerLocation = async (username: string) => {
    const cache = await cacheInstance.get(`gamedata_${username}`);

    if(!cache) return {error: "User isn't online!"};

    const parsedCache = JSON.parse(cache);

    return {
        data: {
            x: parsedCache.truck.position.X,
            y: parsedCache.truck.position.Y,
            z: parsedCache.truck.position.Z
        }
    }
}

export const getPlayerServer = async (username: string) => {
    if(!username) return {error: "No username provided"};

    const playerSearch = await (await fetch(`${TRUCKERSMP_MAP}/playersearch?string=${username}`)).json().catch(err => console.log(err));
    const isOnline = playerSearch.Data?.filter((player: any) => player.Name === username)[0];
    const user = await User.findOne({"linked.truckersmp.name": username});
    const cache = await cacheInstance.get(`gamedata_${user?.username}`);

    if(user && cache && !isOnline) {
        const parsedCache = JSON.parse(cache);

        return {
            data: {
                player: {
                    username,
                    location: {
                        x: parsedCache.truck.position.X,
                        y: parsedCache.truck.position.Y,
                        z: parsedCache.truck.position.Z
                    }
                },
                server: {
                    singleplayer: true,
                    name: "Singeplayer"
                }
            }
        }
    }else if(isOnline) {
        const servers = await getServers();
        if(servers.error) {
            return {error: "Unknown"};
        }

        // let cityName = "";

        // if(cache) {
        //     const parsedCache = JSON.parse(cache);
        //     cityName = `${closestCity(parsedCache.truck.position)}`;
        // }

        const server = servers.servers.filter((server: any) => server.map === isOnline.ServerId)[0];

        return {
            data: {
                player: {
                    username: isOnline.Name,
                    id: isOnline.MpId,
                    game_id: isOnline.PlayerId,
                    location: {
                        x: isOnline.X,
                        y: isOnline.Y,
                        // city: cityName
                    }
                },
                server: {
                    ...server
                }
            }
        }
    }

    return {error: "Player isn't online!"};
}

// // export const getPlayerServerLocal = async (username: string) => {
// //     const user = await User.findOne({where: {truckersmp: {data: {username}}}, relations: {truckersmp: true}});
// // }