
const csv = require("csv-parse");
const fs = require("fs");

const weeks = [];
let weeksDone = 0;

for (let i = 1; i <= 15; i++) {
    const iFinal = i;

    parseFile(iFinal).then(data => {
        weeks[iFinal-1] = data;
        weeksDone++;
        if (weeksDone == 15) {
            fs.writeFile("wads.json", JSON.stringify(weeks), () => { console.log("done") })
        }

    }).catch((err) => {
        console.log("=== ERROR ===")
        console.log(err);
        console.log("=============")
    });
}

function parseFile(fileNum) {

    return new Promise(function(resolve, reject) {

        const parser = new csv.Parser({ delimiter: "," });

        let rowNum = 0;
        let weekData = [];
        
        parser.on('readable', function(){
            let record;
            while (record = parser.read()) {
                for (const colIndex in record) {
                    let dayData = weekData[colIndex] || {};
                    const col = record[colIndex];

                    switch (rowNum) {
                        case 0:
                            dayData.day = col;
                            break;
                        case 1:
                            dayData.breakfast = col;
                            break;
                        case 2:
                            dayData.lunch = col;
                            break;
                        case 3:
                            dayData.dinner = col;
                            break;
                        default:
                            console.log("invalid rowNum encountered: " + rowNum);
                    }
                    weekData[colIndex] = dayData;
                }
    
                rowNum++;
            }
        });
        // Catch any error
        parser.on('error', function(err){
            reject(err);
        });

        parser.on('end', function() {
            resolve(weekData);
        })
    
        fs.createReadStream("tabula-week-"+fileNum+".csv").pipe(parser);

    });


}


for (let i = 1; i <= 1; i++) {

    

}
