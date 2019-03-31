function buildMetadata(sample) {

  // Use `d3.json` to fetch the metadata for a sample
  d3.json("/metadata/" + sample).then((response) => {

    // Use d3 to select the panel with id of `#sample-metadata`
    var selectorMetadata = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    selectorMetadata.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(response).forEach(([key, value]) => {
      selectorMetadata.append("div")
                      .style("word-wrap", "break-word")
                      .text(`${key}: ${value}`);
    });
  })
}

function buildCharts(sample) {

  // Use `d3.json` to fetch the sample data for the plots
  d3.json("/samples/" + sample).then((response) => {

    // Build a Bubble Chart using the sample data
    var trace = {
      x: response.otu_ids,
      y: response.sample_values,
      mode: "markers",
      marker: { size: response.sample_values,
                color: response.otu_ids,
                colorscale: 'Earth' },
      text: response.otu_labels
    };
    var data_bubble = [trace];
    var layout_bubble = {
      xaxis: { title: "OTU ID"},
      yaxis: { autorange: true}
    };
    Plotly.newPlot("bubble", data_bubble, layout_bubble);

    // Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    // From response object, extract an array of objects that we can than sort through
    var numSampleValues = response.sample_values.length;
    var sampleResults = [];
    for (var i = 0; i < numSampleValues; i++) {
      var item = {};
      item["otu_ids"] = response.otu_ids[i];
      item["sample_values"] = response.sample_values[i];
      item["otu_labels"] = response.otu_labels[i];
      sampleResults.push(item);
    }
    // Sort the sample data by sample values
    sampleResults.sort( (a,b) => b.sample_values - a.sample_values);
    // Slice the first 10 objects for plotting
    var topTen = sampleResults.slice(0,10);
    // Build pie chart
    var data_pie = [{
      values: topTen.map( row => row.sample_values),
      labels: topTen.map( row => row.otu_ids),
      text: topTen.map( row => row.otu_labels),
      textinfo: 'percent',
      hoverinfo: 'label+text+percent+value',
      type: 'pie'
    }];
    Plotly.newPlot("pie", data_pie);
  })
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
    buildGauge(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
  buildGauge(newSample);
}

// Initialize the dashboard
init();
