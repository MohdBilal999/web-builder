import { ArrowRight } from "lucide-react"
import {Link} from "react-router-dom"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { SplashScreen } from "@/components/splash-screen"

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(true)
  useTheme()

  // Simulate loading time
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <SplashScreen />
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background/50 to-background">
      {/* Header */}
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold">
            WB
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 text-transparent bg-clip-text">
            WebBuilder
          </h1>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-muted-foreground hover:text-violet-600 transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="text-muted-foreground hover:text-violet-600 transition-colors">
            How It Works
          </a>
          <a href="#testimonials" className="text-muted-foreground hover:text-violet-600 transition-colors">
            Testimonials
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Link to="/builder">
            <Button variant="outline" className="hidden md:flex">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-transparent bg-clip-text">
            Build Beautiful Websites Without Code
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Our drag-and-drop website builder makes it easy to create professional websites in minutes, not months.
          </p>
          <Link to="/builder">
            <Button
              size="lg"
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Start Building Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-16 w-full max-w-5xl mx-auto relative"
        >
          <div className="bg-card rounded-2xl shadow-2xl overflow-hidden border border-border">
            <div className="h-12 bg-muted flex items-center px-4 gap-2">
              <div className="h-3 w-3 rounded-full bg-red-400"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
              <div className="h-3 w-3 rounded-full bg-green-400"></div>
              <div className="h-6 w-64 bg-muted-foreground/20 rounded-full ml-4"></div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-12 gap-4 h-[400px]">
                <div className="col-span-3 bg-muted rounded-lg p-3">
                  <div className="h-8 w-24 bg-violet-100 dark:bg-violet-900/40 rounded-md mb-4"></div>
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="h-10 bg-card rounded-md shadow-sm flex items-center px-3">
                        <div className="h-4 w-4 rounded-full bg-violet-200 dark:bg-violet-800 mr-2"></div>
                        <div className="h-3 w-16 bg-muted-foreground/20 rounded-full"></div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-span-6 bg-card rounded-lg border border-border p-4">
                  <div className="h-12 w-48 bg-violet-100 dark:bg-violet-900/40 rounded-lg mb-6 mx-auto"></div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="h-24 bg-muted rounded-lg"></div>
                    <div className="h-24 bg-muted rounded-lg"></div>
                  </div>
                  <div className="h-32 bg-muted rounded-lg mb-4"></div>
                  <div className="flex justify-center">
                    <div className="h-10 w-32 bg-violet-500 rounded-lg"></div>
                  </div>
                </div>
                <div className="col-span-3 bg-muted rounded-lg p-3">
                  <div className="h-8 w-24 bg-violet-100 dark:bg-violet-900/40 rounded-md mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-24 bg-card rounded-md shadow-sm p-3">
                      <div className="h-3 w-full bg-muted-foreground/20 rounded-full mb-2"></div>
                      <div className="h-3 w-3/4 bg-muted-foreground/20 rounded-full mb-2"></div>
                      <div className="h-8 w-full bg-muted rounded-md mt-4"></div>
                    </div>
                    <div className="h-24 bg-card rounded-md shadow-sm"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -z-10 -top-10 -right-10 h-64 w-64 bg-indigo-100 dark:bg-indigo-900/20 rounded-full opacity-60 blur-3xl"></div>
          <div className="absolute -z-10 -bottom-10 -left-10 h-64 w-64 bg-violet-100 dark:bg-violet-900/20 rounded-full opacity-60 blur-3xl"></div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={container}
            className="text-center mb-16"
          >
            <motion.h2 variants={item} className="text-3xl md:text-4xl font-bold mb-4">
              Powerful Features
            </motion.h2>
            <motion.p variants={item} className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to build professional websites without writing a single line of code.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={container}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                title: "Drag & Drop Editor",
                description: "Simply drag elements onto your page and position them exactly where you want.",
                icon: "✨",
              },
              {
                title: "Responsive Design",
                description: "Your website will look great on any device - desktop, tablet, or mobile.",
                icon: "📱",
              },
              {
                title: "Custom Styling",
                description: "Customize colors, fonts, sizes, and more with our intuitive property panel.",
                icon: "🎨",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={item}
                className="bg-background p-8 rounded-2xl shadow-lg border border-border hover:shadow-xl transition-shadow"
                whileHover={{ y: -5 }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gradient-to-b from-background to-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={container}
            className="text-center mb-16"
          >
            <motion.h2 variants={item} className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </motion.h2>
            <motion.p variants={item} className="text-muted-foreground max-w-2xl mx-auto">
              Building your website is as easy as 1-2-3.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={container}
            className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {[
              {
                step: "1",
                title: "Choose Elements",
                description: "Select from our library of pre-designed elements.",
              },
              {
                step: "2",
                title: "Customize Design",
                description: "Adjust colors, fonts, and layouts to match your brand.",
              },
              {
                step: "3",
                title: "Publish & Share",
                description: "Export your design or publish it directly to the web.",
              },
            ].map((step, index) => (
              <motion.div key={index} variants={item} className="text-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-16 h-16 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-6"
                >
                  {step.step}
                </motion.div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={container}
            className="text-center mb-16"
          >
            <motion.h2 variants={item} className="text-3xl md:text-4xl font-bold mb-4">
              What Our Users Say
            </motion.h2>
            <motion.p variants={item} className="text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied users who have built their websites with our platform.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={container}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                quote:
                  "I built my entire business website in just one afternoon. It's incredible how easy it is to use!",
                author: "Sarah Johnson",
                role: "Small Business Owner",
              },
              {
                quote:
                  "As a designer, I appreciate the flexibility and control this builder gives me without having to code.",
                author: "Michael Chen",
                role: "Graphic Designer",
              },
              {
                quote: "I've tried many website builders, but this one is by far the most intuitive and powerful.",
                author: "Emma Rodriguez",
                role: "Marketing Consultant",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                variants={item}
                whileHover={{ scale: 1.02 }}
                className="bg-background p-8 rounded-2xl shadow-lg border border-border"
              >
                <div className="mb-4 text-violet-500">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M11 7L9.6 10.5L6 11.5L8.5 14L8 18L11 16L14 18L13.5 14L16 11.5L12.4 10.5L11 7Z"
                      fill="currentColor"
                    />
                    <path
                      d="M16 7L14.6 10.5L11 11.5L13.5 14L13 18L16 16L19 18L18.5 14L21 11.5L17.4 10.5L16 7Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <p className="text-muted-foreground mb-6 italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-bold">{testimonial.author}</p>
                  <p className="text-muted-foreground text-sm">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Build Your Website?</h2>
            <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
              Join thousands of users who are creating stunning websites without writing a single line of code.
            </p>
            <Link to="/builder">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button
                  size="lg"
                  variant="secondary"
                  className="px-8 py-6 rounded-xl text-lg font-medium"
                >
                  Start Building For Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background text-muted-foreground py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold">
                  WB
                </div>
                <h1 className="text-xl font-bold text-foreground">WebBuilder</h1>
              </div>
              <p className="mt-2 text-sm">Build beautiful websites without code.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16">
              <div>
                <h3 className="text-foreground font-medium mb-4">Product</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="hover:text-violet-500 transition-colors">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-violet-500 transition-colors">
                      Templates
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-violet-500 transition-colors">
                      Pricing
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-foreground font-medium mb-4">Company</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="hover:text-violet-500 transition-colors">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-violet-500 transition-colors">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-violet-500 transition-colors">
                      Careers
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-foreground font-medium mb-4">Support</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="hover:text-violet-500 transition-colors">
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-violet-500 transition-colors">
                      Contact
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-violet-500 transition-colors">
                      Community
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">© 2023 WebBuilder. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-violet-500 transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-violet-500 transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-violet-500 transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
