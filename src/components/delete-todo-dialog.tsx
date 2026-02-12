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
import type { Todo } from "@/lib/list-storage"

interface DeleteTodoDialogProps {
  todo: Todo | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (id: string) => void
}

export function DeleteTodoDialog({
  todo,
  open,
  onOpenChange,
  onConfirm,
}: DeleteTodoDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete todo</AlertDialogTitle>
          <AlertDialogDescription>
            Delete &ldquo;{todo?.title}&rdquo;? This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={() => todo && onConfirm(todo.id)}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
