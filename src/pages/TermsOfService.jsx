import React from "react";
import { Scale } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-bg-main text-text-main p-6 transition-colors duration-200 text-left">
      <div className="max-w-3xl mx-auto bg-surface border border-border-main p-8 rounded-2xl shadow-xl mt-6">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border-main">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Scale className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Terms of Service</h1>
            <p className="text-xs text-text-sub mt-0.5">Please read this contract carefully (or just scroll and click accept)</p>
          </div>
        </div>

        <div className="space-y-6 text-sm leading-relaxed font-light">
          <section>
            <h2 className="text-lg font-bold text-text-main mb-2">1. Agreement to Terms</h2>
            <p className="text-text-secondary">
              By accessing this website, you agree to sell your soul, your firstborn, and your left shoe to our developer team. If you do not agree to these terms, please close this browser tab immediately and consider reading a book instead.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-main mb-2">2. The "Don't Be a Jerk" Rule</h2>
            <p className="text-text-secondary">
              You agree not to upload videos that are illegal, hateful, or contain pineapple on pizza propaganda. We reserve the right to delete your videos, ban your IP, and tell your middle school teacher if you violate this rule.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-main mb-2">3. Limitation of Liability</h2>
            <p className="text-text-secondary">
              In no event shall we be liable for any damages (including, without limitation, loss of sleep, loss of focus during work, or excessive laughing at silly videos). If the server crashes during a crucial upload, you are legally obligated to say "It's not a bug, it's a feature."
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-main mb-2">4. Severability</h2>
            <p className="text-text-secondary">
              If any provision of these Terms is found to be invalid under any applicable law, such provisions shall be deleted without affecting the remaining provisions herein. We will just write a new rule on a post-it note and stick it to the server.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
