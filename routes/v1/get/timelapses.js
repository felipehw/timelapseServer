module.exports = {
  method: 'GET',
  path: '/v1/timelapses',
  handler: function (request, reply) {
    var replyContent = {
      timelapses: [
        {
          id: 'fpolis-20140601U123121' // data de criação
        },
        {
          id: 'fpolis-20130601U123121' // data de criação
        },
      ]
    };
    reply( JSON.stringify(replyContent) );
  }
};
