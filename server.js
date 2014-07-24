var Hapi = require('hapi');
var server = new Hapi.Server(3000);

var getTimelapses = require('./routes/v1/get/timelapses.js');
var getTimelapsesTimelapse = require('./routes/v1/get/timelapses/timelapse.js');
var getTimelapsesTimelapsePhotos = require('./routes/v1/get/timelapses/timelapse/photos.js');

server.route(getTimelapses);
server.route(getTimelapsesTimelapse);
server.route(getTimelapsesTimelapsePhotos);

server.route({
  method: 'GET',
  path: '/{param*}',
  handler: {
    directory: {
      path: 'public',
      //listing: true,
      index: true,
      lookupCompressed: true,
      defaultExtension: 'html',
    }
  }
});

server.start(function () {
    console.log('Server running at:', server.info.uri);
});
