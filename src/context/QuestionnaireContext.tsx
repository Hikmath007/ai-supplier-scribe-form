
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Questionnaire, Section, Question, Option } from '@/types/questionnaire';

// Generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 9);

// Initial state with a sample questionnaire
const initialQuestionnaire: Questionnaire = {
  id: generateId(),
  title: 'Supplier Evaluation Questionnaire',
  sections: [
    {
      id: generateId(),
      number: '1.0',
      title: 'Company Details',
      weightage: 20,
      questions: [
        {
          id: generateId(),
          number: '1.1',
          text: 'What is your company name?',
          type: 'descriptive',
          options: [],
        },
        {
          id: generateId(),
          number: '1.2',
          text: 'Which industries do you serve?',
          type: 'checkbox',
          options: [
            { id: generateId(), text: 'Manufacturing' },
            { id: generateId(), text: 'Technology' },
            { id: generateId(), text: 'Healthcare' },
            { id: generateId(), text: 'Retail' },
          ],
        },
      ],
    },
    {
      id: generateId(),
      number: '2.0',
      title: 'Delivery Details',
      weightage: 30,
      questions: [
        {
          id: generateId(),
          number: '2.1',
          text: 'What is your average delivery time?',
          type: 'multiple-choice',
          options: [
            { id: generateId(), text: '1-3 days' },
            { id: generateId(), text: '4-7 days' },
            { id: generateId(), text: '1-2 weeks' },
            { id: generateId(), text: '2+ weeks' },
          ],
        },
      ],
    },
  ],
};

interface QuestionnaireContextProps {
  questionnaire: Questionnaire;
  addSection: () => void;
  updateSection: (sectionId: string, updates: Partial<Section>) => void;
  deleteSection: (sectionId: string) => void;
  reorderSections: (sourceIndex: number, destinationIndex: number) => void;
  addQuestion: (sectionId: string, type: Question['type']) => void;
  updateQuestion: (sectionId: string, questionId: string, updates: Partial<Question>) => void;
  deleteQuestion: (sectionId: string, questionId: string) => void;
  addOption: (sectionId: string, questionId: string) => void;
  updateOption: (sectionId: string, questionId: string, optionId: string, text: string) => void;
  deleteOption: (sectionId: string, questionId: string, optionId: string) => void;
  assignWeightage: () => void;
}

const QuestionnaireContext = createContext<QuestionnaireContextProps | undefined>(undefined);

interface QuestionnaireProviderProps {
  children: ReactNode;
}

export const QuestionnaireProvider = ({ children }: QuestionnaireProviderProps) => {
  const [questionnaire, setQuestionnaire] = useState<Questionnaire>(initialQuestionnaire);

  const addSection = () => {
    const newSectionNumber = `${questionnaire.sections.length + 1}.0`;
    const newSection: Section = {
      id: generateId(),
      number: newSectionNumber,
      title: `New Section`,
      weightage: 0,
      questions: [],
    };

    setQuestionnaire({
      ...questionnaire,
      sections: [...questionnaire.sections, newSection],
    });
  };

  const updateSection = (sectionId: string, updates: Partial<Section>) => {
    setQuestionnaire({
      ...questionnaire,
      sections: questionnaire.sections.map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      ),
    });
  };

  const deleteSection = (sectionId: string) => {
    setQuestionnaire({
      ...questionnaire,
      sections: questionnaire.sections.filter(section => section.id !== sectionId),
    });
  };

  const reorderSections = (sourceIndex: number, destinationIndex: number) => {
    const sections = Array.from(questionnaire.sections);
    const [removed] = sections.splice(sourceIndex, 1);
    sections.splice(destinationIndex, 0, removed);

    // Renumber sections
    const renumberedSections = sections.map((section, index) => ({
      ...section,
      number: `${index + 1}.0`,
      questions: section.questions.map((question, qIndex) => ({
        ...question,
        number: `${index + 1}.${qIndex + 1}`,
      })),
    }));

    setQuestionnaire({
      ...questionnaire,
      sections: renumberedSections,
    });
  };

  const addQuestion = (sectionId: string, type: Question['type']) => {
    const sectionIndex = questionnaire.sections.findIndex(s => s.id === sectionId);
    if (sectionIndex === -1) return;

    const section = questionnaire.sections[sectionIndex];
    const newQuestionNumber = `${section.number.split('.')[0]}.${section.questions.length + 1}`;
    
    const newQuestion: Question = {
      id: generateId(),
      number: newQuestionNumber,
      text: 'New Question',
      type,
      options: type === 'multiple-choice' || type === 'checkbox' 
        ? [{ id: generateId(), text: 'Option 1' }] 
        : [],
    };

    const updatedSections = [...questionnaire.sections];
    updatedSections[sectionIndex] = {
      ...section,
      questions: [...section.questions, newQuestion],
    };

    setQuestionnaire({
      ...questionnaire,
      sections: updatedSections,
    });
  };

  const updateQuestion = (sectionId: string, questionId: string, updates: Partial<Question>) => {
    setQuestionnaire({
      ...questionnaire,
      sections: questionnaire.sections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              questions: section.questions.map(question =>
                question.id === questionId ? { ...question, ...updates } : question
              ),
            }
          : section
      ),
    });
  };

  const deleteQuestion = (sectionId: string, questionId: string) => {
    const sectionIndex = questionnaire.sections.findIndex(s => s.id === sectionId);
    if (sectionIndex === -1) return;

    const section = questionnaire.sections[sectionIndex];
    const updatedQuestions = section.questions.filter(q => q.id !== questionId);
    
    // Renumber questions
    const renumberedQuestions = updatedQuestions.map((question, index) => ({
      ...question,
      number: `${section.number.split('.')[0]}.${index + 1}`,
    }));

    const updatedSections = [...questionnaire.sections];
    updatedSections[sectionIndex] = {
      ...section,
      questions: renumberedQuestions,
    };

    setQuestionnaire({
      ...questionnaire,
      sections: updatedSections,
    });
  };

  const addOption = (sectionId: string, questionId: string) => {
    setQuestionnaire({
      ...questionnaire,
      sections: questionnaire.sections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              questions: section.questions.map(question =>
                question.id === questionId
                  ? {
                      ...question,
                      options: [
                        ...question.options,
                        { id: generateId(), text: `Option ${question.options.length + 1}` },
                      ],
                    }
                  : question
              ),
            }
          : section
      ),
    });
  };

  const updateOption = (sectionId: string, questionId: string, optionId: string, text: string) => {
    setQuestionnaire({
      ...questionnaire,
      sections: questionnaire.sections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              questions: section.questions.map(question =>
                question.id === questionId
                  ? {
                      ...question,
                      options: question.options.map(option =>
                        option.id === optionId ? { ...option, text } : option
                      ),
                    }
                  : question
              ),
            }
          : section
      ),
    });
  };

  const deleteOption = (sectionId: string, questionId: string, optionId: string) => {
    setQuestionnaire({
      ...questionnaire,
      sections: questionnaire.sections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              questions: section.questions.map(question =>
                question.id === questionId
                  ? {
                      ...question,
                      options: question.options.filter(option => option.id !== optionId),
                    }
                  : question
              ),
            }
          : section
      ),
    });
  };

  const assignWeightage = () => {
    // This is a placeholder for the function to open a modal to assign weightage
    console.log('Open weightage assignment modal');
  };

  const value = {
    questionnaire,
    addSection,
    updateSection,
    deleteSection,
    reorderSections,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    addOption,
    updateOption,
    deleteOption,
    assignWeightage,
  };

  return <QuestionnaireContext.Provider value={value}>{children}</QuestionnaireContext.Provider>;
};

export const useQuestionnaire = () => {
  const context = useContext(QuestionnaireContext);
  if (context === undefined) {
    throw new Error('useQuestionnaire must be used within a QuestionnaireProvider');
  }
  return context;
};
