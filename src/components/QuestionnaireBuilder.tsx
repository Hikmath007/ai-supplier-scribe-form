
import { useQuestionnaire } from '@/context/QuestionnaireContext';
import { QuestionnaireHeader } from './QuestionnaireHeader';
import { SectionBlock } from './SectionBlock';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export const QuestionnaireBuilder = () => {
  const { questionnaire, addSection, reorderSections } = useQuestionnaire();

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      reorderSections(index, index - 1);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < questionnaire.sections.length - 1) {
      reorderSections(index, index + 1);
    }
  };

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4">
      <QuestionnaireHeader />
      
      {questionnaire.sections.map((section, index) => (
        <SectionBlock
          key={section.id}
          section={section}
          index={index}
          totalSections={questionnaire.sections.length}
          onMoveUp={() => handleMoveUp(index)}
          onMoveDown={() => handleMoveDown(index)}
        />
      ))}
      
      <div className="mt-8 flex justify-center">
        <Button onClick={addSection} className="add-button">
          <Plus className="h-5 w-5 mr-1" /> Add Section
        </Button>
      </div>
    </div>
  );
};
