import { useState } from 'react';
import { Send, AlertTriangle } from 'lucide-react';
import { Product, Version } from '../types';

interface PersonalitySandboxProps {
  product: Product;
  version?: Version;
}

export default function PersonalitySandbox({ product }: PersonalitySandboxProps) {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: `你好！我是 ${product.title} 的预览版本。我可以与你进行简单的对话，展示我的人格特质。请注意，这只是一个沙箱预览，功能可能受限。`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsTyping(true);

    // Simulate assistant response based on personality
    setTimeout(() => {
      const responses = generateMockResponse(userMessage, product);
      setMessages((prev) => [...prev, { role: 'assistant', content: responses }]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Warning Banner */}
      <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2 flex items-center space-x-2 text-yellow-800">
        <AlertTriangle className="w-4 h-4" />
        <span className="text-sm">沙箱预览模式 - 功能受限，仅供参考</span>
      </div>

      {/* Chat Messages */}
      <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-900 shadow-sm'
              }`}
            >
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入消息测试人格..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          使用 Enter 发送消息。沙箱模式仅供预览，完整功能需购买后使用。
        </p>
      </div>
    </div>
  );
}

function generateMockResponse(_input: string, product: Product): string {
  const responses: Record<string, string[]> = {
    assistant: [
      `我是 ${product.title}，一个乐于助人的助手。你可以问我任何问题，我会尽力帮助你。`,
      '很高兴能帮到你！有什么其他我可以帮助你的吗？',
      '明白了！让我来帮你处理这个问题。',
    ],
    companion: [
      `嗨！我是 ${product.title}，你的陪伴型 AI。今天过得怎么样？`,
      '我一直在听你说呢！能多分享一些吗？',
      '真的很开心能和你聊天！',
    ],
    tutor: [
      `你好！我是 ${product.title}，你的个人导师。今天想学习什么？`,
      '很好的问题！让我来详细解释一下...',
      '学习是一个持续的过程，继续保持好奇心！',
    ],
    creative: [
      `欢迎来到 ${product.title} 的创意世界！有什么想法想要实现吗？`,
      '创造力是没有界限的！让我们一起探索无限可能。',
      '这个想法很有趣，让我来帮你扩展一下...',
    ],
    professional: [
      `我是 ${product.title}，专注于专业领域的 AI 助手。请问有什么可以帮到您的？`,
      '根据我的专业知识，我建议...',
      '这是一个很好的问题，让我从专业角度为您解答。',
    ],
  };

  const typeResponses = responses[product.agent_type] || responses.assistant;
  return typeResponses[Math.floor(Math.random() * typeResponses.length)];
}
