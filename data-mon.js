// monitora criação de novos frames e envia p/ clientes websockets
var async = require('async');
var watch = require('watch');

var extractDataForFrame = function(pathPlusFilename) {
  var frameStringMatch = pathPlusFilename.match(/^public\/data\/(\w+-\w+)\/frames\/(\w+\.jpg)$/),
      dataForFrame = null;

  if (frameStringMatch) {
    var id = frameStringMatch[1] ? frameStringMatch[1] : null,
        filename = frameStringMatch[2] ? frameStringMatch[2] : null,
        frameNumberStringMatch = filename ? filename.match(/(\d+)/) : null,
        frame = frameNumberStringMatch ? frameNumberStringMatch[1] : null;
    if (frame !== null) {
      dataForFrame = {
        "id": id,
        "photos": [
          { "filename": filename,
            "frame": frame },
        ]
      }
    }
  }
  return dataForFrame;
};

module.exports = function dataMon(options){
  var dir = 'public/data/';
  watch.createMonitor(dir, function (monitor) {
    monitor.on("created", function (f, stat) {
      // Handle new files
      // f === 'public/data/fpolis-20140601U123121/frames/frame000.jpg'
      var dataForFrame = extractDataForFrame(f);
      if ( dataForFrame ) {
        console.log(dataForFrame);
      } else {
        console.log("Don't match the frame format: " + f);
      }
    })
    /*
    monitor.on("changed", function (f, curr, prev) {
      console.log('changed: ' + f); // Handle file changes
    })
    monitor.on("removed", function (f, stat) {
      console.log('removed: ' + f); // Handle removed files
    })
    */
    //monitor.stop(); // Stop watching
  })
  console.log('Data monitoring Up');
};
