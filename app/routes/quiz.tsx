import Quiz from "~/quiz/quiz";
import type { Route } from "./+types/home";
import { useEffect, useState } from "react";
import { type AnswerdQuestion, type Questions } from "~/types/questions";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Quiz" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}



const questionArr: Questions = {
    questions: [
        {
            id: 1,
            text: "What's your hair type or texture?",
            answers: ["Straight", "Curly", "Wavy", "Fine"]
        },
        {
            id: 2,
            text: "How often do you wash your hair?",
            answers: ["Daily", "Every other day", "Twice a week", "Once a week", "Once every two weeks"]
        },
        {
            id: 3,
            text: "What benefit do you look for in your hair products?",
            answers: ["Anti-breakage", "Hydration", "Soothing dry scalp", "Repairs the appearance of damaged hair", "Volume", "Curl and coil enhancing."]
        },
        {
            id: 4,
            text: "Is there anything troubling you about your hair?",
            answers: ["Breakage", "Frizz", "Scalp dryness", "Damage", "Tangling"]
        },
        {
            id: 5,
            text: "What is your natural hair color(s) today?",
            answers: ["Black", "Brown", "Blonde", "Red/Orange", "Silver/Grey"]
        }
    ]
};

export default function QuizRouter() {
    const [answers, setAnswers] = useState<{ [id: number]: string }>([]);
    
    const updateAnswer = (questionId: number, answer: string) => {
        setAnswers(prev => ({ ...prev,  [questionId]: answer}));
    }
    
    useEffect(() => {
        console.log(answers);
        
    }, [answers]);

    return <Quiz questionEntity={questionArr} answers={answers} updateAnswer={updateAnswer} />;
}
