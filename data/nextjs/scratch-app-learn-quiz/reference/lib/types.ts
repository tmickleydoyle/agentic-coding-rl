export type Choice = {
  id: string
  text: string
}

export type Question = {
  id: string
  prompt: string
  choices: Choice[]
  answerId: string
}

export type Quiz = {
  id: string
  title: string
  passScore: number
  questions: Question[]
}

export type Answers = Record<string, string>

export type Route = 'quizzes' | 'take' | 'results' | 'review'
export type Theme = 'light' | 'dark'
