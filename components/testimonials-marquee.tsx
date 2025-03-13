"use client";

import { cn } from "@/lib/utils";

import { UserCircle } from "lucide-react";
import { Marquee } from "./magicui/marquee";

const reviews = [
  {
    name: "Sarah Thompson",
    role: "Web Developer at Shopify",
    body: "The bootcamp curriculum was incredibly relevant to what employers are actually looking for. I landed a job within 6 weeks of graduation!",
    img: "https://avatar.vercel.sh/saraht",
  },
  {
    name: "Michael Chen",
    role: "Frontend Engineer at Meta",
    body: "The project-based approach gave me an amazing portfolio that helped me stand out in interviews. Best career decision I've made.",
    img: "https://avatar.vercel.sh/michaelc",
  },
  {
    name: "Priya Patel",
    role: "Data Scientist at Microsoft",
    body: "The instructors were industry pros who taught us not just theory but real workplace applications. Worth every penny.",
    img: "https://avatar.vercel.sh/priyap",
  },
  {
    name: "James Wilson",
    role: "UX Designer at Adobe",
    body: "I switched careers from marketing to tech in just 4 months. The career support team was instrumental in my job search.",
    img: "https://avatar.vercel.sh/jamesw",
  },
  {
    name: "Olivia Martinez",
    role: "Software Engineer at Google",
    body: "The community aspect was just as valuable as the technical training. I still connect with my cohort peers regularly.",
    img: "https://avatar.vercel.sh/oliviam",
  },
  {
    name: "David Kim",
    role: "Full-Stack Developer at Stripe",
    body: "Coming from a non-technical background, I was worried about keeping up. The instructors were so supportive throughout the learning journey.",
    img: "https://avatar.vercel.sh/davidk",
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  img,
  name,
  role,
  body,
}: {
  img: string;
  name: string;
  role: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative h-full w-80 cursor-pointer overflow-hidden rounded-xl border p-6",
        // light styles
        "border-blue-500/20 bg-white shadow-sm hover:shadow-md transition-shadow",
        // dark styles
        "dark:border-blue-500/30 dark:bg-gray-800/90"
      )}
    >
      <div className="flex flex-row items-center gap-3 mb-3">
        <div className="h-12 w-12 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center">
          {img ? (
            <img
              className="object-cover w-full h-full"
              width="48"
              height="48"
              alt={name}
              src={img}
            />
          ) : (
            <UserCircle className="h-8 w-8 text-blue-600" />
          )}
        </div>
        <div className="flex flex-col">
          <figcaption className="text-base font-medium">{name}</figcaption>
          <p className="text-xs text-gray-500">{role}</p>
        </div>
      </div>
      <div className="text-yellow-400 flex mb-2">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        ))}
      </div>
      <blockquote className="mt-2 text-sm text-gray-600 dark:text-gray-300">
        "{body}"
      </blockquote>
    </figure>
  );
};

export default function TestimonialsMarquee() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden py-4">
      <Marquee pauseOnHover className="[--duration:35s] mb-8">
        {firstRow.map((review) => (
          <ReviewCard key={review.name} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:30s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.name} {...review} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-gray-50 dark:from-gray-900"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-gray-50 dark:from-gray-900"></div>
    </div>
  );
}
