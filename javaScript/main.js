window.onload = init;


let objResult = {
    idImgArray: [],
    arrayRandomValue: [],
    arrSetInterval: [],
    arrCheckedBox: [],
    currentAccountPlayer: 0,
    currentAccountBot: 0,
    haseMoveIsIt: "player",
    resultingArrCombination: [],
    party: 0,
    gamerScore: 0,
    botScore: 0,
    winner: ""
}

function init() {
    let buttonStart = document.querySelector("#gameButton");
    buttonStart.addEventListener("click", startChangeDice);
}

function startChangeDice() {
    objResult.idImgArray = [];
    objResult.arrayRandomValue = [];
    objResult.arrSetInterval = [];
    objResult.arrCheckedBox = [];
    let arrIdimg = [];
    let gameArr = [];
    //создаем массив ссылок
    for (let i = 1; i < 6; i++) {
        let idchange = `#imgDice${i}`;
        let imgchange = document.querySelector(idchange);
        arrIdimg.push(imgchange);
    }

    //создаем массив чисел соответствующих картинкам 
    for (let y = 0; y < arrIdimg.length; y++) {
        changed1Img(arrIdimg[y]); // запускаем функцию изменения определенной картинки в определеном промежутке времени

        gameArr.push(createRandomNumb());
    }
    let compare = (a, b) => a - b;
    let sortArr = gameArr.sort(compare);
    objResult.arrayRandomValue = sortArr; //присваиваем свойству объекта значение массива;
    objResult.idImgArray = arrIdimg;  //присваиваем свойству объекта значение массива;
    setTimeout(deleteSetIntervalImg, 2000); // картинки меняются со скоростью 100мс и отложенная функция удаляет данный интервал, чтобы можно было присвоить конкретной картинке img#id - картинку соответствующую числу из массива рандомных чисел "objResult.arrayRandomValue"

}


function changed1Img(selected) {
    let numImg = 1;
    let newImageId = setInterval(function () {

        if (numImg < 6) {
            selected.src = `./image/${numImg}.png`;
            numImg++;
        } else {
            selected.src = `./image/${numImg}.png`;
            numImg = 1;
        }
    }, 100);

    objResult.arrSetInterval.push(newImageId); //записывает массив id для отмены setInterval в объект свойство arrSetInterval
}


function createRandomNumb() {// возвращает псевдо-рандомное число
    let rand = Math.floor(Math.random() * (6 - 1 + 1) + 1);
    return rand;
}


function deleteSetIntervalImg() {
    for (let i = 0; i < 5; i++) {
        clearInterval(objResult.arrSetInterval[i]);//удаляет интервал замен картинок
        drowRandImg(i); //присваивает определенную картинку в соответствии с индексом в массиве рандомных чисел
        if (i == 4 && objResult.haseMoveIsIt !== "bot") {
            rollingTheDice(); // показывает checkboses и кнопки переброса выбранных костей и продолжения без переброса костей удаляет обработчик с кнопки Game чтобы при повторном нажатии до завершения конкретного игрового цикла не вносились не учтенные изменнения
        }
    }
    if (objResult.haseMoveIsIt == "bot") {
        resultArrCombination();
    }
}


function drowRandImg(numId) { // прорисовывает картинку соответствующую переданному индексу по id 
    objResult.idImgArray[numId].src = `./image/${objResult.arrayRandomValue[numId]}.png`;

}


function rollingTheDice() { // показывает checkboses и кнопки переброса выбранных костей и продолжения без переброса костей удаляет обработчик с кнопки Game чтобы при повторном нажатии до завершения конкретного игрового цикла не вносились не учтенные изменнения
    let content = document.querySelector(".rollingDiceContainer");
    content.style = "display:block"; //делаем видимым соответствующий контейнер
    let buttonStartDelete = document.querySelector("#gameButton");
    buttonStartDelete.removeEventListener("click", startChangeDice); // удаляем обработчик с кнопки 
    console.log(objResult.arrayRandomValue);
    addListenerRollLeaveButton()
}

function addListenerRollLeaveButton() { //добавляем обработчики к кнопкам RollButton и Leave, запускаем функцию создания массива с выбранными и невыбранными checkbox
    let rollButton = document.querySelector("#rollButton");
    rollButton.addEventListener("click", createSelectedArr)//создаем массив с выбранными и не выбранными checkbox - где 10 выбранный checkbox, а -55 - не выбранный при клике на кнопку rollButton

    let leaveButton = document.querySelector("#leaveButton");
    leaveButton.addEventListener("click", hideTheButtons)

    objResult.haseMoveIsIt = "rollingPlayer";

    resultArrCombination();

}

function resultArrCombination() {//функция записи массива проверки комбинации выпавших костей в формате [кол-во очков, "название комбинации"]
    if (objResult.haseMoveIsIt === "rollingPlayer") {
        let compare = (a, b) => a - b;
        let sortArr = objResult.arrayRandomValue.sort(compare);
        objResult.resultingArrCombination = checkCombination(sortArr);
        console.log(objResult.resultingArrCombination);

    } else {
        objResult.resultingArrCombination = checkCombination(objResult.arrayRandomValue);
        console.log(objResult.arrayRandomValue);
        console.log(objResult.resultingArrCombination);
    }
    createMessageCombination(objResult.resultingArrCombination[1]);
    //создание и вывод сообщения с названием комбинации совпавших чисел в соответствии с ТЗ

}


function createSelectedArr() {//создаем массив с выбранными и не выбранными checkbox - где 10 выбранный checkbox, а -55 - не выбранный
    let checkboxArr = document.querySelectorAll(".checkBox");

    for (let i = 0; i < checkboxArr.length; i++) {
        if (checkboxArr[i].checked) {
            objResult.arrCheckedBox.push(10);
        } else {
            objResult.arrCheckedBox.push(-55);
        }
    }
    console.log(objResult.arrCheckedBox);

    hideTheButtons();
    changeArrRandom();
}


function hideTheButtons() {// ф-ия скрытия дива с checkbox и кнопками продолжения
    let content = document.querySelector(".rollingDiceContainer");
    content.style = "display:none";
    //записываем счет игрока
    // objResult.currentAccountPlayer = objResult.resultingArrCombination[0];
    // if (objResult.haseMoveIsIt == "rollingPlayer") {


    // }

    setTimeout(changeHasMove, 3000);
    setTimeout(startChangeDice, 3000);

}

function changeHasMove() {
    objResult.haseMoveIsIt = "bot";
}

//функции проверки, работают только в системе, так как в каждой последующей исключаются возможность пропуска предыдущих проверок;
function checkCombination(checkedArr) {
    let resultingCombination = []
    if (checkPoker(checkedArr) === 7) {
        resultingCombination = [7, "Poker"];
        return resultingCombination;
    } else if (checkFlash(checkedArr) === 6) {
        resultingCombination = [6, "Flash"];
        return resultingCombination;
    } else if (checkKare(checkedArr) === 5) {
        resultingCombination = [5, "Kare"];
        return resultingCombination;
    } else if (checkFullHouse(checkedArr) === 4) {
        resultingCombination = [4, "FullHouse"];
        return resultingCombination;
    } else if (checkSet(checkedArr) === 3) {
        resultingCombination = [3, "Set"];
        return resultingCombination;
    } else if (checkTwoCouple(checkedArr) === 2) {
        resultingCombination = [2, "TwoCouple"];
        return resultingCombination;
    } else if (checkCouple(checkedArr) === 1) {
        resultingCombination = [1, "Couple"];
        return resultingCombination;
    } else {
        resultingCombination = [0, "Nothing!!!!!!!!"];
        return resultingCombination;
    }
}


function checkPoker(checkedArr) {
    let set1 = new Set(checkedArr);
    if (set1.size === 1) {
        return 7;
    }
}


function checkFlash(checkedArr) {
    let counter = 0;
    for (let i = 0; i < checkedArr.length - 1; i++) {
        if (checkedArr[i] + 1 == checkedArr[i + 1]) {
            counter++;
        }
    }
    if (counter === 4) {
        return 6;
    }
}


function checkKare(checkedArr) {
    let counter = 0;
    for (let i = 0; i < checkedArr.length - 1; i++) {
        if (checkedArr[i] == checkedArr[i + 1]) {
            counter++;
        }
    }
    if (counter === 3 && checkedArr[0] != checkedArr[4] && checkedArr[1] == checkedArr[3]) {
        return 5;
    }
}


function checkFullHouse(checkedArr) {
    let set1 = new Set(checkedArr);
    if (set1.size === 2) {
        return 4;
    }
}


function checkSet(checkedArr) {
    if ((checkedArr[0] == checkedArr[1] && checkedArr[0] == checkedArr[2]) ||
        (checkedArr[4] == checkedArr[3] && checkedArr[4] == checkedArr[2]) || (checkedArr[1] == checkedArr[2] && checkedArr[1] == checkedArr[3])) {
        return 3;
    }
}


function checkTwoCouple(checkedArr) {
    let set1 = new Set(checkedArr);
    if (set1.size === 3) {
        return 2;
    }
}


function checkCouple(checkedArr) {
    let set1 = new Set(checkedArr);
    if (set1.size === 4) {
        return 1;
    }
}


function createMessageCombination(messageNew) {
    let button = document.querySelector("#gameButton");
    let messageComb = document.createElement("h2");
    messageComb.classList.add('combination');
    messageComb.innerHTML = `Fell out: "${messageNew}"`;
    button.after(messageComb);

    let removeOldMessage = document.querySelectorAll(".combination");
    if (removeOldMessage.length > 1) {
        removeOldMessage = document.querySelectorAll(".combination");
        removeOldMessage[1].remove();
    }

    if (objResult.haseMoveIsIt == "bot") {
        objResult.currentAccountBot = objResult.resultingArrCombination[0];
        displayCurrentBot(objResult.currentAccountBot);
    } else {
        objResult.currentAccountPlayer = objResult.resultingArrCombination[0];
        displayCurrentPlayer(objResult.currentAccountPlayer);
    }


}

function changeArrRandom() {
    for (let i = 0; i < objResult.arrCheckedBox.length; i++) {
        if (objResult.arrCheckedBox[i] == 10) {
            let randovNewValue = createRandomNumb();
            objResult.arrayRandomValue[i] = randovNewValue;
            console.log(objResult.arrayRandomValue[i]);
            drowRandImg(i);
        }
    }
    console.log(objResult.arrayRandomValue);
    resultArrCombination();
}


function displayCurrentPlayer(messageNew) {
    if (document.querySelector(".currentAccountsPlayer")) {
        document.querySelector(".currentAccountsPlayer").innerHTML = `Current account player: ${messageNew}`;
    } else {
        let div = document.querySelector(".currentAccounts");
        let messageAccountPlayer = document.createElement("h2");
        messageAccountPlayer.classList.add('currentAccountsPlayer');
        messageAccountPlayer.innerHTML = `Current account player: ${messageNew};`;
        div.append(messageAccountPlayer);
    }
    objResult.arrCheckedBox = [];

}

function displayCurrentBot(messageNew) {
    if (document.querySelector(".currentAccountsBot")) {
        document.querySelector(".currentAccountsBot").innerHTML = `Current account bot: ${messageNew}`;
    } else {
        let h2 = document.querySelector(".currentAccountsPlayer");
        let messageAccountBot = document.createElement("h2");
        messageAccountBot.classList.add('currentAccountsBot');
        messageAccountBot.innerHTML = `Current account bot: ${messageNew}`;
        h2.after(messageAccountBot);
    }
    checkWinner();
}

function checkWinner() {
    if (objResult.currentAccountPlayer >
        objResult.currentAccountBot) {
        objResult.gamerScore += 1;

    } else if (objResult.currentAccountPlayer <
        objResult.currentAccountBot) {
        objResult.botScore += 1;

    }
    if (objResult.gamerScore != 2 && objResult.gamerScore != 2) {
        objResult.haseMoveIsIt = "player";
        changeGamerScore();
        changeBotScore();
        let clearCheckedCheckBox = document.querySelectorAll(".checkBox");
        console.log(clearCheckedCheckBox);
        for (let j = 0; j < clearCheckedCheckBox.length; j++) {
            clearCheckedCheckBox[j].checked = false;
        }

        init();
    } else if (objResult.gamerScore == 2) {
        setTimeout(alertPlayer, 500);
    } else if (objResult.botScore == 2) {
        setTimeout(alertBot, 500);
    }
}

function alertBot() {
    alert("Bot is winn");
}

function alertPlayer() {
    alert("Player is winn");
}

function changeGamerScore() {
    if (document.querySelector(".gamerh2")) {
        document.querySelector(".gamerh2").innerHTML = `Gamer Score: ${objResult.gamerScore}`;
    } else {
        let div = document.querySelector(".scores");
        let gamerscores = document.createElement("h2");
        gamerscores.classList.add("gamerh2");
        gamerscores.innerHTML = `Gamer Score: ${objResult.gamerScore}`;
        div.append(gamerscores);
    }
}


function changeBotScore() {
    if (document.querySelector(".both2")) {
        document.querySelector(".both2").innerHTML = `Bot Score: ${objResult.botScore}`;
    } else {
        let heading = document.querySelector(".gamerh2");
        let botScores = document.createElement("h2");
        botScores.classList.add("both2");
        botScores.innerHTML = `Bot Score: ${objResult.botScore}`;
        heading.after(botScores);
    }
}








