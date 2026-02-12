"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { TodoList } from "@/lib/list-storage"

interface DeleteListDialogProps {
  list: TodoList | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (id: string) => void
}

export function DeleteListDialog({
  list,
  open,
  onOpenChange,
  onConfirm,
}: DeleteListDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete list</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete &ldquo;{list?.name}&rdquo; and all its
            todos. This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={() => list && onConfirm(list.id)}
          >
            Delete permanently
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
