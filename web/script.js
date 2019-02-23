n =  new Date();
y = n.getFullYear();
m = n.getMonth() + 1;
d = n.getDate();

var weekday = new Array(7);
weekday[0] = "Monday";
weekday[1] = "Tuesday";
weekday[2] = "Wednesday";
weekday[3] = "Thursday";
weekday[4] = "Friday";
weekday[5] = "Saturday";
weekday[6] =  "Sunday";

day = weekday[n.getDay()];

document.getElementById("date").innerHTML = "Today is: " + day + " " + m + "/" + d + "/" + y;