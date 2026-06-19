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
      const response = await axios.post("http://localhost:3000/ai-response", {
        "prompt": prompt
      });




      setResponse(response.data.aiRes);



    } catch (error) {
      console.error(error);
      setResponse("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-black text-white p-6">
      <div className="h-full w-full border border-gray-500 rounded-3xl flex overflow-hidden">

        {/* LEFT SECTION */}
        <div className="w-1/2 p-6 flex flex-col gap-6 border-r border-gray-500">

          {/* TEXTAREA */}
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type your request..."
            className="flex-1 resize-none rounded-3xl border border-gray-500 bg-transparent p-5 outline-none text-white"
          />

          {/* BUTTON */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="h-14 rounded-xl border border-gray-500 hover:bg-white hover:text-black transition-all"
          >
            {loading ? "Generating..." : "Submit"}
          </button>
        </div>

        {/* RIGHT SECTION */}
        <div className="w-1/2 p-6">
          <div className="h-full w-full rounded-3xl border border-gray-500 p-5 overflow-y-auto">
            {loading ? (
              <p>Generating response...</p>
            ) : (
              <div className="whitespace-pre-wrap">
                <Markdown
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