
import { useState } from 'react';
import { useQuestionnaire } from '@/context/QuestionnaireContext';
import { Section } from '@/types/questionnaire';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from '@/components/ui/select';
import { QuestionBlock } from './QuestionBlock';
import { Plus, Trash, ChevronUp, ChevronDown } from 'lucide-react';

interface SectionBlockProps {
  section: Section;
  index: number;
  totalSections: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export const SectionBlock = ({ section, index, totalSections, onMoveUp, onMoveDown }: SectionBlockProps) => {
  const { updateSection, deleteSection, addQuestion } = useQuestionnaire();
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSection(section.id, { title: e.target.value });
  };
  
  const handleWeightageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    updateSection(section.id, { weightage: value });
  };

  const handleAddQuestion = (type: string) => {
    addQuestion(section.id, type as any);
    setIsAddingQuestion(false);
  };

  return (
    <div className="mb-10 bg-secondary/50 rounded-xl p-6">
      <div className="section-header">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Input
              value={section.number}
              onChange={(e) => updateSection(section.id, { number: e.target.value })}
              className="w-16 font-bold bg-white"
            />
            <Input
              value={section.title}
              onChange={handleTitleChange}
              className="text-xl font-bold bg-white"
              placeholder="Section Title"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Weightage:</span>
              <Input
                type="number"
                min="0"
                max="100"
                value={section.weightage}
                onChange={handleWeightageChange}
                className="w-16 bg-white"
              />
              <span className="text-sm text-muted-foreground">%</span>
            </div>
            
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onMoveUp} 
                disabled={index === 0}
                className="h-8 w-8"
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onMoveDown} 
                disabled={index === totalSections - 1}
                className="h-8 w-8"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => deleteSection(section.id)}
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        {section.questions.map(question => (
          <QuestionBlock 
            key={question.id} 
            question={question} 
            sectionId={section.id}
          />
        ))}
        
        {isAddingQuestion ? (
          <div className="p-5 bg-white rounded-lg border border-dashed border-gray-300">
            <p className="mb-3 font-medium">Select question type:</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Button 
                variant="outline" 
                className="justify-start" 
                onClick={() => handleAddQuestion('descriptive')}
              >
                <span>Text Response</span>
              </Button>
              <Button 
                variant="outline" 
                className="justify-start" 
                onClick={() => handleAddQuestion('multiple-choice')}
              >
                <span>Multiple Choice</span>
              </Button>
              <Button 
                variant="outline" 
                className="justify-start" 
                onClick={() => handleAddQuestion('checkbox')}
              >
                <span>Checkbox</span>
              </Button>
              <Button 
                variant="outline" 
                className="justify-start" 
                onClick={() => handleAddQuestion('file-upload')}
              >
                <span>File Upload</span>
              </Button>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsAddingQuestion(false)} 
              className="mt-3"
            >
              Cancel
            </Button>
          </div>
        ) : (
          <div className="flex justify-center">
            <Button 
              variant="outline" 
              onClick={() => setIsAddingQuestion(true)} 
              className="add-button"
            >
              <Plus className="h-5 w-5 mr-1" /> Add Question
            </Button>
          </div>
        )}
      </div>
      
      {/* AI Suggestions Placeholder */}
      <div className="mt-6 p-4 border border-dashed border-primary/30 rounded-lg bg-primary/5">
        <div className="flex items-center gap-2 mb-2">
          <div className="px-2 py-1 bg-primary/20 text-primary text-xs font-medium rounded-full">
            AI Suggestions
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Based on your industry, you might want to ask about: supplier certifications, 
          production capacity, and quality control processes.
        </p>
      </div>
    </div>
  );
};
