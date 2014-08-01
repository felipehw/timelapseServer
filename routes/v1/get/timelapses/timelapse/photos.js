var async = require('async');
var fs = require('fs');
var Hapi = require('hapi');
var ExifImage = require('exif').ExifImage;

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
                  new ExifImage({ image : photosDirPath + '/' + photoFilename }, function (err, exifData) {
                    if (err) {
                      console.log('Error in extracting metadata with exif from "' + photoFilename + '": '+err.message);
                      callback(null, null);
                    } else {
                      var dateStringMatch = exifData.exif.CreateDate.match(/^(\d{4}):(\d{2}):(\d{2})\s(\d{2}):(\d{2}):(\d{2})$/),
                          dateData = dateStringMatch ? {
                            year: dateStringMatch[1],
                            month: dateStringMatch[2] - 1,
                            day: dateStringMatch[3],
                            hour: dateStringMatch[4],
                            minute: dateStringMatch[5],
                            second: dateStringMatch[6],
                          } : null,
                          date = dateData ? new Date(dateData.year, dateData.month, dateData.day, dateData.hour, dateData.minute, dateData.second) : null;

                      photoData.width = exifData.image.ImageWidth;
                      photoData.height = exifData.image.ImageHeight;
                      photoData.date= date;
                      //photoData.data = 'BASE64'; // leria c/ 'fs.readFile()' e converteria o buffer c/ 'buf.toString('base64')'

                      callback(null, photoData);
                    }
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
