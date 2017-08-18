let totalNode = 100;

function getNode(map) {
    // body...
    $.ajax({
        url: '/jsonNode/' + totalNode,
        type: "GET",
        dataType: "json",
        success: function(node) {
            let infowindow = new google.maps.InfoWindow({ maxWidth: 1000 });
            for (let i = 0; i < node.length; i++) {
                let location = { lat: node[i].lat, lng: node[i].lng };
                let colorIconMarker;
                let lastPm25 = node[i].lastPm25;
                if (lastPm25 < 11) colorIconMarker = "lv1";
                else if (lastPm25 < 23) colorIconMarker = "lv2";
                else if (lastPm25 < 35) colorIconMarker = "lv3";
                else if (lastPm25 < 41) colorIconMarker = "lv4";
                else if (lastPm25 < 47) colorIconMarker = "lv5";
                else if (lastPm25 < 53) colorIconMarker = "lv6";
                else if (lastPm25 < 58) colorIconMarker = "lv7";
                else if (lastPm25 < 64) colorIconMarker = "lv8";
                else if (lastPm25 < 70) colorIconMarker = "lv9";
                else colorIconMarker = "lv10";
                let marker = new google.maps.Marker({
                    position: location,
                    icon: '/image/' + colorIconMarker + '.png',
                    label: { color: '#fff', fontSize: '12px', fontWeight: '600', text: "" + lastPm25 },
                    map: map,
                    title: "Node: " + i 
                });
                (function(marker, i) {
                    google.maps.event.addListener(marker, "click", function(e) {
                        chartPM1 = null;
                        chartPM25 = null;
                        chartPM10 = null;
                        chartTemp = null;
                        chartHum = null;
                        if (timeInterval) clearTimeout(timeInterval);
                        if (preInfowindow) preInfowindow = null;
                        infowindow.setContent(stringContent);
                        infowindow.open(map, marker);

                        // node sau khi infowindow duoc mo len thi moi thay doi duoc dom html cua stringContent

                        $("#titleChart #title").html("Node: " + node[i].nodeID);
                        $("#infoLatLng").html(infoLatLng(node[i].lat.toFixed(3), node[i].lng.toFixed(3)));
                        preInfowindow = infowindow;
                        getData(node, i);
                        console.log(i);
                    });
                })(marker, i);
            }
            google.maps.event.addListener(infowindow, 'closeclick', function() {
                if (timeInterval) clearTimeout(timeInterval);
                chartPM1 = null;
                chartPM25 = null;
                chartPM10 = null;
                chartTemp = null;
                chartHum = null;
            });

        }
    });
}

function getData(node, i) {
    // body...
    $.ajax({
        url: '/jsonData/' + node[i].nodeID,
        type: "GET",
        // data: jQuery.param({nodeID: "0"})
        dataType: "json",
        success: function(result) {
            let stringInfoNode = "";
            let lastUpdate = "";
            let today = "";
            let PM_1 = [];
            let PM_25 = [];
            let PM_10 = [];
            let temp = [];
            let hum = [];
            let timeLabel = [];
            // console.log(result[2].temp);
            // $("#myChart").html("abc"+ result[2].temp);
            for (var j = 0; j < result.length; j++) {
                if (result[j]) {
                    PM_1.unshift(result[j].PM_1);
                    PM_25.unshift(result[j].PM_25);
                    PM_10.unshift(result[j].PM_10);
                    temp.unshift(result[j].temp);
                    hum.unshift(result[j].hum);
                    timeLabel.unshift(new Date(result[j].timestamp));
                } else {
                    PM_1.unshift(undefined);
                    PM_25.unshift(undefined);
                    PM_10.unshift(undefined);
                    temp.unshift(undefined);
                    hum.unshift(undefined);
                    timeLabel.unshift(undefined);
                }
            }
            stringInfoNode += "PM2.5 :" + PM_25[PM_25.length - 1] + " μg/m&sup3<br>";
            stringInfoNode += "Temperature : " + temp[temp.length - 1] + "\u00B0C, ";
            stringInfoNode += "Humidity :" + hum[hum.length - 1] + "\u0025";
            lastUpdate = timeLabel[timeLabel.length - 1];
            today = "To Day: " + moment(lastUpdate).format('dddd, D MMM YYYY');
            lastUpdate = "Last Update:" + moment(lastUpdate).format('YYYY-MM-DD, HH:mm:ss');


            if (chartPM1 || chartPM10 || chartPM25 || chartTemp || chartHum) {
                updateChart(PM_1, timeLabel, "PM1");
                updateChart(PM_25, timeLabel, "PM25");
                updateChart(PM_10, timeLabel, "PM10");
                updateChart(temp, timeLabel, "temp");
                updateChart(hum, timeLabel, "hum");
                console.log("updateChart!!" + node[i].nodeID);
            } else {
                drawChart(PM_1, timeLabel, "PM1");
                drawChart(PM_25, timeLabel, "PM25");
                drawChart(PM_10, timeLabel, "PM10");
                drawChart(temp, timeLabel, "temp");
                drawChart(hum, timeLabel, "hum");
                console.log("drawChart!!" + node[i].nodeID);
            }

            $("#headChart #infoNode").html(stringInfoNode);
            $("#headChart #lastUpdate").html(lastUpdate);
            $("#headChart #today").html(today);

            timeInterval = setTimeout(function() {
                getData(node, i);
            }, 5000);
        }
    });
}