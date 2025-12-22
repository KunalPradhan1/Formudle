import fs from 'fs'
import path from 'path'

export default function getRandom() {
    try {
        const filePath = path.join(process.cwd(), "data", "drivers.json");


        const fileData = fs.readFileSync(filePath, "utf8");

        const data = JSON.parse(fileData);

        if(Array.isArray(data) && data.length > 0){
            const ran = Math.floor(Math.random() * data.length);
            return data[ran];
        }

    }
    catch (error){
        console.error("Error occured in getRandom function", error);
        return null;
    }
}