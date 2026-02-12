"use client"

import { useState } from "react"
import { CalendarDays, ChevronDown, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { type Priority, priorities } from "@/lib/list-storage"

interface CreateTodoFormProps {
  onSubmit: (title: string, dueDate: string | null, priority: Priority) => void
}

export function CreateTodoForm({ onSubmit }: CreateTodoFormProps) {
  const [title, setTitle] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [priority, setPriority] = useState<Priority>("None")
  const [expanded, setExpanded] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    onSubmit(trimmed, dueDate || null, priority)
    setTitle("")
    setDueDate("")
    setPriority("None")
    setExpanded(false)
  }

  return (
    <form onSubmit={handleSubmit} className="border-b p-4">
      <div className="flex gap-2">
        <Input
          placeholder="Add a todo..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" size="icon" disabled={!title.trim()}>
          <Plus className="h-4 w-4" />
          <span className="sr-only">Add todo</span>
        </Button>
      </div>

      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="mt-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronDown
          className={`h-3 w-3 transition-transform ${expanded ? "rotate-180" : ""}`}
        />
        {expanded ? "Hide options" : "Due date & priority"}
      </button>

      {expanded && (
        <div className="mt-2 flex flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="h-8 w-auto text-sm"
            />
            {dueDate && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs"
                onClick={() => setDueDate("")}
              >
                Clear
              </Button>
            )}
          </div>
          <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
            <SelectTrigger className="h-8 w-[130px] text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {priorities.map((p) => (
                <SelectItem key={p} value={p}>
                  {p === "None" ? "No priority" : p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </form>
  )
}
