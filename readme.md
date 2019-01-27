# PowderGraph

[Live Link](https://kopecmark.github.io/PowderGraph/)

## Overview

PowderGraph is a visualization application to show how much snow has fallen monthly throughout the years in Lake Louise - Alberta, Canada.

### Functionality

* The app consists of a single page
* A user can select a year to view the total amount of snowfall and toggle to rain totals as well.

### Technologies employed

* Vanilla JavaScript for data sorting.
* D3.js for visualizing the data.
* HTML
* CSS

### Data
* Data was obtained from the Government of Canada Environment and Natural Resources Climate Data Website [LINK](http://climate.weather.gc.ca/index_e.html)
* Data was downloaded in csv file format using a Homebrew script for all available years that the weather station was in operation
* The data was parsed and statically available on the website

### Features
A user can select a year using the slider to view monthly snow fall totals and hover over each bar to view exact values.
![Wireframe](./slider.gif)

A user can click the button to toggle between snow and rain fall totals.
![Wireframe](./button.gif)

### CODE
#### Data download
```
  for year in `seq 2000 2005`;do for month in `seq 1 12`;do wget --content-disposition "http://climate.weather.gc.ca/climate_data/bulk_data_e.html?format=csv&stationID=2409&Year=${year}&Month=${month}&Day=14&timeframe=3&submit= Download+Data" ;done;done
```

### Possible Future Implementations
* The ability to search all weather stations in Canada and have the application automatically fetch the data so that it can be displayed within the graph.
* Adjust graph bar colors to change shading based on total snowfall for given month compared to average totals for the specified month for all years data has been recorded.