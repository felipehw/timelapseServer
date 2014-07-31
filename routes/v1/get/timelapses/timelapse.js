var fs = require('fs');
var Hapi = require('hapi');

module.exports = {
  method: 'GET',
  path: '/v1/timelapses/{id}',
  handler: function (request, reply) {
    var id = request.params.id;
    var path = 'public/data/' + id,
        jsonFilename = 'data.json',
        jsonPath = path + '/' + jsonFilename;

    fs.exists(jsonPath, function(exists) {
      if (exists) {
        fs.readFile(jsonPath, {encoding : 'utf-8'}, function(err, data) {
          if (err) throw err;
          var content = JSON.parse(data);
          reply(content);
        });
      } else {
        reply(Hapi.error.notFound('Wrong id'));
      }
    });
  }
};
