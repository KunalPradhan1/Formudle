import getRandom from "./random.js";
import express from "express"
import cors from "cors"



const app = express();

const PORT = 8080;

app.use(cors());

app.get("/api/home", (req,res) =>{
    res.json({message: "hello world from kunal"});
});


app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
})


app.get("/random", (req, res) => {
    const driver = getRandom();

    console.log(`this is the driver chosen from getRandom ${driver}`);
    res.json(driver)
})
