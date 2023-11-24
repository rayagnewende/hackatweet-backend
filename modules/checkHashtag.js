function checkHashtag(message) {
  const pattern =
    /#(\w+)/g; /*Pattern to check for hashtags inside the message! */

  const hashtag =
    message.match(
      pattern
    ); /*Here i am asking to check if the pattern is found then we have a hashtag if not then we return empty array.*/

  return hashtag;
}

module.exports = { checkHashtag };
