import axios from "axios";
import { useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!prompt.trim()) return;

    try {
      setLoading(true);
      const response = await axios.post(
        "https://cd-review-backend-production.up.railway.app/ai-response",
        {
          prompt: prompt,
        }
      );

      setResponse(response.data.aiRes);
    } catch (error) {
      console.error(error);
      setResponse("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-black text-white p-4 md:p-6 flex flex-col">
      <div className="flex-1 w-full border border-gray-500 rounded-2xl md:rounded-3xl flex flex-col md:flex-row overflow-hidden">
        {/* LEFT SECTION */}
        <div className="w-full h-1/2 md:w-1/2 md:h-full p-4 md:p-6 flex flex-col gap-4 md:gap-6 border-b md:border-b-0 md:border-r border-gray-500">
          {/* TEXTAREA */}
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type your request..."
            className="flex-1 resize-none rounded-xl md:rounded-3xl border border-gray-500 bg-transparent p-4 md:p-5 outline-none text-white"
          />

          {/* BUTTON */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="h-12 md:h-14 shrink-0 rounded-xl border border-gray-500 hover:bg-white hover:text-black transition-all"
          >
            {loading ? "Generating..." : "Submit"}
          </button>
        </div>

        {/* RIGHT SECTION */}
        <div className="w-full h-1/2 md:w-1/2 md:h-full p-4 md:p-6">
          <div className="h-full w-full rounded-xl md:rounded-3xl border border-gray-500 p-4 md:p-5 overflow-y-auto">
            {loading ? (
              <p>Generating response...</p>
            ) : (
              <div className="whitespace-pre-wrap">
                <Markdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");

                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={dark}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code
                          className="bg-gray-800 px-1 py-0.5 rounded"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {response || "AI response will appear here..."}
                </Markdown>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
