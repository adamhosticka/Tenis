
var htmlCollection = document.getElementsByTagName('td')
var h2 = document.getElementById('footer_h2')
var boxes = []
var values = []

function loadColors() {
/* loadColors = () => { */
    axios.get('/load_colors')
    
    .then(function (response) {
        var data = response.data
        for(box of data) {
            values[box.id - 1] = box.val
        }

        /* for(var o = 0; o < data.length; o++) {
            values[data[o].id - 1] = data[o].val
        } */
        
        for(var i = 0; i < htmlCollection.length; i++) {
            boxes[i] = htmlCollection[i]
            boxes[i].className = ""
            boxes[i].className = values[i]
        }
    })
    .catch(function (error) {
        console.log(error);
    });
}

loadColors()

function setWeeks() {
    var d = new Date()
    var week1 = document.getElementById('week1')
    var week2 = document.getElementById('week2')
    var h1_date = document.getElementById('h1_date')
    var h2_date = document.getElementById('h2_date')

    if(d.getDay() === 0) {
        var d1 = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 6)
        var d2 = new Date(d.getFullYear(), d.getMonth(), d.getDate())
        var d3 = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)
        var d4 = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 7)
    }
    else {
        var d1 = new Date(d.getFullYear(), d.getMonth(), d.getDate() - d.getDay() + 1)
        var d2 = new Date(d.getFullYear(), d.getMonth(), d.getDate() - d.getDay() + 7)
        var d3 = new Date(d.getFullYear(), d.getMonth(), d.getDate() - d.getDay() + 8)
        var d4 = new Date(d.getFullYear(), d.getMonth(), d.getDate() - d.getDay() + 14)
    }

    console.log(d1)
    console.log(d.getFullYear(), d.getMonth(), d.getDate(), d.getDay() + 1)
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
    wrapper.style.transform = "translateX(-100vw)"
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
