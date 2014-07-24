module.exports = {
  method: 'GET',
  path: '/v1/timelapses/{id}',
  handler: function (request, reply) {
    var id = request.params.id;
    var replyContent = {
      id: 'fpolis-20140601U123121',
      name: 'Florianópolis',
      place: 'Florianópolis',
      startTime: '20140601U123121',
      endTime: '20140601U123121',
      lapse: 10000, //ms
      frames: 2000,
    };
    reply( JSON.stringify(replyContent) );
  }
};
