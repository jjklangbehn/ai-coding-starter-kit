"use client"

import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import {
  type Todo,
  type Priority,
  loadTodos,
  saveTodos,
} from "@/lib/list-storage"

export function useTodoStore() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    try {
      setTodos(loadTodos())
    } catch {
      // Storage error is already handled by useListStore
    }
    setInitialized(true)
  }, [])

  const persist = useCallback((updated: Todo[]) => {
    try {
      saveTodos(updated)
    } catch {
      toast.error("Failed to save todo. Storage might be full.")
      throw new Error("storage_error")
    }
  }, [])

  const createTodo = useCallback(
    (listId: string, title: string, dueDate: string | null, priority: Priority) => {
      const newTodo: Todo = {
        id: crypto.randomUUID(),
        title: title.trim(),
        listId,
        createdAt: new Date().toISOString(),
        dueDate,
        priority,
        completed: false,
      }
      const updated = [...todos, newTodo]
      persist(updated)
      setTodos(updated)
      toast.success("Todo added")
      return newTodo
    },
    [todos, persist]
  )

  const getTodosForList = useCallback(
    (listId: string) => todos.filter((t) => t.listId === listId),
    [todos]
  )

  const updateTodo = useCallback(
    (id: string, changes: Partial<Pick<Todo, "title" | "dueDate" | "priority" | "completed">>) => {
      const updated = todos.map((t) =>
        t.id === id ? { ...t, ...changes, title: changes.title !== undefined ? changes.title.trim() : t.title } : t
      )
      persist(updated)
      setTodos(updated)
    },
    [todos, persist]
  )

  const deleteTodo = useCallback(
    (id: string) => {
      const updated = todos.filter((t) => t.id !== id)
      persist(updated)
      setTodos(updated)
      toast.success("Todo deleted")
    },
    [todos, persist]
  )

  const deleteTodosForList = useCallback(
    (listId: string) => {
      const updated = todos.filter((t) => t.listId !== listId)
      setTodos(updated)
      persist(updated)
    },
    [todos, persist]
  )

  return {
    todos,
    initialized,
    createTodo,
    updateTodo,
    deleteTodo,
    getTodosForList,
    deleteTodosForList,
  }
}
