
module.exports = string => {
  let output = string[0];

  for (let i = 1; i < string.length; i++) {
    if (i & 1) {
      output += string.charAt(i);
    } else {
      output += ' ' + string.charAt(i);
    }
  }

  return output;
};
