const express = require("express");
const csv_parser = require("csv-parser");
const fs = require("fs");
const router = express.Router();

router.get("/population/state/:state/city/:city", async (req, res) => {
    
    // Setup variables
    const city = req.params.city.toLowerCase();
    const state = req.params.state.toLowerCase();
    const csv_URL = "./city_populations.csv"

    try {

        // Read through CSV
        const read_stream = fs.createReadStream(csv_URL)
        .pipe(csv_parser(["city", "state", "population"], { separator: "\n" }))
        .on("data", (row) => {  

            // Search for the location's population
            if (row["city"].toLowerCase() == city && row["state"].toLowerCase() == state) {
                res.status(200).json(JSON.stringify({population : row["population"]}));
                read_stream.destroy();
            }
        })

        // Handle responses
        .on("end", () => {
            res.status(400).json(JSON.stringify("Population not found"));
        });
    } catch (error) {
        res.status(500).json(JSON.stringify({code : 500}));
    }

});

router.post("/population/state/:state/city/:city", async(req, res) => {
    
    // Setup variables
    const city = req.params.city.toLowerCase();
    const state = req.params.state.toLowerCase();
    const pop = req.body.population;
    const csv_URL = "./city_populations.csv"

    const results = [];
    const updated = [];


    // Rebuild csv with updated or new location
    try {
        
        // Read through CSV
        fs.createReadStream(csv_URL)
        .pipe(csv_parser(["city", "state", "population"], { separator: "\n" }))
        .on("data", (row) => {
            
            // Search for the location's population to update
            if (row["city"].toLowerCase() == city && row["state"].toLowerCase() == state) {
                results.push([row["city"], row["state"], pop]);
                updated.push(pop);
            } else
                results.push([row["city"], row["state"], row["population"]]);
        })
        .on("end", () => {

            //  Write to CSV file
            let writer = fs.createWriteStream(csv_URL);
            writer.write(results.map(row => Object.values(row).join(",")).join("\n"));

            // Handle responses
            if (updated.length > 0) {
                writer.write(results.map(row => Object.values(row).join(",")).join("\n"));
                res.status(200).json(JSON.stringify({code : 200}));
            } else {
                results.push([city, state, pop]);
                writer.write(results.map(row => Object.values(row).join(",")).join("\n"));
                res.status(201).json(JSON.stringify({code : 201}));
            }
        });
    } catch (error) {
        res.status(500).json(JSON.stringify({code : 500}));
    }
});

module.exports = router;