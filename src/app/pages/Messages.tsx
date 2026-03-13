import { useState, useRef, useEffect } from 'react';
import { MOCK_MESSAGES } from '../data/mock';
import { cn } from '../../lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Bell, Users, ArrowLeft, Send, Smile, MessageSquare, Image, Mic } from 'lucide-react';

interface ChatMessage {
  id: string;
  text: string;
  fromMe: boolean;
  time: string;
}

const INITIAL_CHATS: Record<string, ChatMessage[]> = {
  m1: [
    { id: '1', text: '你好！看到你的作品集很棒，想聊聊合作', fromMe: false, time: '10:30' },
    { id: '2', text: '谢谢！请问是什么类型的项目呢？', fromMe: true, time: '10:32' },
    { id: '3', text: '一个电商App的UI设计，预算大概2-3万', fromMe: false, time: '10:35' },
  ],
  m2: [
    { id: '1', text: '设计稿已经更新了，你看看新版本', fromMe: false, time: '昨天' },
    { id: '2', text: '好的，我看看', fromMe: true, time: '昨天' },
  ],
  m3: [
    { id: '1', text: '项目进度怎么样了？', fromMe: false, time: '周一' },
    { id: '2', text: '已经完成80%了，预计这周五交付', fromMe: true, time: '周一' },
    { id: '3', text: '太好了！期待成品', fromMe: false, time: '周一' },
  ],
  m5: [
    { id: '1', text: '视频已经剪辑好了，你看一下效果', fromMe: false, time: '周二' },
    { id: '2', text: '好的，我下载看看', fromMe: true, time: '周二' },
  ],
};

// Auto-reply pool
const AUTO_REPLIES = [
  '好的，收到！',
  '我看看，稍等~',
  '没问题，我们可以详细聊聊',
  '这个方案不错👍',
  '了解了，我整理一下发给你',
  '好的，那我们就这么定了',
];

export function Messages() {
  const [activeTab, setActiveTab] = useState<'private' | 'system'>('private');
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>(INITIAL_CHATS);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const filteredMessages = MOCK_MESSAGES.filter(m =>
    activeTab === 'system' ? m.type === 'system' : m.type === 'private'
  );

  const selectedMessage = MOCK_MESSAGES.find(m => m.id === selectedChat);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (selectedChat) scrollToBottom();
  }, [selectedChat, chatMessages]);

  const handleSend = () => {
    if (!inputValue.trim() || !selectedChat) return;
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      fromMe: true,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages(prev => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), newMsg],
    }));
    setInputValue('');

    // Auto-reply after 1-2s
    setTimeout(() => {
      const reply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)],
        fromMe: false,
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages(prev => ({
        ...prev,
        [selectedChat]: [...(prev[selectedChat] || []), reply],
      }));
    }, 1000 + Math.random() * 1000);
  };

  // Chat detail view
  if (selectedChat && selectedMessage) {
    const messages = chatMessages[selectedChat] || [];
    return (
      <div className="flex flex-col h-[calc(100vh-7rem)]">
        {/* Chat Header */}
        <div className="flex items-center gap-3 px-4 py-3 bg-white/80 border-b border-border" style={{ paddingTop: 'calc(var(--safe-top) + 0.75rem)' }}>
          <button onClick={() => setSelectedChat(null)} className="text-muted-foreground">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <img src={selectedMessage.user.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
          <div className="flex-1">
            <h3 className="text-sm text-foreground">{selectedMessage.user.name}</h3>
            <p className="text-[10px] text-success">在线</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.map(msg => (
            <div key={msg.id} className={cn('flex gap-2', msg.fromMe ? 'flex-row-reverse' : '')}>
              {!msg.fromMe && (
                <img src={selectedMessage.user.avatar} alt="" className="h-7 w-7 rounded-full object-cover flex-shrink-0 mt-1" />
              )}
              <div className={cn(
                'max-w-[75%] rounded-2xl px-3.5 py-2.5',
                msg.fromMe
                  ? 'bg-primary text-primary-foreground rounded-br-md'
                  : 'bg-secondary text-foreground rounded-bl-md'
              )}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
                <p className={cn('text-[10px] mt-1', msg.fromMe ? 'text-primary-foreground/60' : 'text-muted-foreground')}>{msg.time}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="flex items-center gap-2 px-4 py-3 bg-white border-t border-border">
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <Image className="h-5 w-5" />
          </button>
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="输入消息..."
            className="flex-1 rounded-full bg-secondary px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/10 placeholder:text-muted-foreground/50"
          />
          <button
            onClick={handleSend}
            className={cn(
              'rounded-full p-2 transition-colors',
              inputValue.trim() ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
            )}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  // Message list view
  return (
    <div className="flex flex-col pb-4">
      {/* Tabs */}
      <div className="flex gap-4 px-4 pb-2" style={{ paddingTop: 'calc(var(--safe-top) + 1rem)' }}>
        <button
          onClick={() => setActiveTab('private')}
          className={cn(
            'text-sm pb-1 transition-colors border-b-2',
            activeTab === 'private'
              ? 'text-foreground border-primary'
              : 'text-muted-foreground border-transparent'
          )}
        >
          <MessageSquare className="h-4 w-4 inline mr-1" />
          私信
        </button>
        <button
          onClick={() => setActiveTab('system')}
          className={cn(
            'text-sm pb-1 transition-colors border-b-2',
            activeTab === 'system'
              ? 'text-foreground border-primary'
              : 'text-muted-foreground border-transparent'
          )}
        >
          <Bell className="h-4 w-4 inline mr-1" />
          系统通知
        </button>
      </div>

      {/* Message List */}
      <div className="flex flex-col">
        {filteredMessages.length === 0 ? (
          <div className="py-12 text-center">
            <MessageSquare className="h-10 w-10 mx-auto mb-3 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">暂无消息</p>
          </div>
        ) : (
          filteredMessages.map(msg => (
            <button
              key={msg.id}
              onClick={() => msg.type === 'private' && setSelectedChat(msg.id)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 text-left transition-colors',
                msg.type === 'private' ? 'hover:bg-secondary/50 active:bg-secondary' : ''
              )}
            >
              <div className="relative flex-shrink-0">
                <img src={msg.user.avatar} alt={msg.user.name} className="h-12 w-12 rounded-full object-cover" />
                {msg.unread > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-coral text-[10px] text-white">
                    {msg.unread}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm text-foreground">{msg.type === 'system' ? '系统通知' : msg.user.name}</h3>
                  <span className="text-[10px] text-muted-foreground flex-shrink-0">
                    {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true, locale: zhCN })}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate mt-0.5">{msg.lastMessage}</p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
