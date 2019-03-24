var htmlCollection = document.getElementsByTagName('td')
var boxes = []
var user_type
var user_id
const numOfBoxes = 294
var hour_details = []
var hours = []
var hours_id = []
var courts = []
var days = []
var lastDay
var lastCourt
var lastHour
var lastYear
var lastWeek
var lastStartId
var d = new Date()
if(d.getDay() === 0) {
    d1 = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 6)
}
else {
    d1 = new Date(d.getFullYear(), d.getMonth(), d.getDate() - d.getDay() + 1)
}

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


function loadColors(){
    axios.get('/load_colors_booked')
    
    .then(function (response) {
        var data = response.data
        console.log(data)

        for(var i = 0; i < data.length; i++) {

            boxes[i] = htmlCollection[i]
            var floor = Math.floor(i/21)
            var floor_42 = Math.floor((i%21)/3)
            
            boxes[i].className = ""
            boxes[i].className = data[i - (21*floor) + (floor_42*42) + (floor*3) - (floor_42*3)].ho_val
            hour_details[i] = data[i - (21*floor) + (floor_42*42) + (floor*3) - (floor_42*3)]
        }

        tdInRow = 21;
        var courtsEl = document.getElementById('courts')
        var courts = courtsEl.getElementsByTagName('th')

        boxes.forEach(function(box, index) {
            if(box.className == 'free') {
                box.onclick = function() {
                    selectBox(box, index)
                }
            }

            if(box.className == 'booked') {    
                box.style.cursor = 'pointer'
                box.onclick = function() {
                    hourDetails(box, index)
                }
            }

            var nbInRow = (index + 1) % (tdInRow)
            if(nbInRow === 0) {
                nbInRow = tdInRow
            }     

            box.onmouseover = function() {
                courts[nbInRow].style.background = '#3F51B5'
            }
            box.onmouseleave = function() {
                courts[nbInRow].style.background = 'inherit'   
            }
        })
    })
    .catch(function (error) {
        console.log(error);
    });
}

loadColors()

function selectBox(box, index) {
    console.log(box, index)
    
    
    lastDay = hour_details[index].day
    day = lastDay - 1
    lastCourt = hour_details[index].court
    
    hours_id.forEach(function(hour, i) {
        if(hour == hour_details[index].hour) {
            lastHour = i
        }
    })
    
    console.log(lastDay, lastCourt, lastHour)
    console.log(hours_id)

    book_court_div = document.getElementById('book_court_div')
    dark_bg = document.getElementById('dark_background')
    close_book_court_button = document.getElementById('close_book_court_button')
    date = document.getElementById('date')
    select_hour_start = document.getElementById('select_hour_start')
    select_hour_end = document.getElementById('select_hour_end')
    book_court_button = document.getElementById('book_court_button')
    warning = document.getElementById('warning')


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

    axios.get('/check_court_status_booked?dayId=' + lastDay +'&courtId=' + lastCourt + '&bookHoursNum=' + book_hours_num + '&hoursIds=' + hours_id + '&hourId=' + lastHour)

    .then(function(response) {
        console.log(response.data)

        var data = response.data
        
        if(data.length != 0 && data.length == book_hours_num) {
            book_court_div.style.display = 'none'
            dark_bg.style.display = 'none'
            document.getElementById('note').value = ''

            for(var i = 0; i < data.length; i++) {         
                axios.get('/book_court_booked?dayId=' + lastDay +'&courtId=' + lastCourt + '&bookHoursNum=' + book_hours_num + '&hoursIds=' + hours_id + '&hourId=' + lastHour + '&booked_time=' + booked_time +'&note=' + note + '&start_id=' + data[0].id)

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

    for(var i = 0; i < select_hour_end.length; i++) {
        select_hour_end[i].disabled = false
        if(i <= select_hour_start.selectedIndex) {
            select_hour_end[i].disabled = true
        }
    }
}

var lastStartId

function hourDetails(box, index) {

    lastDay = hour_details[index].day // 1 - 7
    day = lastDay - 1 // 0 - 6
    lastCourt = hour_details[index].court
    lastHour = hour_details[index].hour

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

    axios.get('/hour_details_booked?dayId=' + lastDay +'&courtId=' + lastCourt + '&hourId=' + lastHour)

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
    
    axios.get('/cancel_reservation_booked?start_id=' + lastStartId)

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