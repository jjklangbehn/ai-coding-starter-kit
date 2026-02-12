"use client"

import { useState } from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { ListSidebar } from "@/components/list-sidebar"
import { EmptyState } from "@/components/empty-state"
import { ListContent } from "@/components/list-content"
import { DeleteListDialog } from "@/components/delete-list-dialog"
import { RenameListDialog } from "@/components/rename-list-dialog"
import { StorageError } from "@/components/storage-error"
import { useListStore } from "@/hooks/use-list-store"
import { useTodoStore } from "@/hooks/use-todo-store"
import type { TodoList } from "@/lib/list-storage"

export default function AppPage() {
  const {
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
  } = useListStore()

  const { createTodo, updateTodo, deleteTodo, getTodosForList, deleteTodosForList } = useTodoStore()

  const [listToDelete, setListToDelete] = useState<TodoList | null>(null)
  const [listToRename, setListToRename] = useState<TodoList | null>(null)

  if (!initialized) {
    return null
  }

  if (storageError) {
    return <StorageError onReset={handleReset} />
  }

  return (
    <SidebarProvider>
      <ListSidebar
        lists={lists}
        selectedListId={selectedListId}
        onSelectList={selectList}
        onCreateList={createList}
        onRequestRename={setListToRename}
        onRequestDelete={setListToDelete}
      />
      <SidebarInset>
        {selectedList ? (
          <ListContent
            list={selectedList}
            todos={getTodosForList(selectedList.id)}
            onCreateTodo={(title, dueDate, priority) =>
              createTodo(selectedList.id, title, dueDate, priority)
            }
            onUpdateTodo={updateTodo}
            onDeleteTodo={deleteTodo}
          />
        ) : (
          <div className="flex flex-1 flex-col">
            <header className="flex h-14 items-center gap-2 border-b px-4 md:hidden">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <h2 className="text-lg font-semibold">Todo App</h2>
            </header>
            <EmptyState onCreateList={createList} />
          </div>
        )}
      </SidebarInset>

      <DeleteListDialog
        list={listToDelete}
        open={!!listToDelete}
        onOpenChange={(open) => !open && setListToDelete(null)}
        onConfirm={(id) => {
          deleteList(id)
          deleteTodosForList(id)
          setListToDelete(null)
        }}
      />
      <RenameListDialog
        list={listToRename}
        open={!!listToRename}
        onOpenChange={(open) => !open && setListToRename(null)}
        onConfirm={(id, newName) => {
          renameList(id, newName)
          setListToRename(null)
        }}
      />
    </SidebarProvider>
  )
}
