import fs from "fs";
import { TRUCKERSMP_API, TruckersMP_krashnz, TRUCKERSMP_MAP } from "../constants";
import {redis} from "../cache";
import { User } from "../db/entities/user";
import { Raw } from "typeorm";

const cities = JSON.parse(fs.readFileSync("./cities.json", "utf-8")).citiesList;
const citiesPromods = JSON.parse(fs.readFileSync("./cities_promods.json", "utf-8")).citiesList;
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

export const getPlayerServer = async (username: string) => {
    if(!username) return {error: "No username provided"};

    const playerSearch = await (await fetch(`${TRUCKERSMP_MAP}/playersearch?string=${username}`)).json();
    const isOnline = playerSearch.Data?.filter((player: any) => player.Name === username)[0];
    const user = await User.findOne({where: {truckersmp: {data: Raw(alias => `JSON_EXTRACT(${alias}, '$.name') = :username`, {username})}}, relations: {truckersmp: true}});
    const cache = await redis.get(`gamedata_${user?.username}`);

    console.log(typeof isOnline, typeof user, typeof cache);

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

        const server = servers.servers.filter((server: any) => server.map === isOnline.ServerId)[0];

        return {
            data: {
                player: {
                    username: isOnline.Name,
                    id: isOnline.MpId,
                    game_id: isOnline.PlayerId,
                    location: {
                        x: isOnline.X,
                        y: isOnline.Y
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

// export const getPlayerServerLocal = async (username: string) => {
//     const user = await User.findOne({where: {truckersmp: {data: {username}}}, relations: {truckersmp: true}});
// }