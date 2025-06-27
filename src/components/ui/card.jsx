import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Card container component
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {React.Ref} ref - Card reference
 */
const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

/**
 * Card header component
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {React.Ref} ref - Header reference
 */
const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

/**
 * Card title component
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {React.Ref} ref - Title reference
 */
const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

/**
 * Card description component
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {React.Ref} ref - Description reference
 */
const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

/**
 * Card content component
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {React.Ref} ref - Content reference
 */
const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

/**
 * Card footer component
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {React.Ref} ref - Footer reference
 */
const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }