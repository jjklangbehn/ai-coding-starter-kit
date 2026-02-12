import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-4">
      <div className="flex max-w-2xl flex-col items-center gap-6 text-center">
        <Badge variant="secondary" className="gap-1.5 px-3 py-1 text-sm">
          <CheckCircle2 className="size-3.5" />
          Open Source Todo App
        </Badge>

        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Organize Your Day,
          <span className="text-primary">Your Way</span>
        </h1>

        <p className="max-w-md text-lg text-muted-foreground">
          A beautifully simple todo app with lists, priorities, and due dates.
          Stay focused on what matters most.
        </p>

        <div className="flex gap-3">
          <Button asChild size="lg">
            <Link href="/app">
              Get Started
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
