
import { QuestionnaireProvider } from '@/context/QuestionnaireContext';
import { QuestionnaireBuilder } from '@/components/QuestionnaireBuilder';

const Index = () => {
  return (
    <QuestionnaireProvider>
      <div className="min-h-screen bg-background">
        <QuestionnaireBuilder />
      </div>
    </QuestionnaireProvider>
  );
};

export default Index;
