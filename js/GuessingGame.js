var guessingGame = {}; 
(function() {

    var game = new Game();
  $(document).ready(function() {
    guessingGame.game = game;

    $('#player-input').keypress(function(event) {
        if ( event.which == 13 ) {
           makeAGuess(game);
        }
    });

    $('#submit').click(function() {
      makeAGuess(game);
    })

    $('#hint').click(function() {
        var hints = game.provideHint();
        $('#title').text('The winning number is '+hints[0]+', '+hints[1]+', or '+hints[2]);
    });

    $('#reset').click(function() {
        game = newGame();
        $('#title').text('Play the Guessing Game!');
        $('#subtitle').text('Guess a number between 1-100!')
        $('.guess').text('-');
        $('.status').attr('src', 'img/question.png');
        $('#hint, #submit').prop("disabled",false);

    });
  });

  function generateWinningNumber() {
    return Math.ceil(Math.random()*100);
  }

  function fadeIn(elem) {
    $(elem).css({opacity:0});
    $(elem).animate({opacity:1},1000);
  }

  function makeAGuess(game) {
    var guess = $('#player-input').val();
    $('#player-input').val("");
    var output = game.playersGuessSubmission(parseInt(guess,10));
    $('#title').text(output.txt);
    $('.guess')[game.pastGuesses.length-1].innerText = guess;
    setImg(output.status);
    fadeIn($('.guess')[game.pastGuesses.length-1]);
    fadeIn($('.status')[game.pastGuesses.length-1]);
  }

  function setImg(status) {
    var src = 'question.png';
    switch(status) {
      case 1: src = 'ice-cubes.png'; break;
      case 2: src = 'ice-small.png'; break;
      case 3: src = 'fire-small.png'; break;
      case 4: src = 'fire.png'; break;
      case 5: src = 'checkmark.png'; break;
    }

    $('.status')[game.pastGuesses.length-1].src = 'img/' + src;
  }

  function shuffle(array) {
    var m = array.length, t, i;
    while (m) {
      i = Math.floor(Math.random() * m--);
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }
    return array;
  }

  function Game() {
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
  }

  Game.prototype.difference = function() {
    return Math.abs(this.playersGuess-this.winningNumber);
  };

  Game.prototype.isLower = function() {
    return this.playersGuess < this.winningNumber;
  };

  Game.prototype.playersGuessSubmission = function(guess) {
    if(guess < 1 || guess > 100 || typeof guess != 'number') throw 'That is an invalid guess.';
    this.playersGuess = guess;
    return this.checkGuess();
  };

  Game.prototype.checkGuess = function() {
    var theGuess = this.playersGuess,
    winningNum = this.winningNumber;

    if(this.pastGuesses.indexOf(theGuess) > -1) return 'You have already guessed that number.'
    this.pastGuesses.push(theGuess);
    if(this.pastGuesses.length === 5 && theGuess != winningNum) return {status:0, txt:'You Lose.'};
    if(theGuess === winningNum) return {status:5, txt:'You Win!'};
    if(this.difference() < 10) return {status:4, txt:'You\'re burning up!'};
    if(this.difference() < 25) return {status:3, txt:'You\'re lukewarm.'};
    if(this.difference() < 50) return {status:2, txt:'You\'re a bit chilly.'};
    if(this.difference() < 100) return {status:1, txt:'You\'re ice cold!'};

    return '';
  }

  Game.prototype.provideHint = function() {
    return shuffle([this.winningNumber, generateWinningNumber(), generateWinningNumber()]);
  }

  function newGame() {
    return new Game();
  }

})();
