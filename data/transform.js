
const csv = require("csv-parse");
const fs = require("fs");

const weeks = [];
let weeksDone = 0;

for (let i = 1; i <= 15; i++) {
    const iFinal = i;

    parseFile("dhh/tabula-dhh-week-"+iFinal+".csv").then(data => {
        weeks[iFinal-1] = data;
        weeksDone++;
        if (weeksDone == 15) {
            fs.writeFile("dhh/data.json", JSON.stringify(weeks), () => { console.log("done") })
        }

    }).catch((err) => {
        console.log("=== ERROR ===")
        console.log(err);
        console.log("=============")
    });
}

function parseFile(fileName) {

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
                            dayData.breakfast = parseItems(col);
                            break;
                        case 2:
                            dayData.lunch = parseItems(col);
                            break;
                        case 3:
                            dayData.dinner = parseItems(col);
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
    
        fs.createReadStream(fileName).pipe(parser);

    });


}


function parseItems(items) {
    
    items = items.replace(/brunch/gi, "");
    if (items.charAt(0) == "\r") {
        items = items.substr(1);
    }
    
    let inParentheses = false;

    for (let i = 0; i < items.length; i++) {
        const char = items.charAt(i);
        if (char == "(") {
            inParentheses = true;
        }
        if (char == ")") {
            inParentheses = false;
        }
        if (char == "\r" && inParentheses) {
            items = items.substr(0, i) + items.substr(i+1, items.length);
        }
        if (char == "\r" && i < items.length - 1 && items.charAt(i+1) == "(") {
            items = items.substr(0, i) + items.substr(i+1, items.length);
        }
    }

    return items.split("\r");
}
