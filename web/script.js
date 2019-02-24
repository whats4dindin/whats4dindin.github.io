
const datePicker = $("#date-picker");
const buildingPicker = $("#building-picker");

let buildingMenu = undefined;

datePicker.on("change", () => onDateChange(datePicker.val()));
buildingPicker.on("change", () => onBuildingChange(buildingPicker.val()))

datePicker.datepicker();
datePicker.datepicker("setDate", new Date());
datePicker.datepicker({
    minDate: new Date(2019, 0, 14),
    maxDate: new Date(2019, 4, 4)
});

onDateChange(datePicker.val());
onBuildingChange(buildingPicker.val());


function onDateChange(date) {
    date = parseDate(date); // transform date into an actual Date object
    if (!buildingMenu) {
        return;
    }
    $(".loading").hide();
    $(".menu").show();
    $(".menu-row").remove();

    let weekNum = Math.floor((date - new Date(2019, 0, 14)) / (1000*60*60*24*7));
    if (weekNum == 9) {
        noData();
        return;
    }
    if (weekNum > 9) {
        weekNum--;
    }

    weekday = ((date.getDay() - 1) + 7) % 7;
    console.log(buildingMenu);
    console.log(weekNum)
    const dayMenu = buildingMenu[weekNum][weekday];

    const maxLength = Math.max(dayMenu.breakfast.length, dayMenu.lunch.length, dayMenu.dinner.length);
    for (let i = 0; i < maxLength; i++) {
        $(".menu").append($("<tr>").addClass("menu-row").append(
            $("<td>").text(dayMenu.breakfast[i] || ""),
            $("<td>").text(dayMenu.lunch[i] || ""),
            $("<td>").text(dayMenu.dinner[i] || "")
        ));
    }

    if (maxLength === 1 && dayMenu.breakfast[0] === "") {
        noData()
    }
}

function noData() {
    $(".menu-row").remove();
    $(".menu").append(
        $("<tr>").addClass("menu-row").append("<td colspan='3'>No data available</td>")
    )
}

async function onBuildingChange(building) {
    console.log(building)

    $(".menu").hide();
    $(".loading").show();
    $(".menurow").remove();
    
    const res = await fetch("data/"+building+"/data.json");
    buildingMenu = await res.json();

    onDateChange(datePicker.val())
}

// parses date in format mm/dd/yyyy
function parseDate(date) {
    console.log(date)

    let sections = date.split("/");
    if (sections.length != 3) {
        throw new Error("sections length must be 3");
    }

    let retVal = new Date(parseInt(sections[2], 10), parseInt(sections[0], 10)-1, parseInt(sections[1], 10))
    return retVal;
}
