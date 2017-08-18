const RED = [
        'rgba(255,0,0,1)',
        'rgba(255,0,0,1)',
        'rgba(255,0,0,1)',
        'rgba(255,0,0,1)',
        'rgba(255,0,0,1)',
        'rgba(255,0,0,1)'
    ];
    const BLUE = [
        'rgba(0, 0, 255, 1)',
        'rgba(0, 0, 255, 1)',
        'rgba(0, 0, 255, 1)',
        'rgba(0, 0, 255, 1)',
        'rgba(0, 0, 255, 1)',
        'rgba(0, 0, 255, 1)'
    ]
    const point = 'rgb(28,159,231)';
    const pointHover = 'rgb(31,97,158)';



    function drawChart(type, timeLabel, name) {
        var modal = $('#myChart');
        var canvas = modal.find('.bodyChart #' + name);
        canvas.attr('width', '300').attr('height', '200');


        var ctx = canvas[0].getContext("2d");
        var gradient = ctx.createLinearGradient(0, 200, 0, 0);
        // console.log(timeLabel.length);
        let color = RED;
        let Ticks = "";
        let labelString = "";
        var customTooltips = function(tooltip) {
            $(this._chart.canvas).css("cursor", "pointer");

            var positionY = this._chart.canvas.offsetTop;
            var positionX = this._chart.canvas.offsetLeft;

            $(".chartjs-tooltip").css({
                opacity: 0,
            });

            if (!tooltip || !tooltip.opacity) {
                return;
            }

            if (tooltip.dataPoints.length > 0) {
                tooltip.dataPoints.forEach(function(dataPoint) {
                    let formatTime = dataPoint.xLabel;
                    var content =   formatTime.toLocaleTimeString('en-GB')+ "<br>"+
                                    name + ": " + dataPoint.yLabel;
                    var $tooltip = $("#tooltip-" + dataPoint.datasetIndex);

                    $tooltip.html(content);
                    $tooltip.css({
                        opacity: 1,
                        top: positionY + dataPoint.y + 10 + "px",
                        left: positionX + dataPoint.x + "px",
                    });
                });
            }
        };

        switch (name) {
            case "PM1":
                Ticks = {
                    beginAtZero: true,
                    max: 100,
                    stepSize: 20
                };
                labelString = name + " (μg/m\u00B3)";

                gradient.addColorStop(0, "rgba(125,0,138,0.5)");
                gradient.addColorStop(1, "rgba(245,149,255,0.5)");
                break;
            case "PM25":
                Ticks = {
                    beginAtZero: true,
                    max: 100,
                    stepSize: 20
                };
                labelString = name + " (μg/m\u00B3)";

                gradient.addColorStop(0.28, '#CEF356'); // lv1
                gradient.addColorStop(0.34, '#00FF4D'); // lv2 ok
                gradient.addColorStop(0.4, '#15E84D'); // lv3 xanh ok
                gradient.addColorStop(0.44, '#FFE100');
                gradient.addColorStop(0.48, '#FFB22E');
                gradient.addColorStop(0.54, '#FF9000');
                gradient.addColorStop(0.58, '#E2A1C9');
                gradient.addColorStop(0.62, '#FF0000');
                gradient.addColorStop(0.65, '#8A0000'); // do sam
                gradient.addColorStop(0.71, '#AA00AA'); //tim
                break;
            case "PM10":
                Ticks = {
                    beginAtZero: true,
                    max: 100,
                    stepSize: 20
                };
                labelString = name + " (μg/m\u00B3)";

                gradient.addColorStop(0, "rgba(210,255,122,0.5)");
                gradient.addColorStop(1, "rgba(150,220,60,0.5)");
                break;
            case "temp":
                Ticks = {
                    beginAtZero: true,
                    max: 60,
                    stepSize: 10
                };

                labelString = "Temperature" + " (\u00B0C)";
                gradient.addColorStop(0, "rgba(255,255,100,0.5)");
                gradient.addColorStop(1, "rgba(255,0,0,1)");
                break;
            case "hum":
                Ticks = {
                    beginAtZero: true,
                    max: 100,
                    stepSize: 20
                };
                labelString = "Humidity" + " (\u0025)";
                gradient.addColorStop(0, "rgba(0,82,137,0.5)");
                gradient.addColorStop(1, "rgba(0,188,241,0.5)");
                break;
        }
        // console.log(timeLabel);
        let chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: timeLabel,
                datasets: [{
                    label: labelString,
                    // resize: true,
                    // yAxisID: "y-axis-0",
                    fill: true,
                    // fillOpacity: 0,
                    data: type,
                    fillColor: gradient,
                    backgroundColor: gradient,
                    pointBackgroundColor: point,
                    borderColor: pointHover,
                    pointHoverBackgroundColor: pointHover,
                    pointHoverBorderColor: RED,
                    borderWidth: 0.3,
                }]
            },
            options: {
                // elements: {
                //     line: {
                //         tension: 0, // disables bezier curves
                //     }
                // },
                // plugins: {
                //     filler: {
                //         propagate: false
                //     }
                // },
                tooltips: {
                    enabled: false,
                    mode: 'index',
                    intersect: true,
                    custom: customTooltips
                },
                // legend: {
                //     labels: {
                //         // usePointStyle: false,
                //         display: false
                //     }
                // },
                showTooltips: false,
                animation: {
                    duration: 1500, // general animation time
                },
                scales: {
                    yAxes: [{
                        // position: "left",
                        // scaleLabel: {
                        //     display: false,
                        //     labelString: name
                        // },
                        gridLines: {
                            display: true
                        },
                        ticks: Ticks,
                        // afterTickToLabelConversion: TickToLabel
                    }],
                    xAxes: [{
                        type: 'time',
                        // display: false,
                        scaleLabel: {
                            display: true,
                            labelString: 'Time'
                        },
                        gridLines: {
                            display: true,
                            // drawTicks: true

                        },
                        time: {
                            unit: 'second',
                            displayFormats: {
                                'second': 'HH:mm:ss'
                            },
                            // stepSize: 5,
                            unitStepSize: 2,
                            // max: timeLabel[timeLabel.length -1]



                        },
                        ticks: {
                            display: true, //
                            // beginAtZero: true,
                            autoSkip: true,
                            maxTicksLimit: 2
                            // max: 25
                            // steps: 100,
                            // stepValue: 5,
                            // stepSize: 0.5
                            // maxTicksLimit: 4

                        },

                        // scaleOverride: true,
                        // scaleSteps: 2
                        // stepSize: 20
                    }]

                },
                responsive: false,
                // maintainAspectRatio: true
            }
        });
        // chartName = chart;
        if (name == "PM1") chartPM1 = chart;
        else if (name == "PM25") chartPM25 = chart;
        else if (name == "PM10") chartPM10 = chart;
        else if (name == "temp") chartTemp = chart;
        else if (name == "hum") chartHum = chart;
    }

    function updateChart(type, timeLabel, name) {
        switch (name) {
            case "PM1":
                chartPM1.data.datasets[0].data = type;
                chartPM1.data.labels = timeLabel;
                chartPM1.update();
                break;
            case "PM25":
                chartPM25.data.datasets[0].data = type;
                chartPM25.data.labels = timeLabel;
                chartPM25.update();
            case "PM10":
                chartPM10.data.datasets[0].data = type;
                chartPM10.data.labels = timeLabel;
                chartPM10.update();
            case "temp":
                chartTemp.data.datasets[0].data = type;
                chartTemp.data.labels = timeLabel;
                chartTemp.update();
            case "hum":
                chartHum.data.datasets[0].data = type;
                chartHum.data.labels = timeLabel;
                chartHum.update();
        }
    }

    function infoLatLng(lat, lng) {
        // body...
        let strLat = "";
        let strLng = "";

        if (lat < 90 && lat > 0) {
            strLat += lat + "&degN";
        } else strLat = +lat + "&degS";

        if (lng < 180 && lng > 0) {
            strLng += lng + "&degE";
        } else strLng = +lng + "&degW";
        return strLat + " / " + strLng;
    }