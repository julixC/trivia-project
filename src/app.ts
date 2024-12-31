let Itoken : string = "https://opentdb.com/api.php?amount=1&type=multiple&token=";

interface Iquestion{
    head: string;
    options: string[];
    correct: string;
}

let current : Iquestion
const fetchToken = async () : Promise<void> => {
    const data: Response = await fetch(`https://opentdb.com/api_token.php?command=request`);
    const myData: any = await data.json();
    const mytoken : string = myData.token;
    Itoken += mytoken;
}

fetchToken();

const questionElement = document.querySelector('.question');
const optionsElement = document.querySelectorAll('.option');
const submit = document.querySelector('.submit');

let currentQuestionIndex : number = 0;
let score : number = 0;

const getQuestion = async () : Promise<void> => {
    const data: Response = await fetch(`${Itoken}`)
    const qdata: any = await data.json()
    const myquestion = qdata.results;

    current = {
        head: myquestion[0].question,
        options: myquestion[0].incorrect_answers,
        correct: myquestion[0].correct_answer
    }

    current.options.push(current.correct);
    current.options = shuffle(current.options);

    questionElement!.innerHTML = current.head;
    optionsElement.forEach((option, index) =>{
        option.innerHTML = current.options[index];
    });
}

function shuffle(array: string[]) {
    for (var i = array.length - 1; i >= 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    return array;
}

function checkAnswer(answer : any){
    if(answer === current.correct){
        score++;
    }
}

function handleNext() {
    const selectedOption = document.querySelector("li.option.selected");
    if(selectedOption){
        checkAnswer(selectedOption.textContent);
        currentQuestionIndex++;

        if(currentQuestionIndex < 10) {
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
    triviaContainer!.innerHTML = `<h2> Your score is ${score} out of 10`;
}

function resetOptions() {
    optionsElement.forEach((option) => {
        option.classList.remove("selected");
    });
}

optionsElement.forEach((option) => {
    option.addEventListener("click", () =>{
        resetOptions();
        option.classList.add("selected");
    });
});

submit!.addEventListener("click", handleNext);

getQuestion();