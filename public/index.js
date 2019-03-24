var htmlCollection = document.getElementsByTagName('td')
var boxes = []
var user_type
var user_id
var alert_div = document.getElementById('alert')
const numOfBoxes = 294
var hour_details = []
var non_register_alert = false
var first_load = true
var hours = []
var hours_id = []
var hours_price = []
var courts = []
var days = []
var lastDay
var lastCourt
var lastHour
var lastYear
var lastWeek
var lastStartId
var lastOwnerId

function getUserType() {
    axios.get('/get_user_type')

    .then(function(response) {
        console.log(response.data)
        var data = response.data
        try {
            user_type = data.user.type
            user_id = data.user.id
            console.log(user_type, user_id)
        }
        catch(error){
            console.log(error)
        }

        if(user_type != null && user_type != undefined) {
            login_logout = document.getElementById('logout');
            login_logout.style.display = 'block'
        } else {
            login_logout = document.getElementById('login');
            login_logout.style.display = 'block'
        }

    })
}
getUserType()

function get_hours_courts_days() {
    axios.get('/get_hours_courts_days')

    .then(function(response) {
        var data = response.data

        console.log(data)
        data[0].forEach(function(hour, index) {
            hours[index] = hour.val
            hours_id[index] = hour.id
            hours_price[index] = hour.price
        })
        data[1].forEach(function(court, index) {
            courts[index] = court.id
        })
        data[2].forEach(function(day, index) {
            days[index] = day.val
        })
    })
}

get_hours_courts_days()

function login_alert() {

    if(non_register_alert == true) {
        return
    } else {
        non_register_alert = true
    }

    var dark_bg = document.getElementById('dark_background')
    alert_div.style.display = 'block'
    dark_bg.style.display = 'block'
    dark_bg.addEventListener('click', function(){ 
        alert_div.style.display = 'none'
        dark_bg.style.display = 'none'
    })
}

function loadColors() {
    axios.get('/load_colors')
    
    .then(function (response) {
        var data = response.data

        for(var i = 0; i < data.length; i++) {
            boxes[i] = htmlCollection[i]
            var floor = Math.floor(i/21)
            var floor_42 = Math.floor((i%21)/3)
            if(floor >= 14) {
                floor = floor - 14
            }
            
            boxes[i].className = ""
            boxes[i].className = data[i - (21*floor) + (floor_42*42) + (floor*3) - (floor_42*3)].ho_val
            hour_details[i] = data[i - (21*floor) + (floor_42*42) + (floor*3) - (floor_42*3)]
        }
        /* if(first_load == true) {
            for(var i = 0; i < htmlCollection.length; i++) {
                boxes[i] = htmlCollection[i]
                boxes[i].className = ""
                boxes[i].className = values[i]
                first_load = false
            }
        }
        else {
            for(var i = 0; i < htmlCollection.length; i++) {
                boxes[i] = htmlCollection[i]
                boxes[i].style.transition = '1s'
                boxes[i].className = ""
                boxes[i].className = values[i]
            }
        }

        setTimeout(function() {
            boxes.forEach(function(box, index) {
                box.style.transition = '0s'
            })
        }, 1000) */   

        // transition td
        
        tdInRow = 21;
        var courtsEl = document.getElementById('courts')
        var courts = courtsEl.getElementsByTagName('th')
        var courtsEl2 = document.getElementById('courts2')
        var courts2 = courtsEl2.getElementsByTagName('th')
        console.log(courts)
        boxes.forEach(function(box, index) {

            if(user_type != null && user_type != undefined) {
                if(box.className == 'free') {
                    box.onclick = function() {
                        selectBox(box, index)
                    }
                }

                if(box.className == 'booked') {    
                    if(user_type == 'admin') {
                        box.style.cursor = 'pointer'
                        box.onclick = function() {
                            hourDetails(box, index)
                        }
                    } else if(hour_details[index].booked_by == user_id) {
                        box.style.cursor = 'pointer'
                        box.className = ""
                        box.className = "booked_owner"
                        box.onclick = function() {
                            hourDetails(box, index)
                        }
                    }
                } 
            } else {
                if(box.className == 'free') {
                    box.title = "Pro rezervaci se přihlaste"
                    if(non_register_alert == false) {
                        box.onclick = function() {
                            login_alert()
                        }
                    }
                }
            }

            var nbInRow = (index + 1) % (tdInRow)
            if(nbInRow === 0) {
                nbInRow = tdInRow
            }
            

            box.onmouseover = function() {
                courts[nbInRow].style.background = '#3F51B5'
                courts2[nbInRow].style.background = '#3F51B5'
            }
            box.onmouseleave = function() {
                courts[nbInRow].style.background = 'inherit'   
                courts2[nbInRow].style.background = 'inherit'   
            }
        })

    })
    
    .catch(function (error) {
        console.log(error);
    });
}

loadColors()
setInterval(function(){
    loadColors()
}, 60000)

function setWeeks() {
    var d = new Date()
    var week1 = document.getElementById('week1')
    var week2 = document.getElementById('week2')

    if(d.getDay() === 0) {
        d1 = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 6)
        var d2 = new Date(d.getFullYear(), d.getMonth(), d.getDate())
        var d3 = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)
        var d4 = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 7)
    }
    else {
        d1 = new Date(d.getFullYear(), d.getMonth(), d.getDate() - d.getDay() + 1)
        var d2 = new Date(d.getFullYear(), d.getMonth(), d.getDate() - d.getDay() + 7)
        var d3 = new Date(d.getFullYear(), d.getMonth(), d.getDate() - d.getDay() + 8)
        var d4 = new Date(d.getFullYear(), d.getMonth(), d.getDate() - d.getDay() + 14)
    }

    var date1_1 = d1.getDate() + "." + (d1.getMonth() + 1) + "." + d1.getFullYear()
    var date1_2 = d2.getDate() + "." + (d2.getMonth() + 1) + "." + d2.getFullYear()
    var date2_1 = d3.getDate() + "." + (d3.getMonth() + 1) + "." + d3.getFullYear()
    var date2_2 = d4.getDate() + "." + (d4.getMonth() + 1) + "." + d4.getFullYear()

    try {
        week1.innerHTML = date1_1 + " - " + date1_2
        week2.innerHTML = date2_1 + " - " + date2_2
    }
    catch(error) {}
}

setWeeks()

var wrapper = document.getElementById('swipe_layout_content')
var left_arrow = document.getElementById('left_arrow')
var right_arrow = document.getElementById('right_arrow')
var firstThead = document.getElementById('first_thead')
left_arrow.addEventListener('click', swipeRight)
right_arrow.addEventListener('click', swipeLeft)


function swipeLeft() {
    right_arrow.style.display = 'none'
    left_arrow.style.display = 'inline-block'
    wrapper.style.transform = "translateX(-50%)"
    firstThead.style.width = "50%"
}

function swipeRight() {
    right_arrow.style.display = 'inline-block'
    left_arrow.style.display = 'none'
    wrapper.style.transform = "translateX(0)"
}



function selectBox(box, index) {
    console.log(box, index)
    
    
    lastDay = hour_details[index].day
    day = lastDay - 1
    lastCourt = hour_details[index].court
    lastYear = hour_details[index].year
    lastWeek = hour_details[index].week
    
    hours_id.forEach(function(hour, i) {
        if(hour == hour_details[index].hour) {
            lastHour = i
        }
    })
    
    book_court_div = document.getElementById('book_court_div')
    dark_bg = document.getElementById('dark_background')
    close_book_court_button = document.getElementById('close_book_court_button')
    date = document.getElementById('date')
    select_hour_start = document.getElementById('select_hour_start')
    select_hour_end = document.getElementById('select_hour_end')
    book_court_button = document.getElementById('book_court_button')
    priceEl = document.getElementById('price')
    warning = document.getElementById('warning')

    priceEl.innerHTML = hours_price[lastHour]

    dark_bg.addEventListener('click', function() {
        book_court_div.style.display = 'none'
        dark_bg.style.display = 'none'
        warning.style.display = 'none'
        document.getElementById('note').value = ''
    })
    
    close_book_court_button.addEventListener('click', function() {
        book_court_div.style.display = 'none'
        dark_bg.style.display = 'none'
        warning.style.display = 'none'
        document.getElementById('note').value = ''
    })


    if(index < numOfBoxes) {
        var date_format = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate() + day)
    } else {
        var date_format = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate() + day + 7)
    }

    var day_month = date_format.getDate() + "." + (date_format.getMonth() + 1) + "."


    date.innerText = days[day] + " " + day_month  + " - " + "Kurt" + " " + lastCourt
    
    book_court_div.style.display = 'block'
    dark_bg.style.display = 'block'
    
    select_hour_start.selectedIndex = lastHour
    select_hour_end.selectedIndex = lastHour + 1

    changeHoursEnd()
    
}

function book_court() {

    book_hour_start = select_hour_start.selectedIndex
    book_hour_end = select_hour_end.selectedIndex

    var book_hours_num = book_hour_end - book_hour_start

    booked_time = hours[book_hour_start] + " - " + hours[book_hour_end]
    note = document.getElementById('note').value
    console.log(booked_time)

    axios.get('/check_court_status?year=' + lastYear + '&week=' + lastWeek + '&dayId=' + lastDay +'&courtId=' + lastCourt + '&bookHoursNum=' + book_hours_num + '&hoursIds=' + hours_id + '&hourId=' + lastHour)

    .then(function(response) {
        console.log(response.data)

        var data = response.data
        
        if(data.length != 0 && data.length == book_hours_num) {
            book_court_div.style.display = 'none'
            dark_bg.style.display = 'none'
            document.getElementById('note').value = ''

            for(var i = 0; i < data.length; i++) {         
                axios.get('/book_court?year=' + lastYear + '&week=' + lastWeek + '&dayId=' + lastDay +'&courtId=' + lastCourt + '&bookHoursNum=' + book_hours_num + '&hoursIds=' + hours_id + '&hourId=' + lastHour + '&booked_time=' + booked_time +'&note=' + note + '&start_id=' + data[0].id)

                .then(function(response) {
                    console.log(response.data)

                    loadColors()
                })
            }


            /* location.reload() */
        } else {
            warning.style.display = 'block'
        }
    })
}

function changeHoursEnd() {
    console.log('spis ne')
    select_hour_end.selectedIndex = select_hour_start.selectedIndex + 1
    lastHour = select_hour_start.selectedIndex
    priceEl.innerHTML = hours_price[select_hour_start.selectedIndex]   

    for(var i = 0; i < select_hour_end.length; i++) {
        select_hour_end[i].disabled = false
        if(i <= select_hour_start.selectedIndex) {
            select_hour_end[i].disabled = true
        }
    }
}

function setPrice() {
    console.log('kkkk')
    var price = 0
    for(var i = select_hour_start.selectedIndex; i < select_hour_end.selectedIndex; i++) {
        price = price + hours_price[i]
    }
    priceEl.innerHTML = price
}


function hourDetails(box, index) {

    lastDay = hour_details[index].day // 1 - 7
    day = lastDay - 1 // 0 - 6
    lastCourt = hour_details[index].court
    lastHour = hour_details[index].hour
    lastYear = hour_details[index].year
    lastWeek = hour_details[index].week
    lastOwnerId = hour_details[index].booked_by

    details = document.getElementById('details')
    dark_bg = document.getElementById('dark_background')
    close_details_button = document.getElementById('close_details_button')
    date = document.getElementById('date_details')

    details.style.display = 'block'
    dark_bg.style.display = 'block'
    
    dark_bg.addEventListener('click', function() {
        details.style.display = 'none'
        dark_bg.style.display = 'none'
    })
    
    close_details_button.addEventListener('click', function() {
        details.style.display = 'none'
        dark_bg.style.display = 'none'
    })
    
    if(index < numOfBoxes) {
        var date_format = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate() + day)
    } else {
        var date_format = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate() + day + 7)
    }

    var day_month = date_format.getDate() + "." + date_format.getMonth() + "."

    date.innerText = days[day] + " " + day_month  + " - " + "Kurt" + " " + lastCourt

    axios.get('/hour_details?year=' + lastYear + '&week=' + lastWeek + '&dayId=' + lastDay +'&courtId=' + lastCourt + '&hourId=' + lastHour + '&userId=' + lastOwnerId)

    .then(function(response) {
        var data = response.data
        console.log(data)
        document.getElementById('details_user').innerText = data[0].first_name + " " + data[0].last_name
        document.getElementById('details_email').innerText = data[0].email
        document.getElementById('details_mob').innerText = data[0].mob_no
        document.getElementById('details_time').innerText = data[0].booked_time
        document.getElementById('details_note').innerText = data[0].note
        
        lastStartId = data[0].start_id
    })
}

function cancel_reservation() {
    
    axios.get('/cancel_reservation?year=' + lastYear + '&week=' + lastWeek + '&start_id=' + lastStartId + '&userId=' + lastOwnerId)

    .then(function(response) {
        var data = response.data

        console.log(data)

        loadColors()

        details = document.getElementById('details')
        dark_bg = document.getElementById('dark_background')
        details.style.display = 'none'
        dark_bg.style.display = 'none'
    })
}



// var countries = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua &amp; Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia &amp; Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Central Arfrican Republic","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cuba","Curacao","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kiribati","Kosovo","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Myanmar","Namibia","Nauro","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","North Korea","Norway","Oman","Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre &amp; Miquelon","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","St Kitts &amp; Nevis","St Lucia","St Vincent","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad &amp; Tobago","Tunisia","Turkey","Turkmenistan","Turks &amp; Caicos","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States of America","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];
// autocomplete(document.getElementById("myInput"), countries);
// function autocomplete(inp, arr) {
//     /*the autocomplete function takes two arguments,
//     the text field element and an array of possible autocompleted values:*/
//     var currentFocus;
//     /*execute a function when someone writes in the text field:*/
//     inp.addEventListener("input", function(e) {
//         var a, b, i, val = this.value;
//         /*close any already open lists of autocompleted values*/
//         closeAllLists();
//         if (!val) { return false;}
//         currentFocus = -1;
//         /*create a DIV element that will contain the items (values):*/
//         a = document.createElement("DIV");
//         a.setAttribute("id", this.id + "autocomplete-list");
//         a.setAttribute("class", "autocomplete-items");
//         /*append the DIV element as a child of the autocomplete container:*/
//         this.parentNode.appendChild(a);
//         /*for each item in the array...*/
//         for (i = 0; i < arr.length; i++) {
//           /*check if the item starts with the same letters as the text field value:*/
//           if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
//             /*create a DIV element for each matching element:*/
//             b = document.createElement("DIV");
//             /*make the matching letters bold:*/
//             b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
//             b.innerHTML += arr[i].substr(val.length);
//             /*insert a input field that will hold the current array item's value:*/
//             b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
//             /*execute a function when someone clicks on the item value (DIV element):*/
//                 b.addEventListener("click", function(e) {
//                 /*insert the value for the autocomplete text field:*/
//                 inp.value = this.getElementsByTagName("input")[0].value;
//                 /*close the list of autocompleted values,
//                 (or any other open lists of autocompleted values:*/
//                 closeAllLists();
//             });
//             a.appendChild(b);
//           }
//         }
//     });
//     /*execute a function presses a key on the keyboard:*/
//     inp.addEventListener("keydown", function(e) {
//         var x = document.getElementById(this.id + "autocomplete-list");
//         if (x) x = x.getElementsByTagName("div");
//         if (e.keyCode == 40) {
//           /*If the arrow DOWN key is pressed,
//           increase the currentFocus variable:*/
//           currentFocus++;
//           /*and and make the current item more visible:*/
//           addActive(x);
//         } else if (e.keyCode == 38) { //up
//           /*If the arrow UP key is pressed,
//           decrease the currentFocus variable:*/
//           currentFocus--;
//           /*and and make the current item more visible:*/
//           addActive(x);
//         } else if (e.keyCode == 13) {
//           /*If the ENTER key is pressed, prevent the form from being submitted,*/
//           e.preventDefault();
//           if (currentFocus > -1) {
//             /*and simulate a click on the "active" item:*/
//             if (x) x[currentFocus].click();
//           }
//         }
//     });
//     function addActive(x) {
//       /*a function to classify an item as "active":*/
//       if (!x) return false;
//       /*start by removing the "active" class on all items:*/
//       removeActive(x);
//       if (currentFocus >= x.length) currentFocus = 0;
//       if (currentFocus < 0) currentFocus = (x.length - 1);
//       /*add class "autocomplete-active":*/
//       x[currentFocus].classList.add("autocomplete-active");
//     }
//     function removeActive(x) {
//       /*a function to remove the "active" class from all autocomplete items:*/
//       for (var i = 0; i < x.length; i++) {
//         x[i].classList.remove("autocomplete-active");
//       }
//     }
//     function closeAllLists(elmnt) {
//       /*close all autocomplete lists in the document,
//       except the one passed as an argument:*/
//       var x = document.getElementsByClassName("autocomplete-items");
//       for (var i = 0; i < x.length; i++) {
//         if (elmnt != x[i] && elmnt != inp) {
//         x[i].parentNode.removeChild(x[i]);
//       }
//     }
//   }
//   /*execute a function when someone clicks in the document:*/
//   document.addEventListener("click", function (e) {
//       closeAllLists(e.target);
//   });
//   }