import React from "react";
import { CircleHelp, LifeBuoy } from "lucide-react";

export default function Help() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-bg-main text-text-main p-6 transition-colors duration-200 text-left">
      <div className="max-w-3xl mx-auto bg-surface border border-border-main p-8 rounded-2xl shadow-xl mt-6">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border-main">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <LifeBuoy className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Help Center</h1>
            <p className="text-xs text-text-sub mt-0.5">Let's solve some problems together (mostly yours)</p>
          </div>
        </div>

        <div className="space-y-6 text-sm leading-relaxed font-light">
          <section>
            <h2 className="text-lg font-bold text-text-main mb-2">Frequently Unasked Questions</h2>
            <div className="space-y-4 mt-3">
              <div className="bg-bg-main p-4 rounded-xl border border-border-main">
                <p className="font-bold text-text-main text-xs uppercase mb-1">Q: The website isn't working. What do I do?</p>
                <p className="text-text-secondary">
                  A: Have you tried turning it off and on again? If that fails, try refreshing the page 47 times. If it still doesn't work, stand up, take a deep breath, walk away, and accept that technology is a mystery to us all.
                </p>
              </div>

              <div className="bg-bg-main p-4 rounded-xl border border-border-main">
                <p className="font-bold text-text-main text-xs uppercase mb-1">Q: My video is loading too slowly. Is it my internet?</p>
                <p className="text-text-secondary">
                  A: Probably. But there is also a 10% chance our backend hamsters are currently on their lunch break. Please give them 15 minutes to finish their lettuce.
                </p>
              </div>

              <div className="bg-bg-main p-4 rounded-xl border border-border-main">
                <p className="font-bold text-text-main text-xs uppercase mb-1">Q: Can I get a refund for my subscription?</p>
                <p className="text-text-secondary">
                  A: We would love to give you a refund, but our refund system is currently programmed in a language that was lost to history in the 4th century. We are working on hiring a translator.
                </p>
              </div>
            </div>
          </section>

          <section className="pt-4 border-t border-border-main text-center">
            <p className="text-text-sub text-xs">
              Still need help? Send an email to <strong>support@we-probably-wont-reply.com</strong> and our support AI bot will mark it as "read" immediately.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
