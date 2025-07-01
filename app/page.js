import Link from "next/link"
import { ArrowRight, Mail, Sparkles, CheckCircle, Star, Zap, Shield, Github, Code, Palette, Lock, Brain, Database, Cloud } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const features = [
  {
    icon: Lock,
    title: "User Registration & Login",
    description:
      "Secure signup and login system with form validations and JWT authentication ready for production.",
  },
  {
    icon: Palette,
    title: "Responsive UI",
    description:
      "Beautifully designed interface with dark mode support, built for desktop and tablets with modern aesthetics.",
  },
  {
    icon: Code,
    title: "Modern Tech Stack",
    description:
      "Built using Next.js 14 with app router, server components, and latest React features for optimal performance.",
  },
  {
    icon: Mail,
    title: "Multi-Inbox Management",
    description:
      "Connect and manage multiple Gmail accounts from one unified dashboard with seamless synchronization.",
  },
  {
    icon: Brain,
    title: "AI-Powered Features",
    description:
      "Smart email categorization, auto resource extraction, and AI-based email generation using Gemini API.",
  },
  {
    icon: Zap,
    title: "Modular & Scalable",
    description:
      "Clean, production-ready codebase with modular structure designed for easy extension and maintenance.",
  },
]

const techStack = [
  {
    category: "Frontend & Backend",
    tech: "Next.js 14",
    icon: Code,
    color: "from-black to-gray-700"
  },
  {
    category: "Styling",
    tech: "Tailwind CSS & Radix UI",
    icon: Palette,
    color: "from-blue-500 to-cyan-500"
  },
  {
    category: "AI Integration",
    tech: "Gemini API",
    icon: Brain,
    color: "from-purple-500 to-pink-500"
  },
  {
    category: "Database",
    tech: "MongoDB",
    icon: Database,
    color: "from-green-600 to-green-400"
  },
  {
    category: "Deployment",
    tech: "Vercel",
    icon: Cloud,
    color: "from-gray-900 to-black"
  },
  {
    category: "Mail",
    tech: "Gmail API",
    icon: Mail,
    color: "from-red-500 to-orange-500"
  }
]

const stats = [
  { number: "Next.js", label: "Latest Framework" },
  { number: "GeminiAI", label: "Smart Features" },
  { number: "Dark", label: "Themed" },
  { number: "Production", label: "Ready" },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background w-screen">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center">
              <img src="/icon.png" alt="logo" className="rounded-lg" />
            </div>
            <span className="text-xl font-bold">MailBoard</span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="#tech-stack" className="text-sm font-medium hover:text-primary transition-colors">
              Tech Stack
            </Link>
            <Link href="#demo" className="text-sm font-medium hover:text-primary transition-colors">
              Demo
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="https://github.com/Aditya-madwal/mailboard" target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4 mr-2" />
                GitHub
              </Link>
            </Button>
            <Button
              asChild
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Link href="/signup">Try Demo</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="outline" className="mb-4">
            🚀 Keep better track of your emails and tasks
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Smart Email Management{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              With AI Power
            </span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A modern email management SaaS platform built with Next.js, featuring AI-powered categorization,
            multi-inbox support, and smart email generation using Gemini API.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              asChild
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Link href="/signup">
                Try Live Demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="https://github.com/Aditya-madwal/mailboard" target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" />
                View on GitHub
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">{stat.number}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built with modern technologies and AI integration for the next generation of email management.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="tech-stack" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">⚡ Modern Tech Stack</h2>
            <p className="text-xl text-muted-foreground">Built with cutting-edge technologies for optimal performance and scalability</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {techStack.map((item, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-6 pt-6 flex items-center justify-center flex-col">
                  <div className={`h-12 w-12 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="font-semibold text-sm text-muted-foreground mb-1">{item.category}</div>
                  <div className="font-bold text-lg">{item.tech}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20 px-4 bg-muted/20">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Experience Smart Email Management?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Try the live demo or explore the source code on GitHub. Built with passion for developers by developers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              asChild
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Link href="/signup">
                Launch Demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="https://github.com/Aditya-madwal/mailboard" target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" />
                Star on GitHub
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/20 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
                  <img src="/icon.png" alt="logo" className="rounded-lg" />
                </div>
                <span className="text-lg font-bold">MailBoard</span>
              </div>
              <p className="text-sm text-muted-foreground">Email and Task management for modern professionals and students.</p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Project</h4>
              <div className="space-y-2 text-sm">
                <Link href="#features" className="block text-muted-foreground hover:text-foreground">
                  Features
                </Link>
                <Link href="#tech-stack" className="block text-muted-foreground hover:text-foreground">
                  Tech Stack
                </Link>
                <Link href="/signup" className="block text-muted-foreground hover:text-foreground">
                  Live Demo
                </Link>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Open Source</h4>
              <div className="space-y-2 text-sm">
                <Link href="https://github.com/Aditya-madwal/mailboard" className="block text-muted-foreground hover:text-foreground">
                  GitHub Repository
                </Link>
                <Link href="https://github.com/Aditya-madwal/mailboard/issues" className="block text-muted-foreground hover:text-foreground">
                  Report Issues
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 MailBoard</p>
          </div>
        </div>
      </footer>
    </div>
  )
}