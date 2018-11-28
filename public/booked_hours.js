saveChangesToDatabase = (id, valueID) => {
    id++
    axios.get('/booked_hours?id=' + id + '&valueID=' + valueID)
    
    .then(function (response) {
        
    })
    .catch(function (error) {
        console.log(error);
    });
}

loadColors = () => {
    axios.get('/load_colors_booked')
    
    .then(function (response) {
        var data = response.data
        
        for(box of data) {
            values[box.id - 1] = box.val
        }
        
        for(var i = 0; i < htmlCollection.length; i++) {
            boxes[i] = htmlCollection[i]
            boxes[i].className = ""
            boxes[i].className = values[i]
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
