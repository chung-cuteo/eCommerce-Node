"use strict";

const mongoose = require("mongoose");
const process = require("process")
const os = require('os')

const SECONDS = 5000


// check count connect
const countConnect = () => {
  const numberOfConnections = mongoose.connections.length;
  console.log("number of connection::: " + numberOfConnections);
};


// check over load with core and memory on server

const checkOverload = ()=> {
  setInterval(()=>{
    const numberOfConnections = mongoose.connections.length;
    const numCores = os.cpus().length
    const memoryUsage = process.memoryUsage().rss
    const maxConnections = numCores * 5

    console.log('Active Connections::' + numberOfConnections)
    console.log('Memory usage::' + memoryUsage / 1024 / 1024 + ' MB')

    if(numberOfConnections > maxConnections) {
      console.log('Connections overload detected')
      // notify.send() // report for team
    }

  }, SECONDS) // monitor every 5 seconds
}

module.exports = {
  countConnect,
  checkOverload
};
