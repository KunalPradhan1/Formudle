import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabaseClient'
import { get } from 'http';

const HISTORY_FILE = path.join(process.cwd(), "data", "history.json");
const DRIVERS_FILE = path.join(process.cwd(), "data", "drivers.json");

const recentDays = 3;

interface Driver {
    id: string;
    fullName: string;
    [key: string]: any;
}

interface HistoryEntry {
    date: string;
    driverId: string;
}

interface History {
    daily: HistoryEntry[];
}

function todayDate(): string {
    const now = new Date();
    const pstDate = new Date(now.toLocaleString('en-US', {timeZone: 'America/Los_Angeles'}));
    
    const year = pstDate.getFullYear();
    const month = String(pstDate.getMonth() + 1).padStart(2, '0');
    const day = String(pstDate.getDate()).padStart(2, '0');
    
    const dateStr = `${year}-${month}-${day}`;
    console.log(`today date ran ${dateStr} (PST)`);
    return dateStr;
}

async function loadHistory(): Promise<History> {
    try {
        const {data:rows, error} = await supabase.from('History').select('id,Date').order('Date', {ascending: false});
        console.log(`from load history: ${rows}`)
        if(error){
            console.error(`error occurred in loading HISTORY: ${error}`);
            return { daily: [] };

        }

        const daily: HistoryEntry[] = rows?.map((row:any)=>({
            date: row.Date,
            driverId: row.id,
        })) || [];
        console.log(`daily: ${daily}`)
        return {daily}
    } catch (error) {
        console.error(`error occurred in loading HISTORY: ${error}`);
        return { daily: [] };
    }

}

async function saveHistory(driverId: string, date:string) {
    try {
        const {error} = await supabase.from('History').insert({id: driverId, Date: date});
        if(error){
            console.error("Error saving history", error);
        }
        console.log(`driver is saved to history ${driverId}`)
    } catch (error) {
        console.error("Error with saving the HISTORY_FILE: ", error);
    }
}

function getRecentDrivers(hist: History): Set<string> {
    const recent = new Set<string>();
    const now = new Date();
    const today = new Date(now.toLocaleString('en-US', {timeZone: 'America/Los_Angeles'}))
    today.setHours(0,0,0,0);

    hist.daily.forEach(entry => {
        const entryDate = new Date(entry.date);
        entryDate.setHours(0,0,0,0);
        const daysDiff = Math.floor((today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));

        if (daysDiff > 0 && daysDiff <= recentDays) {
            recent.add(entry.driverId);
        }
    });

    return recent;
}

export default async function getRandom(): Promise<Driver | null> {
    try {
        const today = todayDate();
        const hist = await loadHistory();

        // Check if we already have a driver for today
        const todayEntry = hist.daily.find(entry => entry.date === today);



        if (todayEntry) {


            const driver = await getDriverById(todayEntry.driverId);

            if (driver) {
                console.log(`returning the cached driver ${driver.fullName}`);
                return driver;
            }
        }

        // Load all drivers
        const allDrivers = await getAllDrivers();


        // Get recently used drivers
        const recentDrivers = getRecentDrivers(hist);

        // Filter out recent drivers
        const availableDrivers = allDrivers.filter(driver => !recentDrivers.has(driver.id));

        let selectionPool: Driver[];
        if (availableDrivers.length > 0) {
            selectionPool = availableDrivers;
        } else {
            selectionPool = allDrivers;
        }

        // Select random driver
        const randIndex = Math.floor(Math.random() * selectionPool.length);
        const selectedDriver = selectionPool[randIndex];

        // Save to history
        

        await saveHistory(selectedDriver.id, today);

        console.log(`the selected driver for ${today}: ${selectedDriver.fullName}`);
        console.log(`Recently used drivers (excluded):`, Array.from(recentDrivers));

        return selectedDriver;

    } catch (error) {
        console.error("Error occurred in getRandom function", error);
        return null;
    }
}

export async function getAllDrivers(): Promise<Driver[]> {
    try {
        //const {data: rows, error} = supabase.from("Drivers").select('data');
        // const fileData = fs.readFileSync(DRIVERS_FILE, "utf8");
        // const data: Driver[] = JSON.parse(fileData);
        // console.log(data);
        // return data;

        const { data: rows, error } = await supabase
            .from("Drivers")
            .select('data');

        if (error) {
            console.error("Supabase error:", error);
            return [];
        }

        // Extract the 'data' property from each row
        
        const drivers: Driver[] = rows?.map((row: any) => row.data) || [];
        //console.log(drivers);
        return drivers;
    } catch (error) {
        console.error("Error loading drivers:", error);
        return [];
    }
}

async function getDriverById(driverID : string): Promise<Driver | null>{
    try{

        const {data: rows, error} = await supabase.from("Drivers").select("data").eq('id', driverID).single();
        if(error){
            console.error("Error in getDriverById with supabase: ", error);
            return null;
        }

        return rows?.data || null
    }
    catch(error){
        console.error("Error in getDriverById: ", error);
        return null;
    }
}
