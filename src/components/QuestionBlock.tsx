
import { useState } from 'react';
import { useQuestionnaire } from '@/context/QuestionnaireContext';
import { Question } from '@/types/questionnaire';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from '@/components/ui/select';
import { Trash, Edit, Plus, Minus, Check } from 'lucide-react';

interface QuestionBlockProps {
  question: Question;
  sectionId: string;
}

export const QuestionBlock = ({ question, sectionId }: QuestionBlockProps) => {
  const { updateQuestion, deleteQuestion, addOption, updateOption, deleteOption } = useQuestionnaire();
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(question.text);

  const handleTypeChange = (value: string) => {
    updateQuestion(sectionId, question.id, { 
      type: value as Question['type'],
      // Clear options if switching to descriptive or file upload
      options: (value === 'multiple-choice' || value === 'checkbox') 
        ? question.options.length ? question.options : [{ id: Math.random().toString(), text: 'Option 1' }]
        : []
    });
  };

  const handleSaveEdit = () => {
    updateQuestion(sectionId, question.id, { text: editedText });
    setIsEditing(false);
  };

  const renderQuestionContent = () => {
    switch(question.type) {
      case 'descriptive':
        return <Textarea disabled placeholder="User will enter text here" className="mt-2 bg-gray-50" />;
      
      case 'multiple-choice':
        return (
          <div className="mt-4 space-y-3">
            {question.options.map(option => (
              <div key={option.id} className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full border border-gray-300 flex-shrink-0" />
                <Input 
                  value={option.text}
                  onChange={(e) => updateOption(sectionId, question.id, option.id, e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteOption(sectionId, question.id, option.id)}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => addOption(sectionId, question.id)}
              className="mt-2 add-button"
            >
              <Plus className="h-4 w-4" /> Add Option
            </Button>
          </div>
        );
      
      case 'checkbox':
        return (
          <div className="mt-4 space-y-3">
            {question.options.map(option => (
              <div key={option.id} className="flex items-center gap-2">
                <div className="h-4 w-4 rounded border border-gray-300 flex-shrink-0" />
                <Input 
                  value={option.text}
                  onChange={(e) => updateOption(sectionId, question.id, option.id, e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteOption(sectionId, question.id, option.id)}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => addOption(sectionId, question.id)}
              className="mt-2 add-button"
            >
              <Plus className="h-4 w-4" /> Add Option
            </Button>
          </div>
        );
      
      case 'file-upload':
        return (
          <div className="mt-2 p-6 border border-dashed border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center">
            <p className="text-muted-foreground">File Upload Area</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="question-block">
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-2">
          <span className="font-medium text-gray-500">{question.number}</span>
          {isEditing ? (
            <div className="flex-1">
              <Input
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className="font-medium text-lg"
                autoFocus
              />
              <div className="flex gap-2 mt-2">
                <Button size="sm" onClick={handleSaveEdit}>
                  <Check className="h-4 w-4 mr-1" /> Save
                </Button>
                <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <h3 className="font-medium text-lg">{question.text}</h3>
          )}
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          <Select value={question.type} onValueChange={handleTypeChange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="descriptive">Descriptive</SelectItem>
              <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
              <SelectItem value="checkbox">Checkbox</SelectItem>
              <SelectItem value="file-upload">File Upload</SelectItem>
            </SelectContent>
          </Select>
          
          {!isEditing && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(true)}
              className="h-8 w-8"
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => deleteQuestion(sectionId, question.id)}
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {renderQuestionContent()}
      
      {/* AI Score Logic Placeholder */}
      {question.type !== 'file-upload' && (
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2">
          <div className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
            AI Scoring Logic
          </div>
          <p className="text-xs text-muted-foreground">Add scoring criteria for automated evaluation</p>
        </div>
      )}
    </div>
  );
};
