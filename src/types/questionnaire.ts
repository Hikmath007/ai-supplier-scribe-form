
export type QuestionType = 'descriptive' | 'multiple-choice' | 'checkbox' | 'file-upload';

export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  number: string;
  text: string;
  type: QuestionType;
  options: Option[];
}

export interface Section {
  id: string;
  number: string;
  title: string;
  weightage: number;
  questions: Question[];
}

export interface Questionnaire {
  id: string;
  title: string;
  sections: Section[];
}
