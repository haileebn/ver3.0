let stringContent = '<div id="myChart" style="width:100%; height:600px">' +
    '<div id="headChart" style="width:100%;">' +
    '<div id="titleChart" style="">' +
    '<div id="today" style="font-size:30px;font-weight:bold; text-align:center;"></div>' +
    '<div id="title" style="font-size:24px;font-weight:bold;"></div>' +
    // '<>'+
    '<i id="lastUpdate" style="float:right;opacity: 0.35; font-size:12px;"></i>' +
    '</div>' +
    '<i id="infoLatLng" style="clear:left;"></i>' +
    '<div id="infoNode">' +
    '</div>' +
    // end infonode
    '</div>' +
    // end headchart
    '<div class="bodyChart">' +
    '<canvas id="PM1" style="float: left;">' +
    '</canvas>' +
    '<div class="chartjs-tooltip" id="tooltip-0"></div>' +
    '<div class="chartjs-tooltip" id="tooltip-1"></div>' +
    '<canvas id="PM25" style="float: left;">' +
    '</canvas>' +
    '<div id="alert1"></div>' +
    '<canvas id="PM10" style="float: left;">' +
    '</canvas>' +
    '<div id="alert1"></div>' +
    '<canvas id="temp" style="float: left;">' +
    '</canvas>' +
    '<div id="alert"></div>' +
    '<canvas id="hum" style="float: left;">' +
    '</canvas>' +
    '<div id="alert1"></div>' +
    '<div id=""></div>' +
    '</div>'
'</div>';
let timeInterval = null;
let chartPM1;
let chartPM25;
let chartPM10;
let chartTemp;
let chartHum;
let preInfowindow = false;


function myMap() {
    // let vnu = {
    //     lat: 21.038186,
    //     lng: 105.782660
    // };
    // let mapProp = {
    //     center: vnu,
    //     zoom: 18,
    // };

    let vnu = {
        "lat": 21.0319101029936,
        "lng": 105.786722296631
    };
    let mapProp = {
        center: vnu,
        zoom: 12,
    };
    let map = new google.maps.Map($('#googleMap')[0], mapProp);
    let marker = new google.maps.Marker({ position: mapProp.center });
    marker.setMap(map);

    var myloc = new google.maps.Marker({
        // clickable: false,
        icon: new google.maps.MarkerImage('//maps.gstatic.com/mapfiles/mobile/mobileimgs2.png',
            new google.maps.Size(22, 22),
            new google.maps.Point(0, 18),
            new google.maps.Point(11, 11)),
        shadow: null,
        zIndex: 999,
        title: "My Location!",
        map: map // your google.maps.Map object
    });
    myloc.addListener('click', function() {
        if (myloc.getAnimation() !== null) {
          myloc.setAnimation(null);
        } else {
          myloc.setAnimation(google.maps.Animation.BOUNCE);
        }
    });

    addYourLocationButton(map, myloc);
    getNode(map);
    // end call ajax getNode
    // });
}

// tao button my location
function addYourLocationButton(map, marker) {
    var controlDiv = document.createElement('div');

    var firstChild = document.createElement('button');
    firstChild.style.backgroundColor = '#fff';
    firstChild.style.border = 'none';
    firstChild.style.outline = 'none';
    firstChild.style.width = '28px';
    firstChild.style.height = '28px';
    firstChild.style.borderRadius = '2px';
    firstChild.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';
    firstChild.style.cursor = 'pointer';
    firstChild.style.marginRight = '10px';
    firstChild.style.padding = '0px';
    firstChild.title = 'Your Location';
    controlDiv.appendChild(firstChild);

    var secondChild = document.createElement('div');
    secondChild.style.margin = '5px';
    secondChild.style.width = '18px';
    secondChild.style.height = '18px';
    secondChild.style.backgroundImage = 'url(https://maps.gstatic.com/tactile/mylocation/mylocation-sprite-1x.png)';
    secondChild.style.backgroundSize = '180px 18px';
    secondChild.style.backgroundPosition = '0px 0px';
    secondChild.style.backgroundRepeat = 'no-repeat';
    secondChild.id = 'you_location_img';
    firstChild.appendChild(secondChild);

    google.maps.event.addListener(map, 'dragend', function() {
        $('#you_location_img').css('background-position', '0px 0px');
    });

    firstChild.addEventListener('click', function() {
        var imgX = '0';
        var animationInterval = setInterval(function() {
            if (imgX == '-18') imgX = '0';
            else imgX = '-18';
            $('#you_location_img').css('background-position', imgX + 'px 0px');
        }, 500);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                marker.setPosition(latlng);
                marker.setAnimation(google.maps.Animation.BOUNCE);
                map.setCenter(latlng);
                map.setZoom(18);
                clearInterval(animationInterval);
                $('#you_location_img').css('background-position', '-144px 0px');
            });
        } else {
            clearInterval(animationInterval);
            $('#you_location_img').css('background-position', '0px 0px');
        }
    });

    controlDiv.index = 1;
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
}