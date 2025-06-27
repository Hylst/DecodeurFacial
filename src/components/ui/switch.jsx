import React from 'react'
import { cn } from '@/lib/utils'

/**
 * Switch component for toggle controls
 * @param {Object} props - Component props
 * @param {boolean} props.checked - Whether the switch is checked
 * @param {Function} props.onCheckedChange - Callback when checked state changes
 * @param {boolean} props.disabled - Whether the switch is disabled
 * @param {string} props.className - Additional CSS classes
 */
const Switch = React.forwardRef(({ 
  checked = false, 
  onCheckedChange, 
  disabled = false,
  className,
  ...props 
}, ref) => {
  const handleClick = () => {
    if (!disabled && onCheckedChange) {
      onCheckedChange(!checked)
    }
  }

  const handleKeyDown = (e) => {
    if ((e.key === ' ' || e.key === 'Enter') && !disabled) {
      e.preventDefault()
      if (onCheckedChange) {
        onCheckedChange(!checked)
      }
    }
  }

  return (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-primary" : "bg-input",
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  )
})

Switch.displayName = "Switch"

export { Switch }