
export type Question = {
    id: number,
    text: string,
    answers: string[]
}

export type Questions = {
    questions: Question[]
}

export type AnswerdQuestion = {
    id: number,
    text: string,
    answer: string
}