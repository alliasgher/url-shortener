"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { ShortenForm } from "@/components/shorten-form";
import { ResultCard } from "@/components/result-card";
import type { LinkResponse } from "@/lib/types";

export default function Home() {
  const [result, setResult] = useState<LinkResponse | null>(null);

  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16">
        <div className="mb-3 inline-flex items-center rounded-full bg-mint/10 px-3 py-1 text-xs font-medium text-mint-dark">
          Free &amp; Open Source
        </div>
        <h1 className="mb-3 text-center font-heading text-4xl font-bold tracking-tight text-deep sm:text-5xl">
          Shorten your links,
          <br />
          <span className="text-navy">track every click</span>
        </h1>
        <p className="mb-8 max-w-md text-center text-text-muted">
          Paste a URL and get a short link with real-time analytics — geographic,
          device, and referrer breakdown.
        </p>

        <ShortenForm onResult={setResult} />

        {result && (
          <div className="mt-6 w-full flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-300">
            <ResultCard link={result} />
          </div>
        )}
      </main>
    </>
  );
}
