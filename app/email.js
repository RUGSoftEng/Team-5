define(['app/config', 'app/messages', 'app/lang'], function(config, messages, lang) {
  function checkSendgrid() {
    return (sendgrid !== "undefined");
  }

  var email = {
    send: function(to, subject, text, callback) {
      if (checkSendgrid()) {
        sendgrid.send({
          to: to,
          from: config.constant("CONTACT_NOREPLY"),
          subject: subject,
          text: text
        }, function(err, json) {
          if (err) {
            return console.error(err);
          }
          console.log(json);
          callback();
        });
      }
    }
  };
  return email;
});
