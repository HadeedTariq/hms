import {
  ArrowRight,
  Code,
  Database,
  Lock,
  Package,
  Server,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Full-Stack Starter Kit for Modern Web Applications
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              A production-ready template with React, TypeScript, ShadCN,
              Node.js, and more. Start building your next project in minutes,
              not days.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
              <Link
                to={"https://github.com/HadeedTariq/react-node-starter-kit.git"}
                target="__blank"
              >
                <Button size="lg" variant="outline">
                  View on GitHub
                </Button>
              </Link>
            </div>
          </div>
        </section>
        <section
          id="features"
          className="container space-y-6 py-8 md:py-12 lg:py-24"
        >
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
              Features
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              This starter kit includes everything you need to build modern,
              scalable web applications.
            </p>
          </div>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Type-Safe</CardTitle>
                <Code className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  End-to-end type safety with TypeScript on both frontend and
                  backend.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Modern UI</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Beautiful, accessible components with shadcn/ui and Tailwind
                  CSS.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Authentication
                </CardTitle>
                <Lock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Secure authentication with JWT and GitHub OAuth integration.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  API Server
                </CardTitle>
                <Server className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Robust Express.js API with middleware, error handling, and
                  validation.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Database</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  PostgreSQL integration with migrations and type-safe queries.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Performance
                </CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Redis caching for improved performance and reduced database
                  load.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
        <section id="stack" className="container py-8 md:py-12 lg:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
              Tech Stack
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Built with modern technologies for performance, scalability, and
              developer experience.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-[58rem]">
            <Tabs defaultValue="frontend" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="frontend">Frontend</TabsTrigger>
                <TabsTrigger value="backend">Backend</TabsTrigger>
                <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
              </TabsList>
              <TabsContent value="frontend" className="mt-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>React & TypeScript</CardTitle>
                      <CardDescription>
                        Build interactive UIs with type safety
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        React for component-based UI development with TypeScript
                        for static type checking, providing better tooling,
                        error catching, and documentation.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>ShadCN & TailwindCSS</CardTitle>
                      <CardDescription>
                        Beautiful, accessible components and utility-first CSS
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        ShadCN provides a collection of accessible, customizable
                        components while TailwindCSS enables rapid styling with
                        utility classes.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="backend" className="mt-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Node.js & Express</CardTitle>
                      <CardDescription>
                        Fast, scalable server-side JavaScript
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Node.js provides the runtime environment while
                        Express.js offers a minimal and flexible framework for
                        building robust APIs.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>PostgreSQL & Redis</CardTitle>
                      <CardDescription>
                        Reliable database with high-performance caching
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        PostgreSQL for reliable, feature-rich relational
                        database storage and Redis for in-memory caching to
                        improve performance.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="infrastructure" className="mt-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Vercel Deployment</CardTitle>
                      <CardDescription>
                        Global deployment with zero configuration
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Deploy both frontend and backend to Vercel's global edge
                        network for fast loading times and automatic scaling.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Docker</CardTitle>
                      <CardDescription>
                        Consistent development and deployment environments
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Docker containers ensure your application runs the same
                        way in every environment, from development to
                        production.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built with ❤️ using React, TypeScript, ShadCN, Node.js, and more.
          </p>
          <div className="flex items-center gap-4">
            <Link
              to="https://github.com/HadeedTariq/react-node-starter-kit.git"
              target="_blank"
              rel="noreferrer"
              className="text-sm text-muted-foreground underline underline-offset-4"
            >
              GitHub
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
