module.exports = {
  method: 'GET',
  path: '/v1/timelapses/{id}/photos',
  handler: function (request, reply) {
    var id = request.params.id;
    var replyContent = {
      id: 'fpolis-20140601U123121',
      photos: [
        {
          filename: 'frame000.jpg',
          width: 1280, //px
          height: 720, //px
          date: '20140601U123121',
          frame: 000,
          //data: 'asdasd132qsad', //base64 //melhor usar o filename p/ compor path
        },
      ]
    };
    reply( JSON.stringify(replyContent) );
  }
};
