// import { React, useState } from "react";

// import Navbar from "../../components/Navbar/Navbar";
// import { Button } from "../../components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "../../components/ui/card";
// import { Input } from "../../components/ui/input";

// const AiAgent = () => {
//   const [message, setMessage] = useState("");
//   const [conversation, setConversation] = useState([]);

//   const handleSend = () => {
//     if (message.trim()) {
//       setConversation([
//         ...conversation,
//         { role: "user", content: message },
//         { role: "ai", content: "This is a simulated AI response." },
//       ]);
//       setMessage("");
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="ai-container">
//         <Card className="chat-model">
//           <CardHeader className="space-y-1">
//             <CardTitle className="text-xl text-blue-700">AI Assistant</CardTitle>
//             <CardDescription className="text-slate-600">
//               Ask me anything about your data
//             </CardDescription>
//           </CardHeader>

//           <CardContent className="">
//             {conversation.map((msg, index) => (
//               <div
//                 key={index}
//                 className={`mb-1 ${
//                   msg.role === "ai" ? "text-left text-blue-700" : "text-right text-slate-800"
//                 }`}
//               >
//                 <strong>{msg.role === "ai" ? "AI: " : "You: "}</strong>
//                 {msg.content}
//               </div>
//             ))}
//           </CardContent>

//           <CardFooter className="flex gap-2">
//             <Input
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               placeholder="Type your message..."
//               onKeyDown={(e) => e.key === "Enter" && handleSend()}
//               className="focus-visible:ring-blue-500"
//             />
//             <Button onClick={handleSend} className="bg-blue-600 hover:bg-blue-700">
//               Send
//             </Button>
//           </CardFooter>
//         </Card>
//       </div>
//     </>
//   );
// };

// export default AiAgent;


import React from 'react'
import "./AiAgent.css"
import Navbars from '../../components/Navbar/Navbar'

const AiAgent = () => {
  return (
    <>
  <Navbars/>
    <div class="wrapper">
  <h1>coming soon<span class="dot">.</span></h1>
  <p>Put some text here.</p>
 </div>
 </>
  )
}

export default AiAgent

