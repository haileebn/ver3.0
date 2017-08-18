function updateChart(timeLabel, temp, hud) {
    myChart.data.datasets[0].data = temp;
    myChart.data.datasets[1].data = hud;
    myChart.data.labels = timeLabel;
    myChart.update();
}
function getDataJson() {
    $.ajax({
        url: '/json',
        type: "GET",
        dataType: "json",
        success: function(response) {
            if (response.length === 0) {
                $('#alert').html('we have no data');
            } else {
                $('#alert').html('');
                var rowData = [];
                for (var i = 5; i >= 0; i--) {
                    if (response[i]) {
                        rowData.unshift("Temperature :" + response[i].temperature +
                        				" Humidity: " + response[i].Humidity +
                        				" Time: " +
                        				// moment(response[i].timestamp).format("HH:MM:SS") +
                        					moment(response[i].timestamp).get('hour') + ":" +
                        					moment(response[i].timestamp).get('minute') + ":" +
                							(moment(response[i].timestamp).get('second') >= 10 ?
                								moment(response[i].timestamp).get('second'): ("0" + moment(response[i].timestamp).get('second'))
                							) +
                        				"<br>");

                    } else {
                        rowData.unshift(undefined);
                    }
                }
                $('#data').html(rowData);
            }
            timeInterval = setTimeout(getDataJson, 2000);
        }
    });
}
function getData() {
    $.ajax({
        url: '/json',
        type: "GET",
        dataType: "json",
        success: function(response) {
            if (response.length === 0) {
                $('#alert').html('we have no data');
            } else {
                $('#alert').html('');

                var timeLabel = [];
                var temp = [];
                var hud = [];
                // var a = JSON.stringify(response);
                // console.log(a);
                // $('#demo').html = a;
                timeLabel.unshift(moment(response[0].timestamp).format());
                temp.unshift(response[0].temperature);
                hud.unshift(response[0].Humidity);

                for (var i = 1; i < 5; i++) {
                    if (response[i]) {
                        timeLabel.unshift(moment(response[i].timestamp).format());
                        temp.unshift(response[i].temperature);
                        hud.unshift(response[i].Humidity);
                    } else {
                        timeLabel.unshift(moment(response[0].timestamp).subtract(moment.duration((i * 4), 's')).format());
                        temp.unshift(undefined);
                        hud.unshift(undefined);
                    }
                }

                if (myChart) updateChart(timeLabel, temp, hud);
                else drawChart(temp, hud, timeLabel);
            }
            timeInterval = setTimeout(getData, 2000);
        }
    });
}