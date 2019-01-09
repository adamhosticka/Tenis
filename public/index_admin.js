var htmlCollection = document.getElementsByTagName('td')
var h2 = document.getElementById('footer_h2')
var cancel = document.getElementById('cancel_button')
var save = document.getElementById('save_button')
var footer_message_div = document.getElementById('footer_message_div')
var footer_message = document.getElementById('footer_message')
var changed = []
var values = []
var boxes = []

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
    axios.get('/playing_hours?id=' + id + '&valueID=' + valueID)
    
    .then(function (response) {
        
    })
    .catch(function (error) {
        console.log(error);
    });
}

cancel.addEventListener('click', cancelChanges)
save.addEventListener('click', saveChanges)

function loadColors() {
    axios.get('/load_colors')
    
    .then(function (response) {
        var data = response.data

        tdInRow = 21;
        var courtsEl = document.getElementById('courts')
        var courts = courtsEl.getElementsByTagName('th')
        var courtsEl2 = document.getElementById('courts2')
        var courts2 = courtsEl2.getElementsByTagName('th')

        boxes.forEach(function(box, index) {
            box.onclick = function() {
                changeColor(box, index)
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
        /* console.log(error); */
    });
}

loadColors()

function changeColor(box, index) {
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
        h2.style.opacity = '0'
        h2.style.zIndex = '-1'
        cancel.style.zIndex = '1'
        cancel.style.opacity = '1'
        save.style.zIndex = '1'
        save.style.opacity = '1'
        setTimeout(function() {
            h2.style.display = 'none'
        }, 300)
    }
    
    if(boolean == false) {
        h2.style.display = 'block'
        setTimeout(function() {
            h2.style.opacity = '1'
            h2.style.zIndex = '1'
        }, 100)
        cancel.style.zIndex = '-1'
        cancel.style.opacity = '0'
        save.style.zIndex = '-1'
        save.style.opacity = '0'
    }
}