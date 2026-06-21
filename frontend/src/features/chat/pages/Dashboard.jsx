import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useChat } from "../hooks/useChat";
import { Search, Plus, MessageSquare, Send } from "lucide-react";

const Dashboard = () => {
  const chat = useChat();

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    chat.initializeSocketConnection();
  }, []);

  const chats = [
    "What is WebRTC?",
    "Difference between STUN and TURN",
    "How does Prisma work?",
    "Node.js Interview Questions",
    "Build a Chat App",
  ];

  return (
    <div className="h-screen bg-[#0f0f0f] text-white flex">
      {/* Sidebar */}
      <aside className="w-72 border-r border-zinc-800 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-zinc-800">
          <h1 className="text-2xl font-bold tracking-wide">Perplexity</h1>
        </div>

        {/* New Chat */}
        <div className="p-4">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 transition">
            <Plus size={18} />
            New Chat
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto px-4">
          <h3 className="text-sm text-zinc-500 mb-3">Recent Chats</h3>

          <div className="space-y-2">
            {chats.map((chat, index) => (
              <button
                key={index}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-zinc-900 transition text-left"
              >
                <MessageSquare size={16} />
                <span className="truncate text-sm">{chat}</span>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-4xl">
          {/* Heading */}
          <h1 className="text-5xl font-semibold text-center mb-12">
            What do you want to know?
          </h1>

          {/* Search Box */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-4 shadow-xl">
            <div className="flex items-center gap-4">
              <Search className="text-zinc-500" />

              <input
                type="text"
                placeholder="Ask anything..."
                className="flex-1 bg-transparent outline-none text-lg placeholder:text-zinc-500"
              />

              <button className="h-11 w-11 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
