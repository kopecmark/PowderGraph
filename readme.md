# PowGraph

## Overview

PowGraph is a visualization application to show how much snow has fallen monthly throughout the years in Lake Louise - Alberta, Canada.

### Functionality

* The app will consist of a single page
* A user will be able to manipulate the data to compare years of snow fall


### Wireframes

![Wireframe](./wireframe.png)

[LINK](https://wireframe.cc/zfwUKu)

### Technologies employed

* Vanilla JavaScript for data sorting.
* D3.js for visualizing the data.

### Data
* Data will be obtained from the Government of Canada Environment and Natural Resources Climate Data Website [LINK](http://climate.weather.gc.ca/index_e.html)
* Data will be downloaded in csv file format using a Homebrew script for all available years that the weather station was in operation
* The data will be parsed and statically available on the website

### Implimentation Timeline
  - Day 1
    - Review D3 library website and examples
    - Select graphs examples as templates to be used for implimentation
    - Write proposal documentation
    - Create wireframe
  - Day 2
    - Review D3 documentation and try a couple simple tutorials to get familiar with the D3 pattern
    - Setup skeleton for the project
    - Download data from website and begin sanitizing it for use within the application
  - Day 3
    - Begin implimenting the library
  - Day 4
    - Test visualization
    - Add filter functionality
  - Day 5
    - Go skiing in Tahoe, sample the goods myself
  - Day 6
    - Debug
  - Day 6
    - Style site

### CODE
#### Data download
```
  for year in `seq 2000 2005`;do for month in `seq 1 12`;do wget --content-disposition "http://climate.weather.gc.ca/climate_data/bulk_data_e.html?format=csv&stationID=2409&Year=${year}&Month=${month}&Day=14&timeframe=3&submit= Download+Data" ;done;done
```