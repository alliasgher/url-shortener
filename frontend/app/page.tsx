"use client";

import { useState, useCallback } from "react";
import { Link2, BarChart3, Globe, Zap } from "lucide-react";
import { Header } from "@/components/header";
import { ShortenForm } from "@/components/shorten-form";
import { ResultCard } from "@/components/result-card";
import { LinkHistory } from "@/components/link-history";
import { addToHistory } from "@/lib/history";
import type { LinkResponse } from "@/lib/types";

export default function Home() {
  const [result, setResult] = useState<LinkResponse | null>(null);
  const [historyKey, setHistoryKey] = useState(0);

  const handleResult = useCallback((link: LinkResponse) => {
    setResult(link);
    addToHistory(link);
    setHistoryKey((k) => k + 1);
  }, []);

  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col items-center px-4">
        {/* Hero section with animated background */}
        <section className="relative w-full overflow-hidden">
          {/* Gradient orbs */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-mint/10 blur-3xl" />
            <div className="absolute -top-12 right-1/4 h-56 w-56 rounded-full bg-navy/10 blur-3xl" />
            <div className="absolute top-32 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-coral/5 blur-3xl" />
          </div>

          <div className="relative mx-auto flex max-w-3xl flex-col items-center pt-20 pb-12">
            <div className="mb-4 inline-flex items-center rounded-full border border-mint/20 bg-mint/10 px-3.5 py-1 text-xs font-medium text-mint-dark dark:text-mint">
              <Zap className="mr-1.5 h-3 w-3" />
              Free &amp; Open Source
            </div>
            <h1 className="mb-4 text-center font-heading text-4xl font-bold tracking-tight text-deep dark:text-white sm:text-5xl lg:text-6xl">
              Shorten your links,
              <br />
              <span className="bg-gradient-to-r from-navy to-mint bg-clip-text text-transparent dark:from-mint dark:to-white">
                track every click
              </span>
            </h1>
            <p className="mb-10 max-w-lg text-center text-text-muted leading-relaxed">
              Paste a URL and get a short link with real-time analytics — geographic,
              device, and referrer breakdown. No signup required.
            </p>

            <ShortenForm onResult={handleResult} />

            {result && (
              <div className="mt-6 w-full flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-300">
                <ResultCard link={result} />
              </div>
            )}
          </div>
        </section>

        {/* Feature highlights */}
        <section className="w-full max-w-3xl pb-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <FeatureCard
              icon={<Link2 className="h-5 w-5 text-navy dark:text-mint" />}
              title="Instant Shortening"
              description="Paste any URL and get a short link in milliseconds"
            />
            <FeatureCard
              icon={<BarChart3 className="h-5 w-5 text-mint" />}
              title="Click Analytics"
              description="Track clicks, devices, browsers, and referrers in real time"
            />
            <FeatureCard
              icon={<Globe className="h-5 w-5 text-coral" />}
              title="Geo Tracking"
              description="See where your visitors are coming from around the world"
            />
          </div>
        </section>

        {/* Link history */}
        <section className="w-full flex justify-center pb-16">
          <LinkHistory key={historyKey} />
        </section>
      </main>
    </>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md">
      <div className="mb-3 inline-flex rounded-lg bg-surface dark:bg-muted p-2">{icon}</div>
      <h3 className="mb-1 font-heading text-sm font-semibold text-deep dark:text-white">{title}</h3>
      <p className="text-xs leading-relaxed text-text-muted">{description}</p>
    </div>
  );
}
