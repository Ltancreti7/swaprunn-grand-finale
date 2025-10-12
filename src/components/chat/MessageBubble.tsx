import { format } from 'date-fns';

interface MessageBubbleProps {
  message: string;
  senderType: 'driver' | 'dealer';
  timestamp: string;
  isCurrentUser: boolean;
}

export const MessageBubble = ({ message, senderType, timestamp, isCurrentUser }: MessageBubbleProps) => {
  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${
        isCurrentUser 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-muted text-muted-foreground'
      }`}>
        <div className="text-sm font-medium mb-1">
          {senderType === 'driver' ? 'Driver' : 'Dealer'}
        </div>
        <div className="text-sm">{message}</div>
        <div className="text-xs opacity-70 mt-1">
          {format(new Date(timestamp), 'HH:mm')}
        </div>
      </div>
    </div>
  );
};