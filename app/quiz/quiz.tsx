
import { useNavigate, useSearchParams } from "react-router"
import type { AnswerdQuestion, Questions } from "~/types/questions";

type QuizProps = {
    questionEntity: Questions,
    answers: {[id: number]: string}
    updateAnswer: (id: number, answer: string) => void;
}

const getCharVal = (char: string, i: number) => {
    return String.fromCharCode(char.charCodeAt(0)+i); 
}

const Quiz = (props: QuizProps) => {
    const [searchParams] = useSearchParams();

    const questionNum: number = Number(searchParams.get("question"));

    const question = props.questionEntity.questions[questionNum-1];

    const navigate = useNavigate();
  return (
    <div>
        {question.text}

        {question.answers.map((answer, i) => {
            return (
                <div key={i} onClick={() => props.updateAnswer(question.id, answer)}>
                    {getCharVal('a', i)} {answer}
                    {props.answers[question.id] == answer ? "picked" : null}
                </div>
            );
        })}

        <button onClick={() => questionNum <= 1 ? navigate("/") : navigate(`/quiz?question=${questionNum-1}`)}>Back</button>
        <button onClick={() => props.answers[question.id] === undefined ? null : navigate(`/quiz?question=${questionNum+1}`)}>Next</button>
    </div>
  )
}

export default Quiz