import { useState } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import axios from "axios";

const API_KEY = "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";
// "Explain things like you would to a 10 year old learning how to code."
const systemMessage = {
  //  Explain things like you're talking to a software professional with 5 years of experience.
  role: "system",
  content:
    "Explain things like you're talking to a software professional with 2 years of experience.",
};

function Chatbot() {
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm ChatGPT! Ask me anything!",
      sentTime: "just now",
      sender: "ChatGPT",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: "outgoing",
      sender: "user",
    };

    const newMessages = [...messages, newMessage];

    setMessages(newMessages);
    setIsTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages) {
    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message };
    });

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      prompt: "Hello, ChatGPT!",
      temperature: 0.7,
      max_tokens: 60,
      n: 1,
      stop: "\n",
      presence_penalty: 0.6,
      frequency_penalty: 0.6,
      time_out: 20,
    };

    const res = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      apiRequestBody,
      {
        headers: {
          Authorization: "Bearer " + API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(res.data);
    setMessages([
      ...chatMessages,
      {
        message: res.data.choices[0].text,
        sender: "ChatGPT",
      },
    ]);
    setIsTyping(false);
  }

  return (
    <div className="Chatbot">
      <div style={{ position: "relative", height: "400px", width: "400px" }}>
        <MainContainer>
          <ChatContainer>
            <MessageList
              scrollBehavior="smooth"
              typingIndicator={
                isTyping ? (
                  <TypingIndicator content="ChatGPT is typing" />
                ) : null
              }
            >
              {messages.map((message, i) => {
                console.log(message);
                return <Message key={i} model={message} />;
              })}
            </MessageList>
            <MessageInput placeholder="Type message here" onSend={handleSend} />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
}

export default Chatbot;
