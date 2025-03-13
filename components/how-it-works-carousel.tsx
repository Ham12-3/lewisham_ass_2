"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardCheck, Code, BriefcaseBusiness } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Apply & Prepare",
    icon: ClipboardCheck,
    description:
      "Complete our straightforward application process and get access to prep materials to ensure you're ready for day one.",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    id: 2,
    title: "Learn & Build",
    icon: Code,
    description:
      "Dive into immersive, project-based learning with industry experts and build a professional portfolio of work.",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    id: 3,
    title: "Connect & Launch",
    icon: BriefcaseBusiness,
    description:
      "Graduate with career support, connect with hiring partners, and launch your new tech career with confidence.",
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
];

export default function HowItWorksCarousel() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prevStep) => (prevStep + 1) % steps.length);
    }, 5000); // Change step every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Get the current step icon component
  const StepIcon = steps[currentStep].icon;

  return (
    <div className="relative max-w-3xl mx-auto px-4">
      <div className="flex justify-center mb-8">
        <div className="flex items-center">
          {steps.map((step, idx) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  idx <= currentStep
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                } transition-colors duration-500`}
              >
                {step.id}
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`w-20 h-1 ${
                    idx < currentStep ? "bg-blue-600" : "bg-gray-200"
                  } transition-colors duration-500`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="relative h-80 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
          >
            <div
              className={`w-24 h-24 ${steps[currentStep].bgColor} rounded-full flex items-center justify-center mb-6`}
            >
              {/* Fix: Correctly render the icon component */}
              <StepIcon className={`h-12 w-12 ${steps[currentStep].color}`} />
            </div>
            <h3 className="text-2xl font-bold mb-4">
              {steps[currentStep].title}
            </h3>
            <p className="text-gray-600 text-lg max-w-lg">
              {steps[currentStep].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center mt-6">
        {steps.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentStep(idx)}
            className={`w-3 h-3 mx-1 rounded-full transition-colors duration-300 ${
              idx === currentStep ? "bg-blue-600" : "bg-gray-300"
            }`}
            aria-label={`Go to step ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
