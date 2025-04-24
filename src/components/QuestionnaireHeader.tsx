
import { Button } from '@/components/ui/button';
import { useQuestionnaire } from '@/context/QuestionnaireContext';
import { ChevronDown } from "lucide-react";

export const QuestionnaireHeader = () => {
  const { questionnaire, assignWeightage } = useQuestionnaire();

  return (
    <div className="mb-8 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{questionnaire.title}</h1>
        <Button 
          onClick={assignWeightage} 
          variant="outline" 
          className="bg-white border-primary text-primary hover:bg-primary/5"
        >
          + Assign Questionnaire Weightage
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
      <p className="text-muted-foreground">
        Configure the sections and questions for your supplier evaluation.
      </p>
    </div>
  );
};
