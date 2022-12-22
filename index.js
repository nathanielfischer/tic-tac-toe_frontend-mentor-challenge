let turn = "x";
let turnCount = 0;
let gameMode = "";
let playerO = "";
let playerX = "";
let gameOver = false;
const playerArrayX = [];
const playerArrayO = [];

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 4, 6],
    [2, 5, 8]
];


// --------------- "Event Listener" ---------------

$(".btn-game").click(function (event) {
    const field = event.currentTarget.value;
    //check if field already is already set
    if ($(".img-game").eq(field).hasClass("fieldSet")) {
        console.error("Can't select this field!");
    } else {
        nextTurn(field);
        checkWhoIsNext();
    }

});


$(".new-game-player").click(function (event) {
    gameMode = "Player";
    initalizeGame();
});

$(".new-game-cpu").click(function (event) {
    gameMode = "CPU";
    initalizeGame();
});


$(".btn-restart").click(function (event) {
    restartGame();
});


$(".btn-quit").click(function (event) {
    location.reload();
});

$(".btn-next-round").click(function (event) {
    nextRound();
});


// --------------- mouseover events ---------------
/**
 * show the outlined icon on the field when the user hovers over it
 * only shows the outlined icon, if the field is not set, yet
 */
$(".btn-game").hover(
    function (event) {
        const field = event.currentTarget.value;

        //only show the outlined icon, if the field is empty
        if ($(".img-game").eq(field).hasClass("hidden")) {
            $(".img-game").eq(field).attr("src", "./assets/icon-" + turn + "-outline-hover.svg");
            $(".img-game").eq(field).removeClass("hidden");
        }
    }, function (event) {
        //after hover
        const field = event.currentTarget.value;
        
        if($(".img-game").eq(field).hasClass("fieldSet")){
            
        }else{
            $(".img-game").eq(field).addClass("hidden");
        }
        
    }
);




// --------------- helper functions ---------------

/**
 * @param  {string} icon x or o
 * @param  {number} field Number between 0 to 8
 */
function setIconOnField(icon, field) {
    $(".img-game").eq(field).attr("src", "./assets/icon-" + icon + ".svg");
    $(".img-game").eq(field).removeClass("hidden");
    $(".img-game").eq(field).addClass("fieldSet");
}

/**
 * @param  {string} icon x or o
 * updates the information which player's turn it is
 */
function updateUiTurn(icon) {
    if (icon === "x") {
        $(".img-turn").attr("src", "./assets/icon-x-outline.svg");
    } else {
        $(".img-turn").attr("src", "./assets/icon-o-outline-silver.svg");
    }
}

/**
 * @param  {string} icon x or o or empty if game tied
 * updates the stats
 * updates the data in the banner
 */
function updateUiAfterGame(icon) {
    // line1 = $(".line1")[0].textContent;
    // line2Svg = $(".img-banner").attr("src");
    // line2Text = $(".span-banner")[0].innerText;

    if (icon === "x") {
        let currentStat = Number($(".bg-blue h2")[0].textContent);
        currentStat += 1;
        $(".bg-blue h2")[0].textContent = currentStat;
        //Banner X won
        removeBannerStyling()
        $(".img-banner").attr("src", "./assets/icon-x.svg");
        $(".span-banner")[0].innerText = " TAKES THE ROUND";
        $(".span-banner").addClass("font-blue");

        if (playerX === "CPU") {
            $(".line1")[0].textContent = "OH NO, YOU LOST...";
        } else if (gameMode === "CPU") {
            $(".line1")[0].textContent = "YOU WON!";
        } else {
            $(".line1")[0].textContent = playerX.toUpperCase() + " WINS!";
        }

    } else if (icon === "o") {
        let currentStat = Number($(".bg-yellow h2")[0].textContent);
        currentStat += 1;
        $(".bg-yellow h2")[0].textContent = currentStat;
        //Banner O won
        removeBannerStyling()
        $(".img-banner").attr("src", "./assets/icon-o.svg");
        $(".span-banner")[0].innerText = " TAKES THE ROUND";
        $(".span-banner").addClass("font-yellow");

        if (playerO === "CPU") {
            $(".line1")[0].textContent = "OH NO, YOU LOST...";
        } else if (gameMode === "CPU") {
            $(".line1")[0].textContent = "YOU WON!";
        } else {
            $(".line1")[0].textContent = playerO.toUpperCase() + " WINS!";
        }

    } else {
        let currentStat = Number($(".bg-silver h2")[0].textContent);
        currentStat += 1;
        $(".bg-silver h2")[0].textContent = currentStat;
        //Banner game tied
        removeBannerStyling()
        console.log("tied");
        $(".line1").css("display", "none");
        $(".img-banner").css("display", "none");
        $(".span-banner")[0].innerText = "TIED";
        $(".span-banner").addClass("font-silver");
    }
}


function toggleBanner() {
    $(".absolute").toggleClass("hidden");
}

function removeBannerStyling() {
    $(".span-banner").removeClass("font-yellow");
    $(".span-banner").removeClass("font-silver");
    $(".span-banner").removeClass("font-blue");
    $(".line1").css("display", "block");
    $(".img-banner").css("display", "inline");
}


// --------------- game functions ---------------


/**
 * @param  {number} field which field was clicked by the user
 * Updates all necessary data, like the display who is next
 * and pushes the field number to the current players playerArray
 */
function nextTurn(field) {
    setIconOnField(turn, field);
    turnCount += 1;

    if (turn === "x") {
        playerArrayX.push(Number(field));
        checkIfWon();
        turn = "o";
        updateUiTurn(turn);
    } else {
        playerArrayO.push(Number(field));
        checkIfWon();
        turn = "x";
        updateUiTurn(turn);
    }
}

/**
 * sets all variables to the inital state
 * updates the ui to the inital state
 */
function restartGame() {
    turn = "x";
    turnCount = 0;
    gameOver = false;
    updateUiTurn(turn);
    playerArrayX.length = 0;
    playerArrayO.length = 0;
    for (let index = 0; index < 9; index++) {
        $(".img-game").eq(index).addClass("hidden");
        $(".img-game").eq(index).removeClass("fieldSet");
    }
}


/**
 * check each winningCombination if each number is included in playerArray
 * TODO: implement winning output
 */
function checkIfWon() {
    var someoneWon = false;
    for (const subArray of winningCombinations) {
        if (turn === "x") {
            if (playerArrayX.includes(subArray[0])
                && playerArrayX.includes(subArray[1])
                && playerArrayX.includes(subArray[2])) {
                gameEnd("x");
                someoneWon = true;
                break;
            }
        } else {
            if (playerArrayO.includes(subArray[0])
                && playerArrayO.includes(subArray[1])
                && playerArrayO.includes(subArray[2])) {
                gameEnd("o");
                someoneWon = true;
                break;
            }
        }
    }
    if (turnCount === 9 && !someoneWon) {
        gameEnd();
    }
}


function gameEnd(icon) {
    gameOver = true;
    updateUiAfterGame(icon);
    toggleBanner();
    // restartGame();
}

function nextRound() {
    restartGame();
    toggleBanner();
    checkWhoIsNext();
}


function initalizeGame() {
    if ($("#chooseIcon")[0].checked) {
        playerO = "Player 1";
        if (gameMode === "CPU") {
            playerX = "CPU";
            $(".stats-card p")[0].innerText = "X (CPU)";
            $(".stats-card p")[2].innerText = "O (YOU)";
        } else {
            playerX = "Player 2";
            $(".stats-card p")[0].innerText = "X (Player 2)";
            $(".stats-card p")[2].innerText = "O (Player 1)";
        }
    } else {
        playerX = "Player 1";
        if (gameMode === "CPU") {
            playerO = "CPU";
            $(".stats-card p")[0].innerText = "X (YOU)";
            $(".stats-card p")[2].innerText = "O (CPU)";
        } else {
            playerO = "Player 2";
            $(".stats-card p")[0].innerText = "X (Player 1)";
            $(".stats-card p")[2].innerText = "O (Player 2)";
        }
    }

    console.log("x: " + playerX + " & " + "o: " + playerO);
    $(".new-game-menu").hide();
    $(".game").css("display", "flex");

    checkWhoIsNext();
}



// --------------- CPU Movement ---------------

function moveCpu() {
    const field = Math.floor(Math.random() * (8 - 0 + 1) + 0);

    if ($(".img-game").eq(field).hasClass("hidden")) {
        setTimeout(() => {
            nextTurn(field);
        }, 500)
    } else {
        console.error("CPU can't select this field!");
        moveCpu();
    }
}


function checkWhoIsNext() {
    if (!gameOver) {
        if (turn === "x") {
            if (playerX === "CPU") {
                moveCpu();
            }
        } else {
            if (playerO === "CPU") {
                moveCpu();
            }
        }
    }

}


