var htmlCollection = document.getElementsByTagName('td')
var h2 = document.getElementById('footer_h2')
var cancel = document.getElementById('cancel_button')
var save = document.getElementById('save_button')
/* var login = document.getElementById('login')
var logout = document.getElementById('logout') */
var login_logout
var footer_message_div = document.getElementById('footer_message_div')
var footer_message = document.getElementById('footer_message')
var changed = []
var values = []
var boxes = []
var user_type
var user_id
var alert_div = document.getElementById('alert')
const numOfBoxes = 294
var hour_details = []
var non_register_alert = false
var first_load = true

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
        hour_details = data

        for(var o = 0; o < data.length; o++) {
            values[data[o].boxId - 1] = data[o].val
        }

        
        for(var i = 0; i < htmlCollection.length; i++) {
            boxes[i] = htmlCollection[i]
            boxes[i].className = ""
            boxes[i].className = values[i]
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
                        changeColor(box, index)
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
    var h1_date = document.getElementById('h1_date')
    var h2_date = document.getElementById('h2_date')

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
        h1_date.innerHTML = " " + date1_1 + " - " + date1_2
        h2_date.innerHTML = " " + date2_1 + " - " + date2_2
    }
    catch(error) {}
}

setWeeks()

var wrapper = document.getElementById('swipe_layout_content')
var left_arrow = document.getElementById('left_arrow')
var right_arrow = document.getElementById('right_arrow')
left_arrow.addEventListener('click', swipeRight)
right_arrow.addEventListener('click', swipeLeft)


function swipeLeft() {
    right_arrow.style.display = 'none'
    left_arrow.style.display = 'block'
    wrapper.style.transform = "translateX(-50%)"
    h1_date.classList.add('display_none')
    h2_date.classList.remove('display_none')
}

function swipeRight() {
    right_arrow.style.display = 'block'
    left_arrow.style.display = 'none'
    wrapper.style.transform = "translateX(0)"
    h1_date.classList.remove('display_none')
    h2_date.classList.add('display_none')
}







/* function changeColor(box, index) {
    deleted = false;

    if(changed.length === 0) {
        showButtons(true)
    }
    
    for(var x = 0; x < changed.length; x++) {
        if(changed[x] == index) {
            changed.splice(x, 1)
            deleted = true;
        }
    }
    
    if(deleted == false) {
        changed[changed.length] = index
    }
    
    if(box.className == "booked") {
        box.classList.remove('booked')
        box.classList.add('free')
        box.classList.add('selected_box')
    }

    else if(box.className == "free") {
        box.classList.remove('free')
        box.classList.add('booked')
        box.classList.add('selected_box')
    }

    else if(box.className == "booked selected_box") {
        box.classList.remove('selected_box')
        box.classList.remove('booked')
        box.classList.add('free')
    }

    else if(box.className == "free selected_box") {
        box.classList.remove('selected_box')
        box.classList.remove('free')
        box.classList.add('booked')
    }

    if(changed.length == 0) {
        showButtons(false)
    }
}

function showButtons(boolean) {
    
    if(boolean == true) {
        cancel.style.display = 'block'
        save.style.display = 'block'
        h2.style.opacity = '0'
        h2.style.zIndex = '-1'
        login_logout.style.opacity = '0'
        login_logout.style.zIndex = '-1'
        setTimeout(function() {
            cancel.style.zIndex = '1'
            cancel.style.opacity = '1'
            save.style.zIndex = '1'
            save.style.opacity = '1'
            h2.style.display = 'none'
            login_logout.style.display = 'none'
        }, 300)
    }
    
    if(boolean == false) {
        h2.style.display = 'block'
        login_logout.style.display = 'block'
        setTimeout(function() {
            h2.style.opacity = '1'
            h2.style.zIndex = '1'
            login_logout.style.opacity = '1'
            login_logout.style.zIndex = '1'
            cancel.style.display = 'none'
            save.style.display = 'none'
        }, 100)
        cancel.style.zIndex = '-1'
        cancel.style.opacity = '0'
        save.style.zIndex = '-1'
        save.style.opacity = '0'
    }
}


function cancelChanges() {
    for(var x = 0; x < changed.length; x++) {
        if(boxes[changed[x]].className == 'booked selected_box') {
            boxes[changed[x]].className = 'free'
        } else {
            boxes[changed[x]].className = 'booked'
        }
        
    }
    changed = []
    showButtons(false)
}

function saveChanges() {
    
    footer_message_div.style.zIndex = '1'
    footer_message.innerHTML = ''
    if(changed.length === 1) {
        footer_message.innerHTML = 'Byl změněn ' + changed.length + ' záznam.'
    }
    else if(changed.length === 2 || changed.length === 3 || changed.length === 4) {
        footer_message.innerHTML = 'Byly změněny ' + changed.length + ' záznamy.'
    }
    else {
        footer_message.innerHTML = 'Bylo změněno ' + changed.length + ' záznamů.'
    }
    
    setTimeout(function() {
        footer_message_div.style.zIndex = '-1'
    },1000)

    for(var x = 0; x < changed.length; x++) {
        if(boxes[changed[x]].className == 'booked selected_box') {
            boxes[changed[x]].className = 'booked'
            saveChangesToDatabase(changed[x], 1)
        } 
        if(boxes[changed[x]].className == 'free selected_box') {
            boxes[changed[x]].className = 'free'
            saveChangesToDatabase(changed[x], 0)
        } 
    }
    changed = []
    showButtons(false)
}

function saveChangesToDatabase(id, valueID) {
    id++
    axios.get('/update_playing_hours?id=' + id + '&valueID=' + valueID)
    
    .then(function (response) {
        
    })
    .catch(function (error) {
        console.log(error);
    });
}

cancel.addEventListener('click', cancelChanges)
save.addEventListener('click', saveChanges)
 */


var lastIndex
var lastDay
var lastCourt
hours = ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00']
days = ['Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota', 'Neděle']
rows = 13

function changeColor(box, index) {
    console.log(box, index)
    
    var inRow = (index + 1) % tdInRow
    if(inRow == 0) {
        inRow = tdInRow
    }
    
    var day = Math.floor((inRow - 1) / 3)
    
    lastIndex = index
    lastDay = day

    var hour = Math.floor(index / tdInRow)
    hour = hour % (rows + 1)

    /* console.log(days[day], hours[hour], hour)

    console.log('---------------------------------------------------------------------------------------------------------')
    
    console.log('---------------------------------------------------------------------------------------------------------') */

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

    var day_month = date_format.getDate() + "." + date_format.getMonth() + "."

    lastCourt = index % 3

    date.innerText = days[day] + " " + day_month  + " - " + "Kurt" + " " + (lastCourt + 1)
    
    book_court_div.style.display = 'block'
    dark_bg.style.display = 'block'
    
    select_hour_start.selectedIndex = hour
    select_hour_end.selectedIndex = hour + 1

    changeHoursEnd()
    
}

function book_court() {

    book_hour_start = select_hour_start.selectedIndex
    book_hour_end = select_hour_end.selectedIndex

    console.log(book_hour_start, book_hour_end)
    /* console.log(hours[book_hour_start], hours[book_hour_end]) */

    var book_hours_num = book_hour_end - book_hour_start

    if(lastIndex < numOfBoxes) {
        console.log((lastDay*3) + (tdInRow * book_hour_start) )
        finalIndex = (lastDay*3) + (tdInRow * book_hour_start)
    } else {
        console.log((lastDay*3) + (tdInRow * book_hour_start) + numOfBoxes)
        finalIndex = (lastDay*3) + (tdInRow * book_hour_start) + numOfBoxes
    }

    booked_time = hours[book_hour_start] + " - " + hours[book_hour_end]
    note = document.getElementById('note').value
    console.log(booked_time)

    axios.get('/check_court_status?index=' + finalIndex +'&courtId=' + lastCourt + '&bookHoursNum=' + book_hours_num)

    .then(function(response) {
        console.log(response.data)

        var data = response.data
        
        if(data.length != 0 && data.length == book_hours_num) {
            book_court_div.style.display = 'none'
            dark_bg.style.display = 'none'
            document.getElementById('note').value = ''

            for(var i = 0; i < data.length; i++) {         

                axios.get('/book_court?index=' + finalIndex +'&courtId=' + lastCourt + '&bookHoursNum=' + book_hours_num + '&booked_time=' + booked_time +'&note=' + note + '&start_id=' + data[0].id)

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

    for(var i = 0; i < select_hour_end.length; i++) {
        select_hour_end[i].disabled = false
        if(i <= select_hour_start.selectedIndex) {
            select_hour_end[i].disabled = true
        }
    }
}

var lastStartId

function hourDetails(box, index) {
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
    
    var inRow = (index + 1) % tdInRow
    if(inRow == 0) {
        inRow = tdInRow
    }
    
    var day = Math.floor((inRow - 1) / 3)
    
    lastIndex = index

    if(index < numOfBoxes) {
        var date_format = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate() + day)
    } else {
        var date_format = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate() + day + 7)
    }

    var day_month = date_format.getDate() + "." + date_format.getMonth() + "."

    lastCourt = index % 3

    date.innerText = days[day] + " " + day_month  + " - " + "Kurt" + " " + (lastCourt + 1)

    /* details.innerHTML = index */

    axios.get('/hour_details?id=' + (index+1))

    .then(function(response) {
        var data = response.data
        console.log(data)
        document.getElementById('details_id').innerText = data[0].boxId
        document.getElementById('details_user').innerText = data[0].first_name + " " + data[0].last_name
        document.getElementById('details_email').innerText = data[0].email
        document.getElementById('details_mob').innerText = data[0].mob_no
        document.getElementById('details_time').innerText = data[0].booked_time
        document.getElementById('details_note').innerText = data[0].note
        
        lastStartId = data[0].start_id
    })
}

function cancel_reservation() {
    
    axios.get('/cancel_reservation?start_id=' + lastStartId)

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