/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ElementRendererProps {
  element: any;
  isPreviewMode: boolean;
  isSelected: boolean;
}

export function ElementRenderer({
  element,
  isPreviewMode,
  isSelected,
}: ElementRendererProps) {
  const { type, properties } = element;

  // Common style properties
  const style = {
    color: properties.color,
    backgroundColor: properties.backgroundColor,
    fontSize: properties.fontSize,
    padding: properties.padding,
    borderRadius: properties.borderRadius,
    fontWeight: properties.fontWeight,
    textAlign: properties.textAlign,
    ...(properties.customCss && { ...parseCustomCss(properties.customCss) }),
  };

  // Common props
  const commonProps = {
    id: properties.id,
    className: cn(
      properties.className,
      isSelected &&
        !isPreviewMode &&
        "outline-dashed outline-2 outline-violet-500 dark:outline-violet-400"
    ),
    style,
  };

  // Animation variants
  const getAnimationProps = () => {
    if (
      !properties.animation ||
      properties.animation === "none" ||
      !isPreviewMode
    ) {
      return {};
    }

    const variants = {
      fade: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.5 },
      },
      slide: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
      },
      bounce: {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        transition: { type: "spring", stiffness: 300, damping: 10 },
      },
      pulse: {
        animate: {
          scale: [1, 1.05, 1],
          transition: {
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            duration: 1.5,
          },
        },
      },
    };

    return variants[properties.animation as keyof typeof variants] || {};
  };

  const animationProps = getAnimationProps();
  const Component =
    isPreviewMode && properties.animation && properties.animation !== "none"
      ? motion.div
      : "div";

  // Render based on element type
  switch (type) {
    case "text":
      return (
        <Component {...commonProps} {...animationProps}>
          {properties.text || "Text content"}
        </Component>
      );

    case "heading1":
      return (
        <Component {...commonProps} {...animationProps}>
          <h1 className="text-3xl md:text-4xl font-bold">
            {properties.text || "Heading 1"}
          </h1>
        </Component>
      );

    case "heading2":
      return (
        <Component {...commonProps} {...animationProps}>
          <h2 className="text-2xl md:text-3xl font-semibold">
            {properties.text || "Heading 2"}
          </h2>
        </Component>
      );

    case "button":
      return (
        <Component {...animationProps}>
          <Button
            {...commonProps}
            variant={properties.variant || "default"}
            asChild={isPreviewMode}
            className={cn(
              "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 border-0",
              commonProps.className
            )}
          >
            {isPreviewMode ? (
              <a href={properties.url || "#"}>{properties.text || "Button"}</a>
            ) : (
              <span>{properties.text || "Button"}</span>
            )}
          </Button>
        </Component>
      );

    case "image":
      return (
        <Component
          {...commonProps}
          {...animationProps}
          className={cn("relative w-full h-full", commonProps.className)}
        >
          <img
            loading="lazy"
            src={properties.src || "/placeholder.svg?height=200&width=400"}
            alt={properties.alt || "Image"}
            className="object-contain absolute inset-0 w-full h-full"
          />
        </Component>
      );

    case "container":
      return (
        <Component
          {...commonProps}
          {...animationProps}
          className={cn(
            "w-full h-full border border-dashed border-border bg-muted/50 rounded-lg",
            commonProps.className
          )}
        >
          {properties.content || "Container"}
        </Component>
      );

    case "columns":
      return (
        <Component
          {...commonProps}
          {...animationProps}
          className={cn(
            "w-full h-full grid grid-cols-2 gap-4",
            commonProps.className
          )}
        >
          <div className="border border-dashed border-border bg-muted/50 rounded-lg p-4">
            Column 1
          </div>
          <div className="border border-dashed border-border bg-muted/50 rounded-lg p-4">
            Column 2
          </div>
        </Component>
      );

    case "link":
      return (
        <Component {...animationProps}>
          {isPreviewMode ? (
            <a
              href={properties.url || "#"}
              {...commonProps}
              className={cn(
                "text-violet-600 hover:underline",
                commonProps.className
              )}
            >
              {properties.text || "Link"}
            </a>
          ) : (
            <span
              {...commonProps}
              className={cn(
                "text-violet-600 cursor-pointer",
                commonProps.className
              )}
            >
              {properties.text || "Link"}
            </span>
          )}
        </Component>
      );

    case "list": {
      const items = (properties.items || "Item 1\nItem 2\nItem 3")
        .split("\n")
        .filter(Boolean);
      const ListType = properties.listType === "ol" ? "ol" : "ul";

      return (
        <Component {...commonProps} {...animationProps}>
          <ListType
            className={
              properties.listType === "ol"
                ? "list-decimal pl-5"
                : "list-disc pl-5"
            }
          >
            {items.map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ListType>
        </Component>
      );
    }

    case "form":
      return (
        <Component
          {...commonProps}
          {...animationProps}
          className={cn(
            "p-4 border border-border rounded-lg",
            commonProps.className
          )}
        >
          <h3 className="text-lg font-medium mb-4">
            {properties.formTitle || "Contact Form"}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                className="w-full p-2 border border-border rounded-md bg-background"
                placeholder="Your name"
                disabled={!isPreviewMode}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                className="w-full p-2 border border-border rounded-md bg-background"
                placeholder="Your email"
                disabled={!isPreviewMode}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                className="w-full p-2 border border-border rounded-md bg-background"
                rows={4}
                placeholder="Your message"
                disabled={!isPreviewMode}
              ></textarea>
            </div>
            <Button className="w-full" disabled={!isPreviewMode}>
              {properties.submitText || "Submit"}
            </Button>
          </div>
        </Component>
      );

    case "video":
      return (
        <Component
          {...commonProps}
          {...animationProps}
          className={cn(
            "aspect-video bg-muted rounded-lg overflow-hidden",
            commonProps.className
          )}
        >
          {isPreviewMode ? (
            <iframe
              src={formatVideoUrl(
                properties.videoUrl ||
                  "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              )}
              className="w-full h-full"
              allowFullScreen
              title="Video"
            ></iframe>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16 12L10 16.5V7.5L16 12Z"
                      fill="currentColor"
                      className="text-violet-600 dark:text-violet-400"
                    />
                  </svg>
                </div>
                <p className="text-sm text-muted-foreground">
                  Video will appear here in preview mode
                </p>
              </div>
            </div>
          )}
        </Component>
      );

    case "map":
      return (
        <Component
          {...commonProps}
          {...animationProps}
          className={cn(
            "aspect-video bg-muted rounded-lg overflow-hidden",
            commonProps.className
          )}
        >
          {isPreviewMode ? (
            <iframe
              src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(
                properties.location || "New York, NY"
              )}&zoom=${properties.zoom || 10}`}
              className="w-full h-full"
              allowFullScreen
              title="Map"
            ></iframe>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 13C13.1046 13 14 12.1046 14 11C14 9.89543 13.1046 9 12 9C10.8954 9 10 9.89543 10 11C10 12.1046 10.8954 13 12 13Z"
                      fill="currentColor"
                      className="text-violet-600 dark:text-violet-400"
                    />
                    <path
                      d="M12 2C7.58172 2 4 5.58172 4 10C4 11.8487 4.63146 13.551 5.69891 14.9056L12 22L18.3011 14.9056C19.3685 13.551 20 11.8487 20 10C20 5.58172 16.4183 2 12 2ZM12 15C9.79086 15 8 13.2091 8 11C8 8.79086 9.79086 7 12 7C14.2091 7 16 8.79086 16 11C16 13.2091 14.2091 15 12 15Z"
                      fill="currentColor"
                      className="text-violet-600 dark:text-violet-400"
                    />
                  </svg>
                </div>
                <p className="text-sm text-muted-foreground">
                  Map will appear here in preview mode
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {properties.location || "New York, NY"}
                </p>
              </div>
            </div>
          )}
        </Component>
      );

    default:
      return <div>Unknown element type: {type}</div>;
  }
}

// Helper to parse custom CSS string into object
function parseCustomCss(cssString: string): Record<string, string> {
  if (!cssString) return {};

  const result: Record<string, string> = {};
  const declarations = cssString.split(";");

  declarations.forEach((declaration) => {
    const [property, value] = declaration.split(":").map((str) => str.trim());
    if (property && value) {
      // Convert kebab-case to camelCase
      const camelProperty = property.replace(/-([a-z])/g, (_, letter) =>
        letter.toUpperCase()
      );
      result[camelProperty] = value;
    }
  });

  return result;
}

// Helper to format video URLs for embedding
function formatVideoUrl(url: string): string {
  if (url.includes("youtube.com/watch")) {
    const videoId = new URL(url).searchParams.get("v");
    return `https://www.youtube.com/embed/${videoId}`;
  } else if (url.includes("youtu.be")) {
    const videoId = url.split("/").pop();
    return `https://www.youtube.com/embed/${videoId}`;
  } else if (url.includes("vimeo.com")) {
    const videoId = url.split("/").pop();
    return `https://player.vimeo.com/video/${videoId}`;
  }
  return url;
}
