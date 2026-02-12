"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { TodoList } from "@/lib/list-storage"

interface RenameListDialogProps {
  list: TodoList | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (id: string, newName: string) => void
}

export function RenameListDialog({
  list,
  open,
  onOpenChange,
  onConfirm,
}: RenameListDialogProps) {
  const [name, setName] = useState("")

  useEffect(() => {
    if (list && open) {
      setName(list.name)
    }
  }, [list, open])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed || !list) return
    onConfirm(list.id, trimmed)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename list</DialogTitle>
          <DialogDescription>
            Enter a new name for this list.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="py-4">
            <Label htmlFor="list-name" className="sr-only">
              List name
            </Label>
            <Input
              id="list-name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="List name..."
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
