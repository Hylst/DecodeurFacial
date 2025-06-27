import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

/**
 * Slider component for range input controls
 * @param {Object} props - Component props
 * @param {number[]} props.value - Current value(s) as array
 * @param {Function} props.onValueChange - Callback when value changes
 * @param {number} props.min - Minimum value
 * @param {number} props.max - Maximum value
 * @param {number} props.step - Step increment
 * @param {boolean} props.disabled - Whether the slider is disabled
 * @param {string} props.className - Additional CSS classes
 */
const Slider = React.forwardRef(({ 
  value = [0], 
  onValueChange, 
  min = 0, 
  max = 100, 
  step = 1,
  disabled = false,
  className,
  ...props 
}, ref) => {
  const [isDragging, setIsDragging] = useState(false)
  const sliderRef = useRef(null)
  const currentValue = value[0] || 0
  
  /**
   * Calculate value from mouse/touch position
   * @param {number} clientX - X coordinate of pointer
   */
  const getValueFromPosition = (clientX) => {
    if (!sliderRef.current) return currentValue
    
    const rect = sliderRef.current.getBoundingClientRect()
    const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    const rawValue = min + percentage * (max - min)
    
    // Round to nearest step
    const steppedValue = Math.round(rawValue / step) * step
    return Math.max(min, Math.min(max, steppedValue))
  }
  
  /**
   * Handle pointer down events
   * @param {Event} e - Pointer event
   */
  const handlePointerDown = (e) => {
    if (disabled) return
    
    setIsDragging(true)
    const newValue = getValueFromPosition(e.clientX)
    
    if (onValueChange) {
      onValueChange([newValue])
    }
    
    e.preventDefault()
  }
  
  /**
   * Handle pointer move events
   * @param {Event} e - Pointer event
   */
  const handlePointerMove = (e) => {
    if (!isDragging || disabled) return
    
    const newValue = getValueFromPosition(e.clientX)
    
    if (onValueChange) {
      onValueChange([newValue])
    }
  }
  
  /**
   * Handle pointer up events
   */
  const handlePointerUp = () => {
    setIsDragging(false)
  }
  
  /**
   * Handle keyboard navigation
   * @param {KeyboardEvent} e - Keyboard event
   */
  const handleKeyDown = (e) => {
    if (disabled) return
    
    let newValue = currentValue
    
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        newValue = Math.min(max, currentValue + step)
        break
      case 'ArrowLeft':
      case 'ArrowDown':
        newValue = Math.max(min, currentValue - step)
        break
      case 'Home':
        newValue = min
        break
      case 'End':
        newValue = max
        break
      case 'PageUp':
        newValue = Math.min(max, currentValue + step * 10)
        break
      case 'PageDown':
        newValue = Math.max(min, currentValue - step * 10)
        break
      default:
        return
    }
    
    e.preventDefault()
    
    if (onValueChange) {
      onValueChange([newValue])
    }
  }
  
  // Add global event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      const handleGlobalPointerMove = (e) => handlePointerMove(e)
      const handleGlobalPointerUp = () => handlePointerUp()
      
      document.addEventListener('pointermove', handleGlobalPointerMove)
      document.addEventListener('pointerup', handleGlobalPointerUp)
      
      return () => {
        document.removeEventListener('pointermove', handleGlobalPointerMove)
        document.removeEventListener('pointerup', handleGlobalPointerUp)
      }
    }
  }, [isDragging])
  
  // Calculate percentage for positioning
  const percentage = ((currentValue - min) / (max - min)) * 100
  
  return (
    <div
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      {...props}
    >
      {/* Track */}
      <div
        ref={sliderRef}
        className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary cursor-pointer"
        onPointerDown={handlePointerDown}
      >
        {/* Range */}
        <div 
          className="absolute h-full bg-primary transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {/* Thumb */}
      <div
        className={cn(
          "absolute block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          disabled ? "cursor-not-allowed" : "cursor-grab",
          isDragging && "cursor-grabbing scale-110"
        )}
        style={{ left: `calc(${percentage}% - 10px)` }}
        tabIndex={disabled ? -1 : 0}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={currentValue}
        aria-disabled={disabled}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
      />
    </div>
  )
})

Slider.displayName = "Slider"

export { Slider }