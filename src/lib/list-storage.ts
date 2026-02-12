import { z } from "zod"

const LISTS_KEY = "todo-app-lists"
const SELECTED_LIST_KEY = "todo-app-selected-list"
const TODOS_KEY = "todo-app-todos"

const listSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  createdAt: z.string().datetime(),
})

const listsSchema = z.array(listSchema)

export type TodoList = z.infer<typeof listSchema>

export const priorities = ["None", "Low", "Medium", "High"] as const
export type Priority = (typeof priorities)[number]

const todoSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  listId: z.string().uuid(),
  createdAt: z.string().datetime(),
  dueDate: z.string().nullable(),
  priority: z.enum(priorities),
  completed: z.boolean(),
})

const todosSchema = z.array(todoSchema)

export type Todo = z.infer<typeof todoSchema>

export function loadLists(): TodoList[] {
  const raw = localStorage.getItem(LISTS_KEY)
  if (!raw) return []
  const parsed = JSON.parse(raw)
  return listsSchema.parse(parsed)
}

export function saveLists(lists: TodoList[]): void {
  localStorage.setItem(LISTS_KEY, JSON.stringify(lists))
}

export function loadSelectedListId(): string | null {
  return localStorage.getItem(SELECTED_LIST_KEY)
}

export function saveSelectedListId(id: string | null): void {
  if (id) {
    localStorage.setItem(SELECTED_LIST_KEY, id)
  } else {
    localStorage.removeItem(SELECTED_LIST_KEY)
  }
}

export function loadTodos(): Todo[] {
  const raw = localStorage.getItem(TODOS_KEY)
  if (!raw) return []
  const parsed = JSON.parse(raw)
  return todosSchema.parse(parsed)
}

export function saveTodos(todos: Todo[]): void {
  localStorage.setItem(TODOS_KEY, JSON.stringify(todos))
}

export function resetStorage(): void {
  localStorage.removeItem(LISTS_KEY)
  localStorage.removeItem(SELECTED_LIST_KEY)
  localStorage.removeItem(TODOS_KEY)
}
