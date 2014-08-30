var async = require('async');
var fs = require('fs');
var Hapi = require('hapi');
var extractImageMetadata = require('../../../../../extract-image-metadata.js');

module.exports = {
  method: 'GET',
  path: '/v1/timelapses/{id}/photos',
  handler: function (request, reply) {
    var id = request.params.id,
        query = request.query,
        detailed = request.query.detailed !== undefined ? request.query.detailed !== 'false' : false;

    var path = 'public/data/' + id,
        jsonFilename = 'data.json',
        jsonPath = path + '/' + jsonFilename,
        photosDirPath = path + '/frames';

    fs.exists(jsonPath, function(exists) {
      if (exists) {
        fs.readFile(jsonPath, {encoding : 'utf-8'}, function(err, data) {
          if (err) throw err;
          var content = JSON.parse(data);

          fs.readdir(photosDirPath, function(err, photoFilenames) {
            if (err) throw err;

            var iterator = function(photoFilename, callback){
              try {
                var frameStringMatch = photoFilename.match(/(\d+)/),
                    frame= frameStringMatch ? frameStringMatch[1] : null;
                var photoData = { filename: photoFilename,
                                  frame: frame, };
                if (detailed) {
                  extractImageMetadata(photosDirPath + '/' + photoFilename, photoData, function(err, photoData) {
                    if (err) throw err;
                    callback(null, photoData);
                  });
                } else {
                  callback(null, photoData);
                }
              } catch (err) {
                callback(null, null);
              }
            };

            var callback = function(err, results){
              results = results.filter(function(result) {
                return result && result.filename && result.frame !== null ? true : false;
              });
              content.photos = results;
              reply(content);
            };

            async.map(photoFilenames, iterator, callback);

          });
        });
      } else {
        reply(Hapi.error.notFound('Wrong id'));
      }
    });

  }
};
