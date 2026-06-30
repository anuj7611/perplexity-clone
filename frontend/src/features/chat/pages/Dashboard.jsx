import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useChat } from "../hooks/useChat";
import remarkGfm from "remark-gfm";

const Dashboard = () => {
  const chat = useChat();

  const [chatInput, setChatInput] = useState("");

  const chats = useSelector((state) => state.chat.chats);
  const currentChatId = useSelector((state) => state.chat.currentChatId);

  useEffect(() => {
    chat.initializeSocketConnection();
    chat.handleGetChats();
  }, []);

  const handleSubmitMessage = (e) => {
    e.preventDefault();

    const message = chatInput.trim();

    if (!message) return;

    chat.handleSendMessage({
      message,
      chatId: currentChatId,
    });

    setChatInput("");
  };

  const openChat = (chatId) => {
    chat.handleOpenChat(chatId, chats);
  };

  return (
    <div className="h-screen bg-[#0a0a0a] text-white flex overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden md:flex w-72 flex-col border-r border-zinc-800 bg-[#111111]">
        <div className="p-6">
          <h1 className="text-3xl font-bold">Perplexity</h1>

          <p className="text-sm text-zinc-500 mt-2">AI Search Assistant</p>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="space-y-2">
            {Object.values(chats).map((chatItem) => (
              <button
                key={chatItem.id}
                onClick={() => openChat(chatItem.id)}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                  currentChatId === chatItem.id
                    ? "bg-zinc-800 border border-zinc-700"
                    : "hover:bg-zinc-900"
                }`}
              >
                <p className="truncate text-sm">
                  {chatItem.title || "New Chat"}
                </p>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <section className="flex-1 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto w-full px-8 py-10">
            {!currentChatId && (
              <div className="h-[70vh] flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-5xl font-bold mb-4">
                    What do you want to know?
                  </h1>

                  <p className="text-zinc-500 text-lg">
                    Ask anything and get instant answers.
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-10">
              {chats[currentChatId]?.messages?.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {/* USER MESSAGE */}
                  {message.role === "user" ? (
                    <div
                      className="
                        max-w-[75%]
                        rounded-3xl
                        rounded-br-md
                        bg-blue-600
                        px-6
                        py-4
                        shadow-lg
                      "
                    >
                      <p className="text-base leading-8">{message.content}</p>
                    </div>
                  ) : (
                    /* ASSISTANT MESSAGE */
                    <div
                      className="
                        w-fit
                        max-w-full
                        rounded-3xl
                        bg-[#111111]
                        px-8
                        py-6
                      "
                    >
                      <div className="prose prose-invert max-w-none">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            h1: ({ children }) => (
                              <h1 className="text-4xl font-bold text-white mb-6 mt-8">
                                {children}
                              </h1>
                            ),

                            h2: ({ children }) => (
                              <h2 className="text-3xl font-bold text-white mb-5 mt-8">
                                {children}
                              </h2>
                            ),

                            h3: ({ children }) => (
                              <h3 className="text-2xl font-semibold text-white mb-4 mt-6">
                                {children}
                              </h3>
                            ),

                            p: ({ children }) => (
                              <p className="text-lg leading-9 text-zinc-200 mb-5">
                                {children}
                              </p>
                            ),

                            ul: ({ children }) => (
                              <ul className="list-disc pl-8 mb-6 space-y-3">
                                {children}
                              </ul>
                            ),

                            ol: ({ children }) => (
                              <ol className="list-decimal pl-8 mb-6 space-y-3">
                                {children}
                              </ol>
                            ),

                            li: ({ children }) => (
                              <li className="text-lg leading-8 text-zinc-200">
                                {children}
                              </li>
                            ),

                            strong: ({ children }) => (
                              <strong className="font-bold text-white">
                                {children}
                              </strong>
                            ),

                            blockquote: ({ children }) => (
                              <blockquote className="border-l-4 border-blue-500 pl-4 italic my-5 text-zinc-300">
                                {children}
                              </blockquote>
                            ),

                            hr: () => null,

                            code: ({ inline, children }) =>
                              inline ? (
                                <code className="bg-zinc-800 text-blue-300 px-2 py-1 rounded">
                                  {children}
                                </code>
                              ) : (
                                <code>{children}</code>
                              ),

                            pre: ({ children }) => (
                              <pre className="bg-black border border-zinc-800 rounded-2xl p-5 overflow-x-auto my-6">
                                {children}
                              </pre>
                            ),
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-zinc-800 bg-[#0a0a0a]">
          <div className="max-w-5xl mx-auto p-4">
            <form
              onSubmit={handleSubmitMessage}
              className="flex items-center gap-3 bg-[#171717] border border-zinc-700 rounded-3xl p-3"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask anything..."
                className="flex-1 bg-transparent outline-none text-white placeholder:text-zinc-500 px-3"
              />

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={!chatInput.trim()}
                type="submit"
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50"
              >
                Send
              </motion.button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
