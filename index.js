let turn = "x";
let turnCount = 0;
let gameMode = "";
let playerO = "";
let playerX = "";
let gameOver = false;
let cpusTurn = false;
let statX = 0;
let statO = 0;
let statTie = 0;
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

//check if cookie is set
if (getCookie("gameMode")) {
    console.log("Cookie found! Restoring game state.");
    initalizeGame(true);
}


// --------------- button clicks ---------------

$(".btn-game").click(function (event) {
    const field = event.currentTarget.value;
    //check if field already is already set
    if ($(".img-game").eq(field).hasClass("fieldSet") || gameOver || cpusTurn) {
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
    // restartGame();  //only resets the current round
    //delete cookies and reload page to start game from scratch
    deleteCookies();
    location.reload();
});


$(".btn-quit").click(function (event) {
    deleteCookies();
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

        //only show the outlined icon, if the field is empty & game not over & not CPU's turn
        if ($(".img-game").eq(field).hasClass("hidden") && !gameOver && !cpusTurn) {
            $(".img-game").eq(field).attr("src", "./assets/icon-" + turn + "-outline-hover.svg");
            $(".img-game").eq(field).removeClass("hidden");
        }
    }, function (event) {
        //after hover
        const field = event.currentTarget.value;

        if ($(".img-game").eq(field).hasClass("fieldSet")) {
            //nothing
        } else {
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
        statX += 1;
        $(".bg-blue h2")[0].textContent = statX;
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
        statO += 1;
        $(".bg-yellow h2")[0].textContent = statO;
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
        statTie += 1;
        $(".bg-silver h2")[0].textContent = statTie;
        //Banner game tied
        removeBannerStyling()
        $(".line1").css("display", "none");
        $(".img-banner").css("display", "none");
        $(".span-banner")[0].innerText = "TIED";
        $(".span-banner").addClass("font-silver");
    }
}


function toggleBanner() {
    $(".absolute").toggleClass("hidden");
    $(".container").toggleClass("darker-span");
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


/**
 * @param  {string} icon x or o or empty if game tied
 * sets the game state to over and updates the banner and makes it visible
 * sets cookie of the current game state
 */
function gameEnd(icon) {
    gameOver = true;
    updateUiAfterGame(icon);
    toggleBanner();
    saveGameToCookie();
}

/**
 * Starts the new round
 * hides the Banner
 */
function nextRound() {
    restartGame();
    toggleBanner();
    checkWhoIsNext();
}


/**
 * @param  {boolean} cookie true if cookie is set
 */
function initalizeGame(cookie) {
    //if cookie is set, reload game - else initalize new game
    if (cookie) {
        restoreGameFromCookie();
    } else {
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
    }

    //hide menu and display game field
    $(".new-game-menu").hide();
    $(".game").css("display", "flex");

    //sees who makes the first turn and starts the game
    checkWhoIsNext();
}



// --------------- CPU Movement ---------------

function moveCpuRandom() {
    // cpusTurn = true;
    const field = Math.floor(Math.random() * (8 - 0 + 1) + 0);

    if ($(".img-game").eq(field).hasClass("hidden")) {
        setTimeout(() => {
            nextTurn(field);
            cpusTurn = false;
        }, 500)
    } else {
        console.error("CPU can't select this field!");
        moveCpuRandom();
    }
}

function moveCpu(field) {
    if ($(".img-game").eq(field).hasClass("hidden")) {
        setTimeout(() => {
            nextTurn(field);
            cpusTurn = false;
        }, 500)
    } else {
        console.error("Intelligence error!");
        moveCpuRandom();
    }
}


function checkWhoIsNext() {
    if (!gameOver) {
        if (turn === "x") {
            if (playerX === "CPU") {
                cpuNextMove();
            }
        } else {
            if (playerO === "CPU") {
                cpuNextMove();
            }
        }
    }

}


// --------------- Cookie Management ---------------

function setCookie(cname, cvalue, exdays) {
    const date = new Date();
    date.setTime(date.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + date.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function saveGameToCookie() {
    setCookie("gameMode", gameMode, 7);
    setCookie("playerO", playerO, 7);
    setCookie("playerX", playerX, 7);
    setCookie("statX", statX, 7);
    setCookie("statO", statO, 7);
    setCookie("statTie", statTie, 7);
    setCookie("statCardX", $(".stats-card p")[0].innerText, 7);
    setCookie("statCardO", $(".stats-card p")[2].innerText, 7);
}

function restoreGameFromCookie() {
    gameMode = getCookie("gameMode");
    playerO = getCookie("playerO");
    playerX = getCookie("playerX");
    statX = Number(getCookie("statX"));
    statO = Number(getCookie("statO"));
    statTie = Number(getCookie("statTie"));

    $(".stats-card p")[0].innerText = getCookie("statCardX");
    $(".stats-card p")[2].innerText = getCookie("statCardO");

    $(".bg-blue h2")[0].textContent = statX;
    $(".bg-yellow h2")[0].textContent = statO;
    $(".bg-silver h2")[0].textContent = statTie;
}

function deleteCookies() {
    setCookie("gameMode", "", -1);
    setCookie("playerO", "", -1);
    setCookie("playerX", "", -1);
    setCookie("statX", "", -1);
    setCookie("statO", "", -1);
    setCookie("statTie", "", -1);
    setCookie("statCardX", "", -1);
    setCookie("statCardO", "", -1);
}



// --------------- intelligent CPU ---------------


function cpuNextMove() {
    cpusTurn = true;
    let playerArray;
    let cpuArray;

    if (playerX === "CPU") {
        cpuArray = playerArrayX;
        playerArray = playerArrayO;
    } else {
        cpuArray = playerArrayO;
        playerArray = playerArrayX;
    }


    let helperVariable = 0;

    // 1. check if CPU could win
    helperVariable = checkIfPlayerCanWin(cpuArray);
    if (helperVariable !== -1) {
        moveCpu(helperVariable);
    } else {
        // 2. check if Player can win
        helperVariable = checkIfPlayerCanWin(playerArray);
        if (helperVariable !== -1) {
            moveCpu(helperVariable);
        } else {
            // 3. check which field is free, where cpu could make the next turn
            helperVariable = checkNextPossibleMove(cpuArray);
            if (helperVariable !== -1) {
                moveCpu(helperVariable);
            } else{
                // 4. random -> for now :)
                moveCpuRandom();
            }
        }
    }
}


/**
 * Returns the field in which player could end the game with, else returns -1
 * @param  {array} playerArray the Array of the Player or CPU to check
 * check if player is able the end the game in the next round
*/
function checkIfPlayerCanWin(playerArray) {
    let counter = 0;
    for (const winningCombination of winningCombinations) {
        //check if two fields match one winningCombination
        counter = 0;
        for (let i = 0; i < 3; i++) {
            if (playerArray.includes(winningCombination[i])) {
                counter += 1;
                if (counter === 2) {
                    //check which field is left to win the game
                    for (let i = 0; i < 3; i++) {
                        if (!playerArray.includes(winningCombination[i])) {
                            //check if field isn't already set by other player
                            if (!$(".img-game").eq(winningCombination[i]).hasClass("fieldSet")) {
                                return winningCombination[i];
                            }
                        }
                    }
                }
            }
        }
    }
    return -1;
}



/**
 * Returns the field in which the CPU could make the next useful move,
 * if there is no useful move, return -1 
 * @param  {} cpuArray the Array of the CPU
 */
function checkNextPossibleMove(playerArray) {
    let counter = 0;
    for (const subArray of winningCombinations) {
        //check if one field matches a field of a winningCombination
        counter = 0;
        for (let i = 0; i < 3; i++) {
            if (playerArray.includes(subArray[i])) {
                //check if both fields aren't already set by the other player
                for (let i = 0; i < 3; i++) {
                    if (!playerArray.includes(subArray[i])) {
                        if (!$(".img-game").eq(subArray[i]).hasClass("fieldSet")) {
                            counter += 1;
                            if (counter === 2) {
                                return subArray[i];
                            }
                        }
                    }
                }
            }
        }
    }
    return -1;
}