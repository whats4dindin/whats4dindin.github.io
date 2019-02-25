
const datePicker = $("#date-picker");
const buildingPicker = $("#building-picker");
const yesterdayButton = $("#yesterday");
const tomorrowButton = $("#tomorrow");
const wadsBtm = $("#wads");
const mcnairBtm = $("#mcnair");
const dhhBtm = $("#dhh");

const weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

let buildingMenu = undefined;

datePicker.on("change", () => onDateChange(datePicker.val()));
buildingPicker.on("change", () => onBuildingChange(buildingPicker.val()));
wadsBtm.on("click", () => {
    onBuildingChange(wadsBtm.val());
});
mcnairBtm.on("click", () => {
    onBuildingChange(mcnairBtm.val());
});
dhhBtm.on("click", () => {
    onBuildingChange(dhhBtm.val());
});
yesterdayButton.on("click", () => {
    let date = datePicker.datepicker("getDate");
    date.setDate(date.getDate() - 1);
    datePicker.datepicker("setDate", date);
    onDateChange(date);
});
tomorrowButton.on("click", () => {
    let date = datePicker.datepicker("getDate");
    date.setDate(date.getDate() + 1);
    datePicker.datepicker("setDate", date);
    onDateChange(date);
});

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

    $("#dayofweek").text(weekdays[date.getDay()])

    if (!buildingMenu) {
        return;
    }
    $(".loading").hide();
    $(".menu").show();
    $(".menu-row").remove();

    let weekNum = Math.floor(calendarDays(new Date(2019, 0, 14), date) / 7);
    console.log(weekNum)
    if (weekNum === 8) {
        noData();
        return;
    }
    if (weekNum > 8) {
        weekNum--;
    }

    weekday = ((date.getDay() - 1) + 7) % 7;
    const dayMenu = buildingMenu[weekNum][weekday];

    const maxLength = Math.max(dayMenu.breakfast.length, dayMenu.lunch.length, dayMenu.dinner.length);
    for (let i = 0; i < maxLength; i++) {
        $(".menu").append($("<tr>").addClass("menu-row").append(
            $("<td>").text(dayMenu.breakfast[i] || ""),
            $("<td>").text(dayMenu.lunch[i] || ""),
            $("<td>").text(dayMenu.dinner[i] || "")
        ));
    }

    if (maxLength === 0 || (maxLength === 1 && dayMenu.breakfast[0] === "")) {
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
    if (date instanceof Date) {
        return date;
    }

    let sections = date.split("/");
    if (sections.length != 3) {
        throw new Error("sections length must be 3");
    }

    let retVal = new Date(parseInt(sections[2], 10), parseInt(sections[0], 10)-1, parseInt(sections[1], 10))
    return retVal;
}

function calendarDays(start, end) {
    let cur = new Date(start.getYear(), start.getMonth(), start.getDate());
    let stop = new Date(end.getYear(), end.getMonth(), end.getDate());
    let days = 0;
    while (cur < stop) {
        cur.setDate(cur.getDate()+1);
        days++;
    }

    return days;
}
