
import React from "react";
import TypedText from "@/components/TypedText";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Option {
  label: string;
  value: string;
}

interface QuestionScreenProps {
  questionIndex: number;
  currentIndex: number;
  question: {
    id: string;
    content: string;
    description?: string;
    type: "text" | "options";
    options?: Option[];
  };
  textInputValue: string;
  isLoading: boolean;
  isTyping: boolean;
  onTextSubmit: () => void;
  onOptionSelect: (value: string) => void;
  register: any;
}

const QuestionScreen: React.FC<QuestionScreenProps> = ({
  questionIndex,
  currentIndex,
  question,
  textInputValue,
  isLoading,
  isTyping,
  onTextSubmit,
  onOptionSelect,
  register,
}) => {
  return (
    <div 
      key={question.id}
      className={`min-h-screen flex flex-col justify-center items-center p-8 snap-start transition-all duration-500 ${
        questionIndex > currentIndex 
          ? 'translate-x-full opacity-0' 
          : questionIndex < currentIndex 
            ? '-translate-x-full opacity-0' 
            : 'translate-x-0 opacity-100'
      }`}
    >
      <div className="max-w-md w-full">
        <div className="mb-6 flex items-center text-jalan-secondary">
          <span className="question-index">{questionIndex + 1}</span>
          <span className="mr-2">→</span>
        </div>
        
        <h2 className="text-2xl font-bold mb-3 text-jalan-text">
          {questionIndex <= currentIndex ? (
            <TypedText 
              text={question.content} 
              speed={25} 
              delay={questionIndex === 0 ? 500 : 200}
            />
          ) : (
            question.content
          )}
        </h2>
        
        {question.description && (
          <p className="text-jalan-secondary mb-8 text-sm">
            {question.description}
          </p>
        )}
        
        {question.type === "text" && questionIndex === currentIndex && (
          <div className="mt-8">
            <div className="form-control-typeform">
              <Input
                className="border-none bg-transparent focus:outline-none focus:ring-0 pl-0 typeform-input"
                placeholder="Ketik di sini..."
                {...register(question.id)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && textInputValue?.trim()) {
                    e.preventDefault();
                    onTextSubmit();
                  }
                }}
                disabled={isLoading || isTyping}
                autoFocus
              />
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                onTextSubmit();
              }}
              disabled={!textInputValue?.trim() || isLoading || isTyping}
              className="mt-6 typeform-button"
              type="button"
            >
              Lanjutkan
            </button>
          </div>
        )}
        
        {question.type === "options" && questionIndex === currentIndex && question.options && (
          <div className="mt-8 space-y-3 w-full">
            <RadioGroup 
              defaultValue=""
              onValueChange={onOptionSelect}
            >
              {question.options.map((option, optionIndex) => (
                <div 
                  key={option.value}
                  className="typeform-appear"
                  style={{ animationDelay: `${optionIndex * 0.1 + 0.5}s` }}
                >
                  <label
                    className="option-button-typeform"
                    htmlFor={`option-${option.value}`}
                  >
                    <span className="question-index mr-3">
                      {String.fromCharCode(65 + optionIndex)}
                    </span>
                    {option.label}
                    <RadioGroupItem
                      value={option.value}
                      id={`option-${option.value}`}
                      className="sr-only"
                    />
                  </label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionScreen;
