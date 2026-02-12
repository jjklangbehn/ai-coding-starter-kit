"use client"

import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import {
  type TodoList,
  loadLists,
  loadSelectedListId,
  saveLists,
  saveSelectedListId,
  resetStorage,
} from "@/lib/list-storage"

export function useListStore() {
  const [lists, setLists] = useState<TodoList[]>([])
  const [selectedListId, setSelectedListId] = useState<string | null>(null)
  const [storageError, setStorageError] = useState(false)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    try {
      const loaded = loadLists()
      const savedSelectedId = loadSelectedListId()
      setLists(loaded)
      if (savedSelectedId && loaded.some((l) => l.id === savedSelectedId)) {
        setSelectedListId(savedSelectedId)
      } else if (loaded.length > 0) {
        setSelectedListId(loaded[0].id)
      }
    } catch {
      setStorageError(true)
    }
    setInitialized(true)
  }, [])

  const persist = useCallback(
    (updatedLists: TodoList[], updatedSelectedId: string | null) => {
      try {
        saveLists(updatedLists)
        saveSelectedListId(updatedSelectedId)
      } catch {
        toast.error("Failed to save data. Storage might be full.")
      }
    },
    []
  )

  const createList = useCallback(
    (name: string) => {
      const newList: TodoList = {
        id: crypto.randomUUID(),
        name: name.trim(),
        createdAt: new Date().toISOString(),
      }
      const updated = [...lists, newList]
      setLists(updated)
      setSelectedListId(newList.id)
      persist(updated, newList.id)
      toast.success("List created")
      return newList
    },
    [lists, persist]
  )

  const renameList = useCallback(
    (id: string, newName: string) => {
      const updated = lists.map((l) =>
        l.id === id ? { ...l, name: newName.trim() } : l
      )
      setLists(updated)
      persist(updated, selectedListId)
      toast.success("List renamed")
    },
    [lists, selectedListId, persist]
  )

  const deleteList = useCallback(
    (id: string) => {
      const updated = lists.filter((l) => l.id !== id)
      setLists(updated)

      let newSelectedId: string | null = null
      if (selectedListId === id) {
        newSelectedId = updated.length > 0 ? updated[0].id : null
      } else {
        newSelectedId = selectedListId
      }
      setSelectedListId(newSelectedId)
      persist(updated, newSelectedId)
      toast.success("List deleted")
    },
    [lists, selectedListId, persist]
  )

  const selectList = useCallback(
    (id: string) => {
      setSelectedListId(id)
      saveSelectedListId(id)
    },
    []
  )

  const handleReset = useCallback(() => {
    resetStorage()
    setLists([])
    setSelectedListId(null)
    setStorageError(false)
  }, [])

  const selectedList = lists.find((l) => l.id === selectedListId) ?? null

  return {
    lists,
    selectedList,
    selectedListId,
    storageError,
    initialized,
    createList,
    renameList,
    deleteList,
    selectList,
    handleReset,
  }
}
