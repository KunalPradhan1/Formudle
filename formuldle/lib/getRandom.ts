import fs from 'fs';
import path from 'path';

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
    driverName: string;
}

interface History {
    daily: HistoryEntry[];
    lastUpdated: string | null;
}

function todayDate(): string {
    const now = new Date();
    console.log(`today date ran ${now}`);
    return now.toISOString().split('T')[0];
}

function loadHistoryFile(): History {
    try {
        if (fs.existsSync(HISTORY_FILE)) {
            const data = fs.readFileSync(HISTORY_FILE, "utf8");

            if (data.trim() === '') {
                return { daily: [], lastUpdated: null };
            }

            return JSON.parse(data);
        }
    } catch (error) {
        console.error(`error occurred in loading HISTORY_FILE: ${error}`);
    }

    return { daily: [], lastUpdated: null };
}

function saveHistoryFile(hist: History): void {
    try {
        fs.writeFileSync(HISTORY_FILE, JSON.stringify(hist, null, 2), "utf8");
    } catch (error) {
        console.error("Error with saving the HISTORY_FILE: ", error);
    }
}

function getRecentDrivers(hist: History): Set<string> {
    const recent = new Set<string>();
    const today = new Date();

    hist.daily.forEach(entry => {
        const entryDate = new Date(entry.date);
        const daysDiff = Math.floor((today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));

        if (daysDiff > 0 && daysDiff <= recentDays) {
            recent.add(entry.driverId);
        }
    });

    return recent;
}

export default function getRandom(): Driver | null {
    try {
        const today = todayDate();
        const hist = loadHistoryFile();

        // Check if we already have a driver for today
        const todayEntry = hist.daily.find(entry => entry.date === today);

        if (todayEntry) {
            const fileData = fs.readFileSync(DRIVERS_FILE, "utf8");
            const data: Driver[] = JSON.parse(fileData);

            const driver = data.find(d => d.id === todayEntry.driverId);

            if (driver) {
                console.log(`returning the cached driver ${driver.fullName}`);
                return driver;
            }
        }

        // Load all drivers
        const fileData = fs.readFileSync(DRIVERS_FILE, "utf8");
        const data: Driver[] = JSON.parse(fileData);

        if (Array.isArray(data) && data.length === 0) {
            return null;
        }

        // Get recently used drivers
        const recentDrivers = getRecentDrivers(hist);

        // Filter out recent drivers
        const availableDrivers = data.filter(driver => !recentDrivers.has(driver.id));

        let selectionPool: Driver[];
        if (availableDrivers.length > 0) {
            selectionPool = availableDrivers;
        } else {
            selectionPool = data;
        }

        // Select random driver
        const randIndex = Math.floor(Math.random() * selectionPool.length);
        const selectedDriver = selectionPool[randIndex];

        // Save to history
        hist.daily.push({
            date: today,
            driverId: selectedDriver.id,
            driverName: selectedDriver.fullName
        });

        hist.lastUpdated = new Date().toISOString();
        saveHistoryFile(hist);

        console.log(`the selected driver for ${today}: ${selectedDriver.fullName}`);
        console.log(`Recently used drivers (excluded):`, Array.from(recentDrivers));

        return selectedDriver;

    } catch (error) {
        console.error("Error occurred in getRandom function", error);
        return null;
    }
}

export function getAllDrivers(): Driver[] {
    try {
        const fileData = fs.readFileSync(DRIVERS_FILE, "utf8");
        const data: Driver[] = JSON.parse(fileData);
        return data;
    } catch (error) {
        console.error("Error loading drivers:", error);
        return [];
    }
}
