import React, { Component } from 'react';
import './App.css';
import { status, json, makeGraph } from './helpers.js'

class App extends Component {
  componentDidMount() {
    // get json data and make graph
    fetch(
      "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json"
    )
      .then(status)
      .then(json)
      .then(data => {
        makeGraph(data.monthlyVariance);
      });
  }
  render() {
    return (
      <div className="App">
        <h1>Monthly Global Land-Surface Temperature Heat Map</h1>
        <h2>Variance in temperatures between 1753 and 2015</h2>
        <h3>Temperatures are in Celsius and reported as anomalies relative to the Jan 1951-Dec 1980 average. Estimated Jan 1951-Dec 1980 absolute temperature ℃: 8.66 +/- 0.07</h3>
        <div className="svg-container"></div>
      </div>
    );
  }
}

export default App;
