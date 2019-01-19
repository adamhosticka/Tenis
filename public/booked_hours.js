function saveChangesToDatabase(id, valueID) {
    id++
    axios.get('/update_booked_hours?id=' + id + '&valueID=' + valueID)
    
    .then(function (response) {
        
    })
    .catch(function (error) {
        console.log(error);
    });
}

function loadColors(){
    axios.get('/load_colors_booked')
    
    .then(function (response) {
        var data = response.data
        
        /* for(box of data) {
            values[box.id - 1] = box.val
        } */

        for(var o = 0; o < data.length; o++) {
            values[data[o].boxId - 1] = data[o].val
        }
        
        for(var i = 0; i < htmlCollection.length; i++) {
            boxes[i] = htmlCollection[i]
            boxes[i].className = ""
            boxes[i].className = values[i]
        }

        tdInRow = 21;
        var courtsEl = document.getElementById('courts')
        var courts = courtsEl.getElementsByTagName('th')

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
