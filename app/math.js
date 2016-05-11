define([], function () {

  function moveTwo(otherTerm){
    if(otherTerm < 0) result = otherTerm -2;
    else result = otherTerm + 2;
    return result;
  }

  return {
    moveTwo: moveTwo,
  };

});
