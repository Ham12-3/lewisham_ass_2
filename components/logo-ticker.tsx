"use client";

import Image from "next/image";

// Company logo imports
import googleLogo from "../public/logos/google.svg";
import metaLogo from "../public/logos/meta.svg";
import airbnbLogo from "../public/logos/airbnb.svg";
import uberLogo from "../public/logos/uber.svg";
import awsLogo from "../public/logos/aws.svg";
import microsoftLogo from "../public/logos/microsoft.svg";
import spotifyLogo from "../public/logos/spotify.svg";
import slackLogo from "../public/logos/slack.svg";

const logos = [
  { name: "Google", image: googleLogo },
  { name: "Meta", image: metaLogo },
  { name: "Airbnb", image: airbnbLogo },
  { name: "Uber", image: uberLogo },
  { name: "AWS", image: awsLogo },
  { name: "Microsoft", image: microsoftLogo },
  { name: "Spotify", image: spotifyLogo },
  { name: "Slack", image: slackLogo },
  // Duplicate for seamless looping
  { name: "Google-2", image: googleLogo },
  { name: "Meta-2", image: metaLogo },
  { name: "Airbnb-2", image: airbnbLogo },
  { name: "Uber-2", image: uberLogo },
];

export default function LogoTicker() {
  return (
    <section className="py-12 overflow-x-clip">
      <div className="container max-w-4xl mx-auto">
        <h3 className="text-center text-gray-500 font-medium uppercase tracking-wider text-sm">
          Trusted by companies worldwide
        </h3>
        <div className="overflow-hidden mt-8 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex gap-12 animate-marquee">
            {logos.map((logo) => (
              <div
                key={logo.name}
                className="flex items-center justify-center w-60 h-32" // Increased from w-40 h-20
              >
                <Image
                  src={logo.image}
                  alt={logo.name}
                  className="w-60 h-32 object-contain grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-300" // Increased from w-40 h-20
                  width={1500}
                  height={1500} // Increased from 1000x1000
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
