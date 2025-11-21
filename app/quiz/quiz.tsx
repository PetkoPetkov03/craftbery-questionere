import {
  useNavigate,
  useSearchParams,
  type NavigateFunction,
} from "react-router";
import Container from "~/assets/components/Container";
import { type Question, type Questions } from "~/types/questions";
import "./quiz.css";
import { useEffect } from "react";
import ProgressBar from "~/assets/components/Progress";

type QuizProps = {
  questionEntity: Questions;
  answers: { [id: number]: string };
  updateAnswer: (id: number, answer: string) => void;
};

const getCharVal = (char: string, i: number) => {
  return String.fromCharCode(char.charCodeAt(0) + i);
};

const quitQuiz = () => {
  window.location.replace("/");
};

const ControllerButton = ({
  questionNum,
  questionCap,
  answers,
  question,
  navigate,
  questions,
}: {
  questionNum: number;
  questionCap: number;
  answers: { [id: number]: string };
  question: Question;
  navigate: NavigateFunction;
  questions: Questions;
}) => {
  if (questionNum === questionCap) {
    return (
      <button
        className="next-button"
        onClick={() =>
          answers[question.id] === undefined
            ? null
            : navigate("/routine", {
                replace: true,
                state: { answers: answers, questions: questions },
              })
        }
      >
        Discover your results
      </button>
    );
  } else {
    return (
      <button
        className="next-button"
        onClick={() =>
          answers[question.id] === undefined
            ? null
            : navigate(`/quiz?question=${questionNum + 1}`)
        }
      >
        Next question
        <svg
          width="20"
          height="12"
          viewBox="0 0 20 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.6343 1.01491L16.5353 4.91585L-4.27656e-05 4.91575L-4.24284e-05 6.35097L16.5353 6.35087L12.6343 10.2518L13.6492 11.2667L19.2826 5.63336L13.6492 -6.95073e-06L12.6343 1.01491Z"
            fill="#1C2635"
          />
        </svg>
      </button>
    );
  }
};

const chunkArray = (arr: any[], size: number = 4) => {
  const chunkedArr = [];
  for (let i = 0; i < arr.length; i += size) {
    chunkedArr.push(arr.slice(i, i + size));
  }
  return chunkedArr;
};

const Quiz = (props: QuizProps) => {
  const [searchParams] = useSearchParams();

  const questionNum: number = Number(searchParams.get("question"));

  const question = props.questionEntity.questions[questionNum - 1];

  const navigate = useNavigate();

  useEffect(() => {
    const answered = Object.keys(props.answers).length;

    if (
      (questionNum > answered+1)
    ) {
      navigate("/quiz?question=1", {replace: true});
    }
  }, [props.answers, questionNum]);

  return (
    <Container>
      <div className="quiz-wrapper">
        <ProgressBar
            curr={questionNum}
            max={props.questionEntity.questions.length}
          />
        <div className="quiz-container">
          
          <div className="question-title">{question.text}</div>
          <div className="answer-module">
            {chunkArray(question.answers).map((answerArr, i) => {
              return (
                <div key={i} className="answer-row">
                  {answerArr.map((answer, j) => {
                    const globalIndex = i * 4 + j
                    return (
                      <div
                        className={`answer ${
                          props.answers[question.id] == answer ? "picked" : ""
                        }`}
                        key={j}
                        onClick={() => props.updateAnswer(question.id, answer)}
                      >
                        {getCharVal("a", globalIndex)}.{" "}
                        <p className="answer-text">{answer}</p>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          <div className="control-module">
            <button
              className="back-button"
              onClick={() =>
                questionNum <= 1
                  ? quitQuiz()
                  : navigate(`/quiz?question=${questionNum - 1}`)
              }
            >
              Back
            </button>

            <ControllerButton
              answers={props.answers}
              navigate={navigate}
              question={question}
              questionNum={questionNum}
              questionCap={props.questionEntity.questions.length}
              questions={props.questionEntity}
            />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Quiz;
