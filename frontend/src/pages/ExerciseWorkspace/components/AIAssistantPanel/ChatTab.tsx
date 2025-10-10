// src/pages/ExerciseWorkspace/components/AIAssistantPanel/ChatTab.tsx

import { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { aiService } from '@/services/aiService';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatTabProps {
  exerciseId: string;
  currentCode: string;
}

export default function ChatTab({ exerciseId, currentCode }: ChatTabProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [suggestedActions, setSuggestedActions] = useState<string[]>([
    "How do I start?",
    "Explain the problem",
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Send message mutation
  const sendMutation = useMutation({
    mutationFn: (message: string) =>
      aiService.sendChatMessage(exerciseId, message, currentCode, messages),
    onSuccess: (data: any) => {
      // Add assistant response
      const assistantMessage: Message = {
        id: Date.now().toString() + '-assistant',
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setSuggestedActions(data.suggestedActions || []);
      setInput('');
    },
  });

  const handleSend = () => {
    if (!input.trim() || sendMutation.isPending) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Send to AI
    sendMutation.mutate(input);
  };

  const handleSuggestedAction = (action: string) => {
    setInput(action);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Welcome message */}
      {messages.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Bot className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h3 className="font-semibold mb-2">AI Tutor Ready to Help!</h3>
          <p className="text-sm">
            Ask me anything about this exercise. I know what you're working on.
          </p>
        </div>
      )}

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-4 mb-4"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'assistant' && (
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
              </div>
            )}

            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>

            {message.role === 'user' && (
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <User className="h-5 w-5 text-primary-foreground" />
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Loading indicator */}
        {sendMutation.isPending && (
          <div className="flex gap-3 justify-start">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          </div>
        )}
      </div>

      {/* Suggested actions */}
      {suggestedActions.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {suggestedActions.map((action, index) => (
            <Badge
              key={index}
              variant="outline"
              className="cursor-pointer hover:bg-accent"
              onClick={() => handleSuggestedAction(action)}
            >
              <Sparkles className="h-3 w-3 mr-1" />
              {action}
            </Badge>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2">
        <Textarea
          placeholder="Ask your tutor anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
          className="resize-none"
          disabled={sendMutation.isPending}
        />
        <Button
          onClick={handleSend}
          disabled={!input.trim() || sendMutation.isPending}
          size="icon"
          className="flex-shrink-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>

      <p className="text-xs text-muted-foreground text-center mt-2">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  );
}