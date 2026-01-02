import fs from 'fs'
import { endianness } from 'os';
import path from 'path'

const HISTORY_FILE = path.join(process.cwd(), "data", "history.json");

const recentDays = 3;

function todayDate() {
    const now = new Date();
    console.log(`today date ran ${now}`);
    return now.toISOString().split('T')[0];
}
function loadHISTORY_FILE(){
    try{

        if(fs.existsSync(HISTORY_FILE)){
            const data = fs.readFileSync(HISTORY_FILE, "utf8");

            if (data.trim() === '') {
                return {daily:[], lastUpdated: null};
            }

            return JSON.parse(data);
        }
        
    }
    catch (error) {
        console.error(` error occured in loading HISTORY_FILE: ${error}`);
    }

    return {daily:[], lastUpdated: null};
}

function saveHISTORY_FILE(hist){
    try{
        fs.writeFileSync(HISTORY_FILE, JSON.stringify(hist, null, 2), "utf8");

    }
    catch (error){
        console.error("Error with saving the HISTORY_FILE: ", error);

    }
}

function getRecentDrivers(hist){
    const recent = new Set();
    const today = new Date();

    hist.daily.forEach(entry => {

        const entryDate = new Date(entry.date);
        const daysDiff = Math.floor((today-entryDate)/(1000*60*60*24))

        if(daysDiff > 0 && daysDiff <= recentDays){
            recent.add(entry.driverId);
        }
        
    })

    return recent;
}





export default function getRandom() {
    try {
        const today = todayDate();

        const hist = loadHISTORY_FILE();

        const todayEntry = hist.daily.find(entry => entry.date === today);

        if(todayEntry){
            const filePath = path.join(process.cwd(), "data", "drivers.json");
            const fileData = fs.readFileSync(filePath, "utf8");
            const data = JSON.parse(fileData);

            const driver = data.find(d => d.id === todayEntry.driverId)

            if(driver){
                console.log(`returning the cached driver ${driver}`);
                return driver;

            }

        }

    

        const filePath = path.join(process.cwd(), "data", "drivers.json");


        const fileData = fs.readFileSync(filePath, "utf8");

        const data = JSON.parse(fileData);

        if(Array.isArray(data) && data.length === 0){
            return null;
        }


        const recentDrivers = getRecentDrivers(hist);

        const availableDrivers = data.filter(driver => !recentDrivers.has(driver.id));

        let selectionPool;
        if(availableDrivers.length > 0){
            selectionPool = availableDrivers;
        }   
        else{
            selectionPool = data;
        }
        const randIndex = Math.floor(Math.random() * selectionPool.length);

        const selectedDriver = selectionPool[randIndex];

        hist.daily.push({
            date: today,
            driverId: selectedDriver.id,
            driverName: selectedDriver.fullName
        })

        hist.lastUpdated = new Date().toISOString();
        saveHISTORY_FILE(hist);


        console.log(`the selected driver for ${today}: ${selectedDriver.fullName}`)
        console.log(`Recently used drivers (excluded):`, Array.from(recentDrivers));
        
        return selectedDriver;




    }
    catch (error){
        console.error("Error occured in getRandom function", error);
        return null;
    }
}