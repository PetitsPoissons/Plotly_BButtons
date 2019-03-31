function buildGauge(sample) {

    // Use `d3.json` to fetch the washing frequency (wfreq) for a sample
    d3.json("/wfreq/" + sample).then((response) => {
  
      // Save number of scrubs into variable 'level'
      var level = response.WFREQ * 180/9;
      console.log(level);
      // Trig to calculate the meter point (x,y) coordinates
      var degrees = 180 - level;
      console.log(level);
      var radius = .5;
      var radians = degrees * Math.PI / 180;
      var x = radius * Math.cos(radians);
      var y = radius * Math.sin(radians);

      // Create the svg path for the meter point
      var mainPath = 'M -.0 -0.025 L .0 0.025 L ';
      var pathX = String(x);
      var space = ' ';
      var pathY = String(y);
      var pathEnd = ' Z';
      var path = mainPath.concat(pathX,space,pathY,pathEnd);
      console.log(path);

      // Create chart
      var data = [{
        type: 'scatter',
        x: [0],
        y: [0],
        marker: {size: 28, color:'850000'},
        showlegend: false},
        { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
          rotation: 90,
          text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
          textinfo: 'text',
          textposition:'inside',
          marker: {colors:['#228b22','#55a32f','#7db848','#a1cb66','#c0dc87','#d9eaa8','#edf4c7','#fafbdf','#fffff0','#ffffff']},
          hole: .5,
          type: 'pie',
          showlegend: false
      }];
      var layout = {
        shapes: [{
          type: 'path',
          path: path,
          fillcolor: '850000',
          line: { color: '850000' }
        }],
        title: { text: "Belly Button Washing Frequency (per Week)",
                 size: 16},
        xaxis: {zeroline:false, showticklabels:false, showgrid: false, range: [-1, 1]},
        yaxis: {zeroline:false, showticklabels:false, showgrid: false, range: [-1, 1]}
      };
      Plotly.newPlot('gauge', data, layout);
    })
}
