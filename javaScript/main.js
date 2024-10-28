window.onload = init;


function init() {
    let buttonStart = document.querySelector("#gameButton");
    buttonStart.addEventListener("click", startChangeDice);
}


let objResult = {
    idImgArray: [],
    arrayRandomValue: [],
    arrSetInterval: [],
    arrCheckedBox: [],
    currentAccountPlayer: 0,
    currentAccountBot: 0,
    haseMoveIsIt: "player",
    resultingArrCombination: [],
    currentAccountCombinationPlayer: 0,
    currentAccountCombinationBot: 0,
    gamerScore: 0,
    botScore: 0,
    winner: ""
}


function startChangeDice() {
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
    if (objResult.haseMoveIsIt == "player") {
        setTimeout(deleteSetIntervalImg, 2000); // картинки меняются со скоростью 100мс и отложенная функция удаляет данный интервал, чтобы можно было присвоить конкретной картинке img#id - картинку соответствующую числу из массива рандомных чисел "objResult.arrayRandomValue"
    }

}


function deleteSetIntervalImg() {
    for (let i = 0; i < 5; i++) {
        clearInterval(objResult.arrSetInterval[i]);//удаляет интервал замен картинок
        drowRandImg(i); //присваивает определенную картинку в соответствии с индексом в массиве рандомных чисел
        if (i == 4) {
            rollingTheDice(); // показывает checkboses и кнопки переброса выбранных костей и продолжения без переброса костей удаляет обработчик с кнопки Game чтобы при повторном нажатии до завершения конкретного игрового цикла не вносились не учтенные изменнения
        }
    }
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
    objResult.haseMoveIsIt = "rollingPlayer";
    hideTheButtons();
    changeArrRandom();
}


function hideTheButtons() {// ф-ия скрытия дива с checkbox и кнопками продолжения
    let content = document.querySelector(".rollingDiceContainer");
    content.style = "display:none";
    objResult.currentAccountPlayer = objResult.resultingArrCombination[0];//записываем счет игрока

    objResult.haseMoveIsIt = "bot";
    startChangeDice();
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
    messageComb = document.createElement("h2");
    messageComb.classList.add('combination');
    messageComb.innerHTML = `Fell out: "${messageNew}"`;
    button.after(messageComb);

    if (objResult.haseMoveIsIt == "rollingPlayer" || objResult.haseMoveIsIt == "bot") {
        let removeOldMessage = document.querySelectorAll(".combination");
        removeOldMessage[1].remove();
        console.log(removeOldMessage);
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








