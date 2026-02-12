"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shuffleArrayIfId = exports.shuffleArray = exports.passwordValidator = exports.generatePassword = void 0;
function generatePassword(passwordLength) {
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
    return shuffleArray(randPasswordArray.map(function (x) {
        return x[Math.floor(Math.random() * x.length)];
    })).join('');
}
exports.generatePassword = generatePassword;
function passwordValidator(inputtxt) {
    var paswd = '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})';
    if (inputtxt.match(paswd)) {
        return true;
    }
    else {
        return false;
    }
}
exports.passwordValidator = passwordValidator;
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}
exports.shuffleArray = shuffleArray;
function shuffleArrayIfId(array, id) {
    return array.includes(id);
}
exports.shuffleArrayIfId = shuffleArrayIfId;
//# sourceMappingURL=user.helper.js.map