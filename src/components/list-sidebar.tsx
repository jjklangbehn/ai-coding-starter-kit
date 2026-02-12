"use client"

import { useState } from "react"
import { List, MoreVertical, Pencil, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import type { TodoList } from "@/lib/list-storage"

interface ListSidebarProps {
  lists: TodoList[]
  selectedListId: string | null
  onSelectList: (id: string) => void
  onCreateList: (name: string) => void
  onRequestRename: (list: TodoList) => void
  onRequestDelete: (list: TodoList) => void
}

export function ListSidebar({
  lists,
  selectedListId,
  onSelectList,
  onCreateList,
  onRequestRename,
  onRequestDelete,
}: ListSidebarProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [newListName, setNewListName] = useState("")

  function handleCreate() {
    const trimmed = newListName.trim()
    if (!trimmed) return
    onCreateList(trimmed)
    setNewListName("")
    setIsCreating(false)
  }

  function handleCancelCreate() {
    setNewListName("")
    setIsCreating(false)
  }

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <h1 className="text-lg font-semibold">Todo App</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Lists</SidebarGroupLabel>
          <SidebarGroupAction
            title="New List"
            onClick={() => setIsCreating(true)}
          >
            <Plus />
            <span className="sr-only">New List</span>
          </SidebarGroupAction>
          <SidebarGroupContent>
            {isCreating && (
              <div className="px-2 pb-2">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleCreate()
                  }}
                  className="flex gap-1"
                >
                  <Input
                    autoFocus
                    placeholder="List name..."
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") handleCancelCreate()
                    }}
                    className="h-8 text-sm"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!newListName.trim()}
                    className="h-8 shrink-0"
                  >
                    Add
                  </Button>
                </form>
              </div>
            )}
            <SidebarMenu>
              {lists.map((list) => (
                <SidebarMenuItem key={list.id}>
                  <SidebarMenuButton
                    isActive={list.id === selectedListId}
                    onClick={() => onSelectList(list.id)}
                    tooltip={list.name}
                  >
                    <List className="shrink-0" />
                    <span className="truncate">{list.name}</span>
                  </SidebarMenuButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction showOnHover>
                        <MoreVertical />
                        <span className="sr-only">Actions</span>
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" align="start">
                      <DropdownMenuItem
                        onClick={() => onRequestRename(list)}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onRequestDelete(list)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              ))}
              {lists.length === 0 && !isCreating && (
                <p className="px-2 py-4 text-sm text-muted-foreground text-center">
                  No lists yet
                </p>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
