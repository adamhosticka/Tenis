
var htmlCollection = document.getElementsByTagName('td')
var h2 = document.getElementById('footer_h2')
var cancel = document.getElementById('cancel_button')
var save = document.getElementById('save_button')
var changed = []
var boxes = []
var colors = []
var colors_booked = []

function cancelChanges() {
    for(var x = 0; x < changed.length; x++) {
        if(boxes[changed[x]].className == 'red selected_box') {
            boxes[changed[x]].className = 'green'
        } else {
            boxes[changed[x]].className = 'red'
        }
        
    }
    changed = []
    showButtons(false)
}

function saveChanges() {
    for(var x = 0; x < changed.length; x++) {
        if(boxes[changed[x]].className == 'red selected_box') {
            boxes[changed[x]].className = 'red'
            saveChangesToDatabase(changed[x], 'red')
        } 
        if(boxes[changed[x]].className == 'green selected_box') {
            boxes[changed[x]].className = 'green'
            saveChangesToDatabase(changed[x], 'green')
        } 
    }
    changed = []
    showButtons(false)
}

saveChangesToDatabase = (id, color) => {
    id++
    axios.get('/playing_hours?id=' + id + '&color=' + color)
    
    .then(function (response) {
        
    })
    .catch(function (error) {
        console.log(error);
    });
}

cancel.addEventListener('click', cancelChanges)
save.addEventListener('click', saveChanges)

loadColors = () => {
    axios.get('/load_colors')
    
    .then(function (response) {
        var data = response.data
        
        for(box of data) {
            colors[box.id - 1] = box.color
        }
        
        for(var i = 0; i < htmlCollection.length; i++) {
            boxes[i] = htmlCollection[i]
            boxes[i].className = ""
            boxes[i].className = colors[i]
        }

        boxes.forEach((box, index) => {
            box.onclick = function() {
                changeColor(box, index)
            }
        })
    })
    .catch(function (error) {
        console.log(error);
    });
}

loadColors()

loadColorsBooked = () => {
    axios.get('/load_colors_booked')
    
    .then(function (response) {
        var data = response.data
        
        for(box of data) {
            colors_booked[box.id - 1] = box.color
        }
    })
    .catch(function (error) {
        console.log(error);
    });
}

loadColorsBooked()

function setWeeks() {
    var d = new Date()
    var week1 = document.getElementById('week1')
    var week2 = document.getElementById('week2')
    var d1 = new Date(d.getFullYear(), d.getMonth(), d.getDate() - d.getDay() + 1)
    var d2 = new Date(d.getFullYear(), d.getMonth(), d.getDate() - d.getDay() + 7)
    var d3 = new Date(d.getFullYear(), d.getMonth(), d.getDate() - d.getDay() + 8)
    var d4 = new Date(d.getFullYear(), d.getMonth(), d.getDate() - d.getDay() + 14)
    console.log(d1)
    var date1_1 = d1.getDate() + "." + (d1.getMonth() + 1) + "." + d1.getFullYear()
    var date1_2 = d2.getDate() + "." + (d2.getMonth() + 1) + "." + d2.getFullYear()
    var date2_1 = d3.getDate() + "." + (d3.getMonth() + 1) + "." + d3.getFullYear()
    var date2_2 = d4.getDate() + "." + (d4.getMonth() + 1) + "." + d4.getFullYear()

    week1.innerHTML = date1_1 + " - " + date1_2
    week2.innerHTML = date2_1 + " - " + date2_2
}

setWeeks()

function changeColor(box, index) {
    deleted = false;

    showButtons(true)
    
    for(var x = 0; x < changed.length; x++) {
        if(changed[x] == index) {
            changed.splice(x, 1)
            deleted = true;
        }
    }
    
    if(deleted == false) {
        changed[changed.length] = index
    }
    
    if(box.className == "red") {
        box.classList.remove('red')
        box.classList.add('green')
        box.classList.add('selected_box')
    }

    else if(box.className == "green") {
        box.classList.remove('green')
        box.classList.add('red')
        box.classList.add('selected_box')
    }

    else if(box.className == "red selected_box") {
        box.classList.remove('selected_box')
        box.classList.remove('red')
        box.classList.add('green')
    }

    else if(box.className == "green selected_box") {
        box.classList.remove('selected_box')
        box.classList.remove('green')
        box.classList.add('red')
    }

    if(changed.length == 0) {
        showButtons(false)
    }
}

function showButtons(boolean) {

    if(boolean == true) {
        h2.style.opacity = '0'
        h2.style.zIndex = '-1'
        cancel.style.zIndex = '1'
        cancel.style.opacity = '1'
        save.style.zIndex = '1'
        save.style.opacity = '1'
    }

    if(boolean == false) {
        h2.style.opacity = '1'
        h2.style.zIndex = '1'
        cancel.style.zIndex = '-1'
        cancel.style.opacity = '0'
        save.style.zIndex = '-1'
        save.style.opacity = '0'
    }
}

var wrapper = document.getElementById('swipe_layout_content')
var left_arrow = document.getElementById('left_arrow')
var right_arrow = document.getElementById('right_arrow')
left_arrow.addEventListener('click', swipeRight)
right_arrow.addEventListener('click', swipeLeft)


function swipeLeft() {
    right_arrow.style.display = 'none'
    left_arrow.style.display = 'block'
    wrapper.style.transform = "translateX(-100vw)"
}

function swipeRight() {
    right_arrow.style.display = 'block'
    left_arrow.style.display = 'none'
    wrapper.style.transform = "translateX(0)"
}
