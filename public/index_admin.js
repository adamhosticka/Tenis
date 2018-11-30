
var htmlCollection = document.getElementsByTagName('td')
var h2 = document.getElementById('footer_h2')
var cancel = document.getElementById('cancel_button')
var save = document.getElementById('save_button')
var changed = []
var boxes = []
var values = []

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

saveChangesToDatabase = (id, valueID) => {
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

loadColors = () => {
    axios.get('/load_colors')
    
    .then(function (response) {
        var data = response.data
        
        /* for(box of data) {
            if(box.val === 'free') {
                colors[box.id - 1] = 'green'
            }
            if(box.val === 'booked') {
                colors[box.id - 1] = 'red'
            }
        }
        
        for(var i = 0; i < htmlCollection.length; i++) {
            boxes[i] = htmlCollection[i]
            boxes[i].className = ""
            boxes[i].className = colors[i]
        } */

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