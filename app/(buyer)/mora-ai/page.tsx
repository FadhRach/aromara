"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function MoraAIPage() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([
    {
      role: "assistant",
      content: "Halo! Saya MORA AI, asisten virtual Aromara. Ada yang bisa saya bantu hari ini? Saya dapat membantu Anda menemukan supplier, produk, atau menjawab pertanyaan seputar bahan baku aroma."
    }
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    // Add user message
    const newMessages = [...messages, { role: "user", content: question }];
    setMessages(newMessages);
    setQuestion("");

    // TODO: Implement actual AI response
    // For now, just add a placeholder response
    setTimeout(() => {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "Terima kasih atas pertanyaan Anda. Fitur MORA AI sedang dalam pengembangan dan akan segera tersedia. Untuk sementara, Anda dapat menjelajahi supplier dan produk kami di halaman Explore Suppliers."
        }
      ]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#FAFAEE] pt-32 pb-16">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#252F24] mb-3">
            MORA AI Assistant
          </h1>
          <p className="text-[#252F24]/70">
            Tanyakan apapun tentang supplier, produk, atau bahan baku aroma
          </p>
        </div>

        {/* Chat Container */}
        <Card className="bg-white border-none shadow-lg mb-6">
          <CardContent className="p-6">
            {/* Messages */}
            <div className="space-y-4 mb-6 max-h-[500px] overflow-y-auto">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-3 ${
                      message.role === "user"
                        ? "bg-[#252F24] text-white"
                        : "bg-[#E8F5E9] text-[#252F24]"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ketik pertanyaan Anda di sini..."
                className="flex-1 px-4 py-3 bg-[#FAFAEE] border border-[#252F24]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#252F24]/20"
              />
              <Button
                type="submit"
                className="bg-[#252F24] hover:bg-[#252F24]/90 text-white px-6"
              >
                Kirim
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Quick Questions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-[#E8F5E9] border-none hover:shadow-md transition cursor-pointer">
            <CardContent className="p-4">
              <p className="text-sm text-[#252F24]">
                💡 Rekomendasi supplier untuk minyak lavender?
              </p>
            </CardContent>
          </Card>
          <Card className="bg-[#E8F5E9] border-none hover:shadow-md transition cursor-pointer">
            <CardContent className="p-4">
              <p className="text-sm text-[#252F24]">
                💡 Apa perbedaan COA dan MSDS?
              </p>
            </CardContent>
          </Card>
          <Card className="bg-[#E8F5E9] border-none hover:shadow-md transition cursor-pointer">
            <CardContent className="p-4">
              <p className="text-sm text-[#252F24]">
                💡 Supplier dengan sertifikasi halal?
              </p>
            </CardContent>
          </Card>
          <Card className="bg-[#E8F5E9] border-none hover:shadow-md transition cursor-pointer">
            <CardContent className="p-4">
              <p className="text-sm text-[#252F24]">
                💡 Berapa harga essential oil jasmine?
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
