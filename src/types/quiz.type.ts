export type QuizAnswersType = {
    test: Array<QuizType>
}

export type QuizType = {
    id: number,
    name: string,
    questions: Array<QuizQuestionType>,
}

export type QuizQuestionType = {
    id: number,
    question: string,
    answers: Array<QuizAnswerType>
}

export type QuizAnswerType = {
    id: number,
    answer: string,
    correct?: boolean
}