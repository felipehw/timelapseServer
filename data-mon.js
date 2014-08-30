// monitora criação de novos frames e envia p/ clientes websockets
var async = require('async');
var watch = require('watch');
var SocketIO = require('socket.io');
var EventEmitter = require("events").EventEmitter;
var extractImageMetadata = require('./extract-image-metadata.js');

var extractDataOfFrame = function(pathPlusFilename, callback) {
  var frameStringMatch = pathPlusFilename.match(/^public\/data\/(\w+-\w+)\/frames\/(\w+\.jpg)$/),
      photoData = null,
      formatedData = null;

  if (frameStringMatch) {
    var id = frameStringMatch[1] ? frameStringMatch[1] : null,
        filename = frameStringMatch[2] ? frameStringMatch[2] : null,
        frameNumberStringMatch = filename ? filename.match(/(\d+)/) : null,
        frame = frameNumberStringMatch ? frameNumberStringMatch[1] : null;

    if (frame !== null) {
      photoData = { "filename": filename, "frame": frame };
      extractImageMetadata(pathPlusFilename, photoData, function(err, photoData) {
        if (err) throw err;
        formatedData = { "id": id, "photos": [ photoData ] };
        callback(null, formatedData);
      });
    }
    callback(null, null);
  }
  callback(null, null);

};

module.exports = function dataMon(listener, options){
  var io = SocketIO.listen(listener);
  var notifierNewFrame = new EventEmitter();
  var dir = 'public/data/';


  io.sockets.on('connection', function (socket) {
    var sendDataOfFrame = function(dataOfFrame) {
      console.log('Send data\'s frame of timelapse "' + dataOfFrame.id + '" for client WebSocket: ' + socket.id);
      socket.emit('frame', dataOfFrame);
    };

    console.log('Client has made a WebSocket connection: ' + socket.id);

    notifierNewFrame.on('newFrame', sendDataOfFrame);

    socket.on('disconnect', function() {
      console.log('Client WebSocket has disconnected: ' + socket.id);
      // need remove listener for don't try send to dead sockets
      notifierNewFrame.removeListener('newFrame', sendDataOfFrame);
    });
  });

  watch.createMonitor(dir, function (monitor) {
    monitor.on("created", function (f, stat) {
      // Handle new files
      // f === 'public/data/fpolis-20140601U123121/frames/frame000.jpg'
      extractDataOfFrame(f, function(err, dataOfFrame) {
        if (err) throw err;
        if ( dataOfFrame ) {
          console.log('New frame detected of timelapse: ' + dataOfFrame.id);
          notifierNewFrame.emit('newFrame', dataOfFrame);
        } else {
          console.log("Don't match the frame format: " + f);
        }
      });
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
  console.log('Data Change Monitor (using WebSocket) Up');
};
