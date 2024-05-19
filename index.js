

var svg;
var g;
var xAxis;
var yAxis;
var pie;
var pieg;

const fontSize = `20px times`;
const fontFamily = `Arial`;
const fontColor = `black`;
const squareDimension = 20;
const axisFont = `15px times`;
const strokeWidth = '5px';

const margin = { top: 60, right: 60, bottom: 60, left: 60 };
const width = 700;
const height = 600;
const innerHeight = height - margin.bottom - margin.top;
const innerWidth = width - margin.left - margin.right;

const customerId = {}

const xScale = d3.scaleBand()
    .range([0, innerWidth])
    .padding(.6);
const yScale = d3.scaleLinear()
    .range([innerHeight, 0]);

var radius = Math.min(width, height) / 2 - Math.max(margin.top, margin.bottom);

document.addEventListener('DOMContentLoaded', function () {

    svg = d3.select('#my_dataviz')
        .append('svg')
        .attr('width', width)
        .attr('height', height);


    pieg = d3.select("#pie_chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)

    pie = pieg.append("g")
        .attr("transform", "translate(" + innerWidth / 2 + "," + innerHeight / 2 + ")");


    g = svg.append(`g`)
        .attr(`transform`, `translate(${margin.left},${margin.top})`);

    xAxis = g.append(`g`)
        .attr(`transform`, `translate(0, ${innerHeight})`);

    svg.append('text')
        .attr('x', 170)
        .attr('y', 50)
        .attr('id', 'yAxis-text')
        .style('font', fontSize)
        .style('font-family', fontFamily)
        .attr('fill', fontColor)
        .text('Distrubution of Legitimate Transactions');



    yAxis = g.append(`g`)
        .attr(`class`, `yAxis`);

    yAxis.append('text')
        .attr('x', -innerHeight / 2 + 105)
        .attr('y', -40)
        .attr('id', 'yAxis-text')
        .style('font', fontSize)
        .style('font-family', fontFamily)
        .attr('fill', fontColor)
        .style('text-anchor', 'end')
        .attr('transform', 'rotate(-90)')
        .text('Number of Transaction');

    d3.csv('output.csv')
        .then((data) => {
            data.forEach(element => {
                element.legitimate_count = +element.legitimate_count;
                element.fraudulent_count = +element.fraudulent_count;
                element.Transportation = +element.Transportation;
                element.Food = +element.Food;
                element.Fashion = +element.Fashion;
                element.Leisure = +element.Leisure;
                element.Health = +element.Health;
                element.Home = +element.Home;

                customerId[element.customer_id] = {
                    'Legitimate Transaction': element.legitimate_count,
                    'Fraudulent Transaction': element.fraudulent_count,
                    'Transportation': element.Transportation,
                    'Food': element.Food,
                    'Fashion': element.Fashion,
                    'Leisure': element.Leisure,
                    'Health': element.Health,
                    'Home': element.Home
                }
            });
            drawBarChart(customerId[`'C1001065306'`])

            const keysArray = Object.keys(customerId);
            createSelect(keysArray);
            var selectElement = document.getElementById("stateDropdown");

            selectElement.addEventListener("change", function () {
                var selectedValue = this.value;
                
                drawBarChart(customerId[selectedValue])
            });

            // draw(data)
        });



});

// const draw = (data) => {

//   var simulation = d3.forceSimulation(data)
//     .force("link", d3.forceLink().id(function (d) { return d.customer_id; }))
//     .force("charge", d3.forceManyBody())
//     .force("center", d3.forceCenter(innerWidth / 2, innerHeight / 2));


//   var link = svg.selectAll(".link")
//     .data(data)
//     .enter().append("line")
//     .attr("class", "link")
//     .attr("stroke", "#999")
//     .attr("stroke-opacity", 0.6)
//     .attr("x1", function (d) { return d.x; })
//     .attr("y1", function (d) { return d.y; })
//     .attr("x2", function (d) { return d.x; })
//     .attr("y2", function (d) { return d.y; });

//   var node = svg.selectAll(".node")
//     .data(data)
//     .enter().append("circle")
//     .attr("class", "node")
//     .attr("r", 5)
//     .attr("fill", function (d) { return d.legitimate_count > d.fraudulent_count ? "#1f77b4" : "#ff7f0e"; })
//     .attr("cx", function (d) { return d.x; })
//     .attr("cy", function (d) { return d.y; });

//   var label = svg.selectAll(".label")
//     .data(data)
//     .enter().append("text")
//     .attr("class", "label")
//     .attr("text-anchor", "middle")
//     .attr("font-size", "10px")
//     .attr("fill", "#000")
//     .attr("x", function (d) { return d.x; })
//     .attr("y", function (d) { return d.y - 10; })
//     .text(function (d) { return d.customer_id; });

//   simulation.on("tick", function () {
//     link.attr("x1", function (d) { return d.source.x; })
//       .attr("y1", function (d) { return d.source.y; })
//       .attr("x2", function (d) { return d.target.x; })
//       .attr("y2", function (d) { return d.target.y; });

//     node.attr("cx", function (d) { return d.x; })
//       .attr("cy", function (d) { return d.y; });

//     label.attr("x", function (d) { return d.x; })
//       .attr("y", function (d) { return d.y - 10; });
//   });

// }


const createSelect = (keysArray) => {
    var stateSelect = document.getElementById("select-id");

    // creating select element
    var select = document.createElement('select');
    select.style.width = "150px";
    select.style.border = "2px solid #ccc";

    var label = document.createElement('label');
    label.textContent = "Select a state:";
    label.setAttribute('for', 'stateDropdown');

    select.id = "stateDropdown";
    select.classList.add('form-select');

    // creating default option
    var defaultOption = document.createElement('option');
    // defaultOption.disabled = true;
    defaultOption.selected = true;
    defaultOption.appendChild(document.createTextNode("'C95356'"));
    select.appendChild(defaultOption);

    for (let temp in keysArray) {
        // creating option element
        var option = document.createElement('option');
        option.value = keysArray[temp];
        option.appendChild(document.createTextNode(keysArray[temp]));
        select.appendChild(option);
    }

    // appending the dropdown to div
    stateSelect.appendChild(select);
}

const drawBarChart = (data) => {


    var visData = [];
    var pieData = [];
    max = 0
    for (var key in data) {
        if (key != "Legitimate Transaction" && key != "Fraudulent Transaction") {
            visData.push({ category: key, count: data[key] });
            if (max < data[key]) {
                max = data[key];
            }
        } else {
            pieData.push({ category: key, count: data[key] });
        }
    }

    console.log(visData);
    console.log(pieData);
    xScale.domain(visData.map(d => d.category));
    yScale.domain([0, max]);

    xAxis.call(d3.axisBottom(xScale).tickSize(-innerHeight)).style(`font`, axisFont)
        .call(g => g.selectAll(`.tick line`)
            .attr(`stroke-opacity`, 0.3)
            .attr(`stroke-dasharray`, `3,3`))
        .call(g => g.selectAll(`.tick text`)
            .attr(`y`, 10)
            .attr(`dy`, 4));

    yAxis.call(d3.axisRight(yScale)
        .tickSize(innerWidth)
    ).style(`font`, axisFont).attr('class', 'yAxisFont')
        // .call(g => g.select(`.domain`)
        //         .remove())
        .call(g => g.selectAll(`.tick:not(:first-of-type) line`)
            .attr(`stroke-opacity`, 0.3)
            .attr(`stroke-dasharray`, `3,3`)
            .attr('x1', '0'))
        .call(g => g.selectAll(`.tick text`)
            .attr(`x`, -25)
            .attr(`dy`, 4));

    const em = g.selectAll('.allLines')
        .data(visData);

    em.join(`line`)
        .attr(`class`, 'allLines')
        .attr(`x1`, d => xScale(d.category) + 20)
        .attr(`x2`, d => xScale(d.category) + 20)
        .attr(`y1`, d => yScale(d.count))
        .attr(`y2`, yScale(0))
        .attr(`stroke`, `red`)
        .attr(`stroke-width`, 20);

    var color = d3.scaleOrdinal()
        .domain(pieData.map(d => d.category))
        .range(d3.schemeCategory10);
    var arcGenerator = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    var pieGenerator = d3.pie()
        .value(d => d.count)
        .sort(null);

    var arcs = pie.selectAll("arc")
        .data(pieGenerator(pieData))
        .enter()
        .append("g")
        .attr("class", "arc");

    // Add the paths for the arcs to the pie chart
    arcs.append("path")
        .attr("d", arcGenerator)
        .attr("fill", d => color(d.data.category))
        .attr("stroke", "#fff")
        .attr("stroke-width", 1);

    // Add the labels for the categories to the pie chart
    arcs.append("text")
        .attr("transform", d => "translate(" + arcGenerator.centroid(d) + ")")
        .attr("text-anchor", "middle")
        .text(d => d.data.category + ' : ' + d.data.count);
}

