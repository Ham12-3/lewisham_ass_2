"use client";

import {
  BookOpenIcon,
  GraduationCapIcon,
  BriefcaseIcon,
  CodeIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { DotPattern } from "./magicui/dot-pattern";
import { Marquee } from "./magicui/marquee";
import { BentoCard, BentoGrid } from "./magicui/bento-grid";

const skills = [
  "React",
  "Node.js",
  "TypeScript",
  "Python",
  "Data Structures",
  "Algorithms",
  "REST APIs",
  "Git",
  "CI/CD",
  "Cloud Computing",
  "Database Design",
  "UI/UX",
  "Agile Methodology",
  "Testing",
];

const projects = [
  {
    name: "E-Commerce Platform",
    description: "Built with React and Node.js with full payment integration",
  },
  {
    name: "Data Visualization Dashboard",
    description: "Interactive charts and real-time data processing",
  },
  {
    name: "Mobile Fitness App",
    description: "React Native app with health tracking features",
  },
  {
    name: "Content Management System",
    description: "Custom CMS with role-based permissions",
  },
];

const solutions = [
  {
    Icon: BookOpenIcon,
    name: "Industry-Focused Curriculum",
    description:
      "Our curriculum is developed with top tech companies to teach exactly what employers need today.",
    href: "/courses",
    cta: "View Curriculum",
    className: "col-span-3 lg:col-span-2",
    background: (
      <>
        <DotPattern
          className="opacity-50 [mask-image:radial-gradient(600px_circle_at_center,white,transparent)]"
          dotClassName="bg-blue-500/30"
        />
        <Marquee
          pauseOnHover
          className="absolute top-8 [--duration:20s] [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)]"
        >
          {skills.map((skill, idx) => (
            <div
              key={idx}
              className={cn(
                "relative mx-2 w-auto cursor-pointer overflow-hidden rounded-xl border p-3",
                "border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10",
                "transform-gpu transition-all duration-300 ease-out"
              )}
            >
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                {skill}
              </span>
            </div>
          ))}
        </Marquee>
      </>
    ),
  },
  {
    Icon: CodeIcon,
    name: "Project-Based Learning",
    description:
      "Build real-world projects that become your portfolio, eliminating the catch-22 of needing experience.",
    href: "/projects",
    cta: "See Student Projects",
    className: "col-span-3 lg:col-span-1",
    background: (
      <div className="absolute right-0 top-8 h-[250px] w-full overflow-hidden [mask-image:linear-gradient(to_top,transparent_30%,#000_100%)]">
        {projects.map((project, idx) => (
          <div
            key={idx}
            className="mb-3 rounded-lg border border-gray-200 p-3 transform transition-transform hover:scale-105"
          >
            <h4 className="font-medium text-sm">{project.name}</h4>
            <p className="text-xs text-gray-500 mt-1">{project.description}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    Icon: BriefcaseIcon,
    name: "Career Acceleration",
    description:
      "Get connected directly to our hiring partners who are actively recruiting junior developers.",
    href: "/careers",
    cta: "Career Support",
    className: "col-span-3 lg:col-span-1",
    background: (
      <>
        <DotPattern
          className="opacity-30 [mask-image:radial-gradient(400px_circle_at_bottom_right,white,transparent)]"
          dotClassName="bg-indigo-500/40"
          dotSpacing={15}
        />
        <div className="absolute right-0 top-8 w-full text-center [mask-image:linear-gradient(to_top,transparent_20%,#000_100%)]">
          <div className="mb-4 text-4xl font-bold text-blue-600">94%</div>
          <p className="text-sm text-gray-600 mx-4">
            of our graduates find employment within 3 months
          </p>
          <div className="mt-8 flex justify-center">
            <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1.5 text-xs font-semibold border rounded-full">
              <span>Job-Ready Guarantee</span>
            </AnimatedShinyText>
          </div>
        </div>
      </>
    ),
  },
  {
    Icon: GraduationCapIcon,
    name: "Ongoing Learning Support",
    description:
      "Tech is always changing. Our alumni get lifetime access to updated course materials and our community.",
    href: "/community",
    cta: "Join Community",
    className: "col-span-3 lg:col-span-2",
    background: (
      <>
        <DotPattern
          className="opacity-40 [mask-image:radial-gradient(500px_circle_at_top_left,white,transparent)]"
          dotClassName="bg-green-500/40"
          dotSpacing={18}
        />
        <div className="absolute right-4 top-8 h-[200px] w-5/6 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 [mask-image:linear-gradient(to_top,transparent_20%,#000_90%)]">
          <div className="p-4">
            <div className="mb-3 flex items-center">
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-lg font-bold">
                A
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium">Alumni Network</div>
                <div className="text-xs text-gray-500">5,000+ members</div>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-2">
              {[
                "Webinars",
                "Mentorship",
                "Job Board",
                "Events",
                "Resources",
                "Updates",
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="text-xs bg-white border border-gray-200 rounded px-2 py-1 text-center"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    ),
  },
];

export default function SolutionsBentoGrid() {
  return (
    <BentoGrid>
      {solutions.map((solution, idx) => (
        <BentoCard key={idx} {...solution} />
      ))}
    </BentoGrid>
  );
}
