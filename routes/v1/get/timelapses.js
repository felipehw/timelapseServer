var async = require('async');
var fs = require('fs');

module.exports = {
  method: 'GET',
  path: '/v1/timelapses',
  handler: function (request, reply) {
    var path = 'public/data/';

    fs.readdir(path, function(err, filenames) {
      if (err) throw err;
      var iterator = function(dirname, callback){
        var jsonFilename = 'data.json',
            jsonPath = path + dirname + '/' + jsonFilename;
        fs.exists(jsonPath, function(exists) {
          if (exists) {
            fs.readFile(jsonPath, {encoding : 'utf-8'}, function(err, data) {
              if (err) throw err;
              var content = JSON.parse(data);
              callback(null, {id: content.id});
            });
          } else {
            callback(null, null);
          }
        });
      };
      var callback = function(err, results){
        if (err) throw err;
        results = results.filter(function(result) {
          return result && result.id ? true : false;
        });
        var replyJSON = { timelapses: results };
        reply(replyJSON);
      };

      async.map(filenames, iterator, callback);
    });
  }
};
