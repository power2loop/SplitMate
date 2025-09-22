import {React, useState} from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

const AiAgent = () => {
    const [message, setMessage] = useState("")
    const [conversation, setConversation] = useState([])
  
    const handleSend = () => {
      if (message.trim()) {
        setConversation([
          ...conversation,
          { role: "user", content: message },
          { role: "ai", content: "This is a simulated AI response." },
        ])
        setMessage("")
      }
    }
    
  return (
    <div className="min-h-screen w-screen bg-gradient-to-b from-white to-blue-50 grid place-items-center p-4"> 
      <Card className="w-[1300px] max-w-md shadow-lg border border-blue-100">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl text-blue-700">AI Assistant</CardTitle>
          <CardDescription className="text-slate-600">
            Ask me anything about your data
          </CardDescription>
        </CardHeader>

        <CardContent className="h-[360px] overflow-y-auto space-y-2 pr-2">
          {conversation.map((msg, index) => (
            <div
              key={index}
              className={`mb-1 ${
                msg.role === "ai"
                  ? "text-blue-700 text-left"
                  : "text-right text-slate-800"
              }`}
            >
              <strong>{msg.role === "ai" ? "AI: " : "You: "}</strong>
              {msg.content}
            </div>
          ))}
        </CardContent>

        <CardFooter className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="focus-visible:ring-blue-500"
          />
          <Button onClick={handleSend} className="bg-blue-600 hover:bg-blue-700">
            Send
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default AiAgent;