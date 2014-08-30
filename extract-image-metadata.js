var ExifImage = require('exif').ExifImage;

var extractImageMetadata = function(photoPath, photoData, callback) {
  photoData = photoData ? photoData : {};
  new ExifImage({ image : photoPath }, function (err, exifData) {
    if (err) {
      console.log('Error in extracting metadata with exif from "' + photoPath + '": '+err.message);
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
};

module.exports = extractImageMetadata;
