import React from "react";
import { ShieldAlert } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-bg-main text-text-main p-6 transition-colors duration-200 text-left">
      <div className="max-w-3xl mx-auto bg-surface border border-border-main p-8 rounded-2xl shadow-xl mt-6">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border-main">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Privacy Policy</h1>
            <p className="text-xs text-text-sub mt-0.5">Last updated: Whenever we last got sued</p>
          </div>
        </div>

        <div className="space-y-6 text-sm leading-relaxed font-light">
          <section>
            <h2 className="text-lg font-bold text-text-main mb-2">1. The "We Don't Know Either" Clause</h2>
            <p className="text-text-secondary">
              We take your privacy very seriously. So seriously, in fact, that we don't even know who you are. We don't store your passport, your social security number, or your embarrassing childhood secrets. We only know you as User #849372, who enjoys watching cat videos at 3:00 AM.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-main mb-2">2. What We Collect (And Why)</h2>
            <p className="text-text-secondary">
              We collect cookies. No, not the chocolate chip ones (though we wish we could). We collect browser cookies to remember your theme preferences. If you use Light Mode, we also collect a small amount of pity, because your eyes must be burning.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-main mb-2">3. Data Sharing (Spilling the Beans)</h2>
            <p className="text-text-secondary">
              We do not sell your personal data to advertisers. We do, however, share your search metrics with our server hamsters to optimize loading times. They do not care about your data, they only care about seeds and running on wheels.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text-main mb-2">4. Your Rights</h2>
            <p className="text-text-secondary">
              You have the right to request deletion of your account. We will purge your username, your videos, and your watch history. However, we cannot purge your search history from your mom's mind. Some things are beyond database queries.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
