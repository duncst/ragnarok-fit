
import * as React from "react"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { exercises } from "@/data/exercises"

interface ExerciseSelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export function ExerciseSelector({ value, onChange, placeholder }: ExerciseSelectorProps) {
  const [open, setOpen] = React.useState(false)

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      // The `value` is already updated via onValueChange, so we just need to close.
      setOpen(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-start text-lg font-semibold border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto hover:bg-transparent text-left"
        >
          {value || <span className="text-muted-foreground font-normal">{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command>
          <CommandInput 
            placeholder="Search or add exercise..." 
            value={value} 
            onValueChange={onChange}
            onKeyDown={handleKeyDown}
          />
          <CommandList>
            <CommandEmpty>No exercise found. Press Enter to add.</CommandEmpty>
            <CommandGroup>
              {exercises.map((exercise) => (
                <CommandItem
                  key={exercise.name}
                  value={exercise.name}
                  onSelect={(currentValue) => {
                    const selected = exercises.find(e => e.name.toLowerCase() === currentValue.toLowerCase());
                    onChange(selected ? selected.name : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value && value.toLowerCase() === exercise.name.toLowerCase() ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {exercise.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
