export function generatePassword(passwordLength: number) {
  var numberChars = '0123456789';
  var upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var lowerChars = 'abcdefghijklmnopqrstuvwxyz';
  var vaChars = '!@#$%^&*';
  var allChars = numberChars + upperChars + lowerChars + vaChars;
  var randPasswordArray = Array(passwordLength);
  randPasswordArray[0] = numberChars;
  randPasswordArray[1] = upperChars;
  randPasswordArray[2] = lowerChars;
  randPasswordArray = randPasswordArray.fill(allChars, 3);
  return shuffleArray(
    randPasswordArray.map(function (x) {
      return x[Math.floor(Math.random() * x.length)];
    }),
  ).join('');
}
export function passwordValidator(inputtxt: string) {
  var paswd: string =
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})';
  if (inputtxt.match(paswd)) {
    //console.log('Your validate password  Correct:'+inputtxt);
    return true;
  } else {
    //console.log('You validate password Wrong :'+inputtxt);
    return false;
  }
}
export function shuffleArray(array: any) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}
export function shuffleArrayIfId(array: any, id: number) {
  return array.includes(id);
}
