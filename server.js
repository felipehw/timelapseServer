var Hapi = require('hapi');
var server = new Hapi.Server(3000, {cors : true});

var getTimelapsesRoute = require('./routes/v1/get/timelapses.js');
var getTimelapsesTimelapseRoute = require('./routes/v1/get/timelapses/timelapse.js');
var getTimelapsesTimelapsePhotosRoute = require('./routes/v1/get/timelapses/timelapse/photos.js');
var dataMon = require('./data-mon.js');

server.route(getTimelapsesRoute);
server.route(getTimelapsesTimelapseRoute);
server.route(getTimelapsesTimelapsePhotosRoute);

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
  dataMon(server.listener);
  console.log('Server running at:', server.info.uri);
});

