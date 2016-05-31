define([], function () {
    return {
      generate: function(password){
        return bcrypt.hashSync(password, 10);
      },
      verify: function(password,hashed){
        return bcrypt.compareSync(password, hashed);
      }
    };
});
