let friends = []; // Initialize to empty
var picturesArr = [];
var cardsFlipped = [];
var currCardsFlipped = [];
var cardsMatchedCount = 0;
var expectedCardsCount = 0;
var totalScore = 0;
var gameScoreElement = document.getElementById("score");

function generate_board() {

    friends.length = 0;
    picturesArr.length = 0;

    gameScoreElement.textContent = `Total Score: 0`;

    //============================================================================
    // Task 1
    // Retrieve the friend name(s) from the 'friends' multi-select dropdown menu
    //============================================================================

    // Array to contain the names of user-selected friend(s)
    // For example, if the user selected 'Darryl' and 'Yin Kit',
    //   this array's value will be:
    //      [ 'darryl', 'yinkit' ]
    //


    // YOUR CODE GOES HERE
    var selectFriends = document.getElementById("friends");
    for (var i = 0; i < selectFriends.options.length; i++) {
        if (selectFriends.options[i].selected) {
            friends.push(selectFriends.options[i].value);
        }
    }

    // Display user's selection in Developer Tools --> Console.
    console.log(friends);



    //============================================================================
    // Task 2
    // Given one or more selected friends and given 4 fruit names,
    //   generate a 'randomized' Array of finalized card names.
    // 
    // Card names are as follows:
    //    apple_brandon.png
    //    banana_brandon.png
    //    kiwi_brandon.png
    //    orange_brandon.png
    //
    // where 'brandon' can be replaced with another friend's name,
    // e.g.
    //    apple_nick.png
    // (and so on)
    //
    // Display all 4 fruit cards of one or more selected friends.
    //
    // NOTE: Each card must be displayed TWO and ONLY TWO times (thus, a "pair")
    //       (such that the user can attempt to 'match').
    //
    // Check out this utility function (declared at the bottom of this file)
    //   for randomizing the order of Array elements.
    //        shuffleArray()
    //============================================================================
    const fruits = ['apple', 'banana', 'kiwi', 'orange'];

    // YOUR CODE GOES HERE
    for (var i = 0; i < friends.length; i++) {
        for (var f = 0; f < fruits.length; f++) {
            picturesArr.push(`${fruits[f]}_${friends[i]}`);
            picturesArr.push(`${fruits[f]}_${friends[i]}`);
        }
    }

    picturesArr = shuffleArray(picturesArr);



    //============================================================================
    // Task 3
    // Display the cards in <div id="game-board">
    //
    // For this, we will make use of Template Literal (using backticks).
    //
    // NOTE: The game board will always have 4 columns and N rows, where N denotes
    //       (number of selected friends) x 2.
    //
    //       For example, if I chose 'Brandon', 'Darryl', and 'Nick' (3 friends),
    //         then the newly generated game board will be
    //         6 (rows) by 4 (columns).
    //============================================================================
    const num_cols = fruits.length;
    const num_rows = friends.length * 2;
    expectedCardsCount = num_cols * num_rows;
    console.log("# of columns: " + num_cols)
    console.log("# of rows: " + num_rows);


    // YOUR CODE GOES HERE


    // You will need to rewrite the value of this result_str (String).
    let result_str = '';
    var fruit_index = 0;
    for (var i = 0; i < num_rows; i++) {
        result_str += `<div class='row'>`;
        for (var c = 0; c < num_cols; c++) {
            result_str += `<div class='column'>`;
            result_str += `<img src='cards/hidden.png' id=${fruit_index} onclick='flipCard(this)'/>`
            fruit_index++;
            result_str += `</div>`;
        }
        result_str += `</div>`;
    }


    // DO NOT MODIFY THE FOLLOWING
    // Replace the innerHTML of <div id="game-board">
    //   with a newly prepared HTML string (result_str).
    document.getElementById('game-board').innerHTML = result_str;
}

function flipCard(imgElement) {
    if (!cardsFlipped.includes(imgElement.id) && imgElement.src.includes('hidden')) {
        if (currCardsFlipped.length < 2) {
            imgElement.src = `cards/${picturesArr[imgElement.id]}.png`;
            currCardsFlipped.push(`${imgElement.id}`);

            if (currCardsFlipped.length === 2) {
                var card1 = currCardsFlipped[0];
                var card2 = currCardsFlipped[1];

                if (picturesArr[card1] === picturesArr[card2]) {
                    totalScore++;
                    cardsMatchedCount += 2;
                    gameScoreElement.textContent = `Total Score: ${totalScore}`;
                    updateCardsFlipped(card1, card2);
                    isGameOver(cardsMatchedCount, expectedCardsCount);
                    setTimeout(function () {
                        document.getElementById(card1).style.opacity = 0.5;
                        document.getElementById(card2).style.opacity = 0.5;
                        currCardsFlipped.length = 0;
                    }, 2000);
                }

                else {
                    setTimeout(function () {
                        document.getElementById(card1).src = 'cards/hidden.png';
                        document.getElementById(card2).src = 'cards/hidden.png';
                        currCardsFlipped.length = 0;
                    }, 2000);
                }
            }
        }
    }
}

function updateCardsFlipped(card1, card2) {
    cardsFlipped.push(card1);
    cardsFlipped.push(card2);
    document.getElementById(card1).style.pointerEvents = 'none';
    document.getElementById(card2).style.pointerEvents = 'none';
}

function isGameOver(cardsMatchedCount, expectedCardsCount) {
    if (expectedCardsCount === cardsMatchedCount) {
        gameScoreElement.textContent = `All Matched, Congratulations!`;
        cardsFlipped.length = 0;
        currCardsFlipped.length = 0;
        cardsMatchedCount = 0;
        expectedCardsCount = 0;
        totalScore = 0;
    }
}




// Utility Function
// DO NOT MODIFY
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
}