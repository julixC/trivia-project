"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let Itoken = "https://opentdb.com/api.php?amount=1&type=multiple&token=";
let current;
const fetchToken = () => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield fetch(`https://opentdb.com/api_token.php?command=request`);
    const myData = yield data.json();
    const mytoken = myData.token;
    Itoken += mytoken;
});
fetchToken();
const questionElement = document.querySelector('.question');
const optionsElement = document.querySelectorAll('.option');
const submit = document.querySelector('.submit');
let currentQuestionIndex = 0;
let score = 0;
const getQuestion = () => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield fetch(`${Itoken}`);
    const qdata = yield data.json();
    const myquestion = qdata.results;
    current = {
        head: myquestion[0].question,
        options: myquestion[0].incorrect_answers,
        correct: myquestion[0].correct_answer
    };
    current.options.push(current.correct);
    current.options = shuffle(current.options);
    questionElement.innerHTML = current.head;
    optionsElement.forEach((option, index) => {
        option.innerHTML = current.options[index];
    });
});
function shuffle(array) {
    for (var i = array.length - 1; i >= 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}
function checkAnswer(answer) {
    if (answer === current.correct) {
        score++;
    }
}
function handleNext() {
    const selectedOption = document.querySelector("li.option.selected");
    if (selectedOption) {
        checkAnswer(selectedOption.textContent);
        currentQuestionIndex++;
        if (currentQuestionIndex < 10) {
            getQuestion();
            resetOptions();
        }
        else {
            showResults();
        }
    }
}
function showResults() {
    const triviaContainer = document.querySelector(".quiz-container");
    triviaContainer.innerHTML = `<h2> Your score is ${score} out of 10`;
}
function resetOptions() {
    optionsElement.forEach((option) => {
        option.classList.remove("selected");
    });
}
optionsElement.forEach((option) => {
    option.addEventListener("click", () => {
        resetOptions();
        option.classList.add("selected");
    });
});
submit.addEventListener("click", handleNext);
getQuestion();
