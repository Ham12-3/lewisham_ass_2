"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState, useEffect, useCallback } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckCircle,
  BookOpen,
  School,
  UserCircle,
  Code,
  Database,
  Layers,
  ArrowRightIcon,
  GraduationCap, // Added for education icon
  Ban, // Replace Barrier with Ban
  // OR
  ShieldAlert, // OR use ShieldAlert instead
  // OR
  AlertOctagon, // OR use AlertOctagon instead
  Cpu, // Added for technology change icon
} from "lucide-react";
import HeroVideoDialog from "@/components/magicui/hero-video-dialog";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import LogoTicker from "@/components/logo-ticker";
import SolutionsBentoGrid from "@/components/solutions-bento-grid";
import HowItWorksCarousel from "@/components/how-it-works-carousel";
import TestimonialsMarquee from "@/components/testimonials-marquee";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Software Developer at Google",
    image: "/testimonials/person1.jpg", // You'll need to add these images or use placeholders
    quote:
      "The bootcamp completely transformed my career. Within 3 months of graduation, I landed my dream job at Google. The curriculum was challenging but incredibly rewarding.",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "UX Designer at Adobe",
    image: "/testimonials/person2.jpg",
    quote:
      "I had no prior design experience, but the instructors were patient and thorough. The hands-on projects helped me build a portfolio that truly impressed recruiters.",
  },
  {
    id: 3,
    name: "Priya Patel",
    role: "Data Scientist at Microsoft",
    image: "/testimonials/person3.jpg",
    quote:
      "The data science track provided a perfect balance of theory and practical application. The career support was outstanding - they helped me prepare for interviews and negotiate my salary.",
  },
];

const faqs = [
  {
    question: "How long are the bootcamp programs?",
    answer:
      "Our bootcamp programs range from 8 to 16 weeks, depending on the track and whether you choose full-time or part-time options. Full-time programs are intensive and require a commitment of 40+ hours per week, while part-time programs are designed to accommodate working professionals.",
  },
  {
    question: "Do I need prior experience to enroll?",
    answer:
      "Most of our bootcamps are designed for beginners with no prior experience. However, we do recommend completing our free prep course before the program starts to ensure you have the foundational knowledge. Some advanced courses may require basic coding knowledge or specific prerequisites.",
  },
  {
    question: "What payment options are available?",
    answer:
      "We offer several payment options including upfront payment, installment plans, and income share agreements for qualified students. We also provide scholarships for underrepresented groups in tech. Our admissions team can help you explore the best options for your situation during your application process.",
  },
  {
    question: "What kind of support do you offer after graduation?",
    answer:
      "We provide comprehensive career support for all graduates including resume reviews, portfolio development, interview preparation, networking events, and direct connections with our hiring partners. Our career services team works with you until you find a position, and our alumni network provides ongoing support throughout your career.",
  },
  {
    question: "What is the application process like?",
    answer:
      "Our application process includes an online application form, a brief interview to understand your goals, and sometimes a technical assessment depending on the program. The entire process typically takes 1-2 weeks, and we provide rapid decisions so you can plan accordingly.",
  },
];

export default function HomePage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }

      // Close mobile menu when scrolling
      if (mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled, mobileMenuOpen]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="fixed top-4 left-0 right-0 z-50 mx-auto max-w-7xl ">
        <div className="flex items-center justify-between bg-gray-200/70 backdrop-blur-md shadow-lg rounded-xl py-3 px-5">
          <Link href="/" className="flex items-center space-x-2">
            <School className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-blue-600">
              Lewisham Tech
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/courses"
              className="font-medium transition text-blue-600 hover:text-blue-800"
            >
              Courses
            </Link>
            <Link
              href="/about"
              className="font-medium transition text-blue-600 hover:text-blue-800"
            >
              About
            </Link>
            <Link
              href="/blog"
              className="font-medium transition text-blue-600 hover:text-blue-800"
            >
              Blog
            </Link>
            <Link
              href="/contact"
              className="font-medium transition text-blue-600 hover:text-blue-800"
            >
              Contact
            </Link>
            <Link href="/staff/login">
              <Button
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-600/10 hover:text-blue-700"
              >
                Staff Login
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-indigo-900"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Spacer for fixed header - updated size */}
      {/* <div className="pt-28 md:pt-32 bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-800 w-full">
      
        <div className="absolute inset-0 opacity-10 overflow-hidden">
          <div className="absolute top-0 left-10 w-64 h-64 rounded-full bg-indigo-500 mix-blend-multiply blur-xl"></div>
          <div className="absolute bottom-0 right-10 w-80 h-80 rounded-full bg-blue-500 mix-blend-multiply blur-xl"></div>
        </div>
      </div> */}
      {/* Mobile Navigation Menu */}
      <motion.div
        className={`absolute top-20 left-4 right-4 mx-auto max-w-7xl bg-gradient-to-r from-indigo-900/98 to-blue-900/98 backdrop-blur-lg shadow-xl rounded-xl overflow-hidden z-50 ${
          mobileMenuOpen ? "block" : "hidden"
        } md:hidden`}
        initial={{ opacity: 0, height: 0, y: -10 }}
        animate={{
          opacity: mobileMenuOpen ? 1 : 0,
          height: mobileMenuOpen ? "auto" : 0,
          y: mobileMenuOpen ? 0 : -10,
        }}
        transition={{ duration: 0.2 }}
      >
        <div className="py-4 px-6 space-y-4">
          <Link
            href="/courses"
            className="block text-white py-2 hover:text-blue-300 transition font-medium border-b border-white/10 pb-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            Courses
          </Link>
          <Link
            href="/about"
            className="block text-white py-2 hover:text-blue-300 transition font-medium border-b border-white/10 pb-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            About
          </Link>
          <Link
            href="/blog"
            className="block text-white py-2 hover:text-blue-300 transition font-medium border-b border-white/10 pb-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            Blog
          </Link>
          <Link
            href="/contact"
            className="block text-white py-2 hover:text-blue-300 transition font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            Contact
          </Link>
          <div className="pt-2">
            <Link href="/staff/login" onClick={() => setMobileMenuOpen(false)}>
              <Button
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/10"
              >
                Staff Login
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
      {/* Hero Section with Animation */}
      <main className="flex-1">
        <section className="relative w-full py-20 md:py-36 lg:py-52 overflow-hidden bg-white text-gray-900">
          {/* Abstract shapes in background with adjusted colors for white bg */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-indigo-700 mix-blend-multiply blur-xl"></div>
            <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-blue-700 mix-blend-multiply blur-xl"></div>
            <div className="absolute top-40 right-40 w-40 h-40 rounded-full bg-purple-700 mix-blend-multiply blur-xl"></div>
          </div>

          <div className="container max-w-4xl mx-auto px-4 md:px-6 relative z-10">
            <motion.div
              className="text-center space-y-8"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <div className="group inline-block rounded-full border border-black/5 bg-neutral-100 text-base transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1.5 text-sm font-semibold">
                  <span>✨ Transform Your Career</span>
                  <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
                </AnimatedShinyText>
              </div>
              <motion.h1
                className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight text-gray-900"
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.7, ease: "easeOut" },
                  },
                }}
              >
                Learn. Build.{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  Succeed.
                </span>
              </motion.h1>
              <motion.p
                className="text-xl md:text-2xl text-gray-700 mx-auto max-w-3xl leading-relaxed"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { delay: 0.4, duration: 0.6 },
                  },
                }}
              >
                Our intensive bootcamps equip you with the skills, experience,
                and support needed to launch your career in tech.
              </motion.p>
              <motion.div
                className="flex flex-wrap justify-center gap-4 pt-4"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { delay: 0.6, duration: 0.6 },
                  },
                }}
              >
                <Link href="/courses">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 text-lg py-6 shadow-lg"
                  >
                    Explore Courses
                  </Button>
                </Link>
                <Link href="/about">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-600/10 hover:text-blue-700 text-lg py-6 shadow-lg"
                  >
                    Learn More
                  </Button>
                </Link>
              </motion.div>
              <motion.div
                className="mt-8 w-full"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { delay: 0.8, duration: 0.6 },
                  },
                }}
              >
                <div className="relative">
                  <HeroVideoDialog
                    className="block dark:hidden"
                    animationStyle="from-center"
                    videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
                    thumbnailSrc="https://startup-template-sage.vercel.app/hero-light.png"
                    thumbnailAlt="Learn about our bootcamp programs"
                  />
                  <HeroVideoDialog
                    className="hidden dark:block"
                    animationStyle="from-center"
                    videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
                    thumbnailSrc="https://startup-template-sage.vercel.app/hero-dark.png"
                    thumbnailAlt="Learn about our bootcamp programs"
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <motion.div
          className="mt-16 w-full"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { delay: 0.9, duration: 0.6 },
            },
          }}
        >
          <LogoTicker />
        </motion.div>

        {/* Replace the Problem Statement Cards section with this updated version */}
        <section className="bg-white py-16">
          <div className="container max-w-6xl mx-auto px-4 md:px-6">
            <motion.div
              className="text-center mb-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className="text-4xl font-bold mb-4">Challenges We Solve</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                We understand the barriers to entering the tech industry and
                have designed our programs to address them.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeIn} className="text-center px-4">
                <div className="flex justify-center mb-6 text-red-500">
                  <GraduationCap size={48} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">
                  Traditional Education Gap
                </h3>
                <p className="text-gray-600 text-lg">
                  University degrees often lag behind industry needs, leaving
                  graduates with outdated skills that don't match what employers
                  actually require.
                </p>
              </motion.div>

              <motion.div variants={fadeIn} className="text-center px-4">
                <div className="flex justify-center mb-6 text-amber-500">
                  <Ban size={48} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">
                  High Entry Barriers
                </h3>
                <p className="text-gray-600 text-lg">
                  Breaking into tech can feel impossible without the right
                  connections, portfolio, or experience—creating a catch-22 for
                  newcomers.
                </p>
              </motion.div>

              <motion.div variants={fadeIn} className="text-center px-4">
                <div className="flex justify-center mb-6 text-blue-500">
                  <Cpu size={48} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">
                  Rapid Technology Change
                </h3>
                <p className="text-gray-600 text-lg">
                  The tech landscape evolves so quickly that skills can become
                  outdated in months, making it hard to know what to learn and
                  where to start.
                </p>
              </motion.div>
            </motion.div>

            <motion.div
              className="mt-12 text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <Link href="/about">
                <Button
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-600/10 hover:text-blue-700 mt-6"
                >
                  How We Help <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Solutions Section with Bento Grid */}
        <section className="bg-white py-20 relative overflow-hidden">
          {/* Add the abstract background shapes */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-blue-700 mix-blend-multiply blur-xl"></div>
            <div className="absolute bottom-20 left-10 w-56 h-56 rounded-full bg-indigo-700 mix-blend-multiply blur-xl"></div>
          </div>

          <div className="container max-w-6xl mx-auto px-4 md:px-6 relative z-10">
            <motion.div
              className="text-center mb-14"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className="text-4xl font-bold mb-4">Our Solutions</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                We've designed our bootcamp program to directly address these
                industry challenges with innovative approaches.
              </p>
            </motion.div>

            <SolutionsBentoGrid />
          </div>
        </section>

        {/* How It Works Section - Auto-Advancing Carousel */}
        <section className="py-20 bg-white">
          <div className="container max-w-6xl mx-auto px-4 md:px-6">
            <motion.div
              className="text-center mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className="text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Our streamlined process takes you from application to career
                launch in three simple steps
              </p>
            </motion.div>

            <HowItWorksCarousel />
          </div>
        </section>

        {/* Testimonials Marquee Section */}
        <section className="py-20 bg-white relative overflow-hidden">
          {/* Add the abstract background shapes */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-40 left-20 w-72 h-72 rounded-full bg-purple-700 mix-blend-multiply blur-xl"></div>
            <div className="absolute bottom-10 right-20 w-64 h-64 rounded-full bg-blue-700 mix-blend-multiply blur-xl"></div>
          </div>

          <div className="container max-w-6xl mx-auto px-4 md:px-6 relative z-10">
            <motion.div
              className="text-center mb-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className="text-4xl font-bold mb-4">What Our Students Say</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Join thousands of satisfied students who have transformed their
                careers through our programs
              </p>
            </motion.div>

            <TestimonialsMarquee />
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white relative overflow-hidden">
          {/* Add the abstract background shapes */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 right-30 w-56 h-56 rounded-full bg-indigo-700 mix-blend-multiply blur-xl"></div>
            <div className="absolute bottom-40 left-30 w-72 h-72 rounded-full bg-blue-700 mix-blend-multiply blur-xl"></div>
          </div>

          <div className="container max-w-6xl mx-auto px-4 md:px-6 relative z-10">
            {" "}
            {/* Added max-width */}
            <motion.div
              className="text-center mb-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className="text-4xl font-bold mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Find answers to common questions about our bootcamps.
              </p>
            </motion.div>
            <div className="max-w-3xl mx-auto">
              {" "}
              {/* Already centered, but confirmed */}
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left font-medium text-lg py-5">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 text-base leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
      </main>

      {/* Footer with Background Style Similar to Hero */}
      <footer className="relative bg-white text-gray-900 py-20 overflow-hidden">
        {/* Abstract shapes in background with adjusted colors for white bg - similar to hero */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-indigo-700 mix-blend-multiply blur-xl"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-blue-700 mix-blend-multiply blur-xl"></div>
          <div className="absolute top-40 right-40 w-40 h-40 rounded-full bg-purple-700 mix-blend-multiply blur-xl"></div>
        </div>

        <div className="container max-w-6xl mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-5xl mx-auto">
            <div className="space-y-4">
              <Link href="/" className="flex items-center space-x-2">
                <School className="h-10 w-10 text-blue-600" />
                <span className="text-2xl font-bold text-blue-600">
                  Lewisham Tech
                </span>
              </Link>
              <p className="text-gray-600 text-base">
                Transforming careers through immersive technology education.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-500 hover:text-blue-600 transition p-2 bg-gray-100 rounded-full"
                  aria-label="Twitter"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-500 hover:text-blue-600 transition p-2 bg-gray-100 rounded-full"
                  aria-label="Instagram"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-500 hover:text-blue-600 transition p-2 bg-gray-100 rounded-full"
                  aria-label="LinkedIn"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-6">Programs</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="#"
                    className="text-gray-600 hover:text-blue-600 transition font-medium"
                  >
                    Web Development
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-600 hover:text-blue-600 transition font-medium"
                  >
                    Data Science
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-600 hover:text-blue-600 transition font-medium"
                  >
                    UX/UI Design
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-600 hover:text-blue-600 transition font-medium"
                  >
                    Cybersecurity
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-6">Company</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="#"
                    className="text-gray-600 hover:text-blue-600 transition font-medium"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-600 hover:text-blue-600 transition font-medium"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-600 hover:text-blue-600 transition font-medium"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-600 hover:text-blue-600 transition font-medium"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-6">Contact Us</h3>
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-start space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full mt-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <span className="text-base">
                    123 Tech Road, Lewisham, London
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full mt-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <span className="text-base">info@lewishamtech.com</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full mt-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <span className="text-base">+44 20 1234 5678</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-16 pt-8 text-center">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-600">
                © {new Date().getFullYear()} Lewisham Tech Bootcamp. All rights
                reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Link
                  href="#"
                  className="text-sm text-gray-500 hover:text-blue-600"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="#"
                  className="text-sm text-gray-500 hover:text-blue-600"
                >
                  Terms of Service
                </Link>
                <Link
                  href="#"
                  className="text-sm text-gray-500 hover:text-blue-600"
                >
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
