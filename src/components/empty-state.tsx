"use client"

import { useState } from "react"
import { ClipboardList } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface EmptyStateProps {
  onCreateList: (name: string) => void
}

export function EmptyState({ onCreateList }: EmptyStateProps) {
  const [name, setName] = useState("")
  const [showInput, setShowInput] = useState(false)

  function handleCreate() {
    const trimmed = name.trim()
    if (!trimmed) return
    onCreateList(trimmed)
    setName("")
    setShowInput(false)
  }

  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="flex flex-col items-center gap-4 max-w-sm text-center">
        <div className="rounded-full bg-muted p-4">
          <ClipboardList className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold">No lists yet</h2>
        <p className="text-muted-foreground">
          Create your first list to start organizing your todos.
        </p>
        {showInput ? (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleCreate()
            }}
            className="flex w-full gap-2"
          >
            <Input
              autoFocus
              placeholder="List name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setShowInput(false)
                  setName("")
                }
              }}
            />
            <Button type="submit" disabled={!name.trim()}>
              Create
            </Button>
          </form>
        ) : (
          <Button size="lg" onClick={() => setShowInput(true)}>
            Create your first list
          </Button>
        )}
      </div>
    </div>
  )
}
