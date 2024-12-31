//Here i'm gettin a Token throug the api so that it doesn't give the same question twice

let Itoken : string = "https://opentdb.com/api.php?amount=1&type=multiple&token="; //base url to getting the question

const fetchToken = async () : Promise<void> => {
    const data: Response = await fetch(`https://opentdb.com/api_token.php?command=request`); //requesting the token
    const myData: any = await data.json();
    const mytoken : string = myData.token;
    Itoken += mytoken; // adding my token to the url that gets the questions
}

fetchToken();

//building the structure of the questions
interface Iquestion{
    head: string;
    options: string[];
    correct: string;
}

let current : Iquestion //declaring the current question

const questionElement = document.querySelector('.question');    //locating the header of question element
const optionsElement = document.querySelectorAll('.option');    //locating the option elements
const submit = document.querySelector('.submit');               //locating the button element

let currentQuestionIndex : number = 0;
let score : number = 0;

const getQuestion = async () : Promise<void> => {
    const data: Response = await fetch(`${Itoken}`)     // Using my token to request a question
    const qdata: any = await data.json()
    const myquestion = qdata.results;

    //setting my current question as the result of que request
    current = {
        head: myquestion[0].question,
        options: myquestion[0].incorrect_answers,
        correct: myquestion[0].correct_answer
    }

    current.options.push(current.correct);      // adding the correct answer has one of the options
    current.options = shuffle(current.options); //shuffling the options

    questionElement!.innerHTML = current.head;  //Setting the text of the header question element
    optionsElement.forEach((option, index) =>{  //Setting the text for every option
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
    // Locate the selected option
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
        option.classList.remove("selected");    // Set every option has not selected
    });
}

optionsElement.forEach((option) => {
    option.addEventListener("click", () => {    // When an option is clicked
        resetOptions();                         // Reset every option
        option.classList.add("selected");       // Set the clicked as selected
    });
});

//Watching for click on the button and handling next question when clicked
submit!.addEventListener("click", handleNext);

getQuestion(); // Get the first question