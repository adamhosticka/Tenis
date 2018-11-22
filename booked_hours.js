
var htmlCollection = document.getElementsByTagName('td')
var h2 = document.getElementById('footer_h2')
var cancel = document.getElementById('cancel_button')
var save = document.getElementById('save_button')
var changed = []
var boxes = []
var colors = []

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
    axios.get('/booked_hours?id=' + id + '&color=' + color)
    
    .then(function (response) {
        
    })
    .catch(function (error) {
        console.log(error);
    });
}

cancel.addEventListener('click', cancelChanges)
save.addEventListener('click', saveChanges)

loadColors = () => {
    axios.get('/load_colors_booked')
    
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
        console.log(':(')
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