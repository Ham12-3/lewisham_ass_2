"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import Image from "next/image";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface HeroVideoDialogProps {
  className?: string;
  animationStyle?:
    | "from-top"
    | "from-bottom"
    | "from-left"
    | "from-right"
    | "from-center"
    | "fade";
  videoSrc: string;
  thumbnailSrc: string;
  thumbnailAlt: string;
  dialogTitle?: string;
}

export default function HeroVideoDialog({
  className,
  animationStyle = "from-center",
  videoSrc,
  thumbnailSrc,
  thumbnailAlt,
  dialogTitle = "Bootcamp Introduction Video",
}: HeroVideoDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("w-full max-w-3xl mx-auto mt-8", className)}>
      <div
        className="relative group rounded-2xl overflow-hidden shadow-xl cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <div className="aspect-w-16 aspect-h-9 relative">
          <Image
            src={thumbnailSrc}
            alt={thumbnailAlt}
            width={1200}
            height={675}
            className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors duration-300">
          <Button
            size="lg"
            variant="secondary"
            className="bg-white/90 backdrop-blur text-black hover:bg-white flex items-center gap-2 rounded-full py-6 px-8"
          >
            <Play className="h-6 w-6 fill-current" />
            <span className="font-medium">Watch Video</span>
          </Button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl w-full p-0 bg-transparent border-none">
          <DialogTitle className="sr-only">{dialogTitle}</DialogTitle>
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              src={open ? videoSrc : ""}
              className="w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={dialogTitle}
            ></iframe>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
