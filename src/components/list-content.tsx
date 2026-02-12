"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  MoreVertical,
  Pencil,
  Trash2,
  CalendarDays,
} from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { CreateTodoForm } from "@/components/create-todo-form";
import { DeleteTodoDialog } from "@/components/delete-todo-dialog";
import {
  type TodoList,
  type Todo,
  type Priority,
  priorities,
} from "@/lib/list-storage";

interface ListContentProps {
  list: TodoList;
  todos: Todo[];
  onCreateTodo: (
    title: string,
    dueDate: string | null,
    priority: Priority,
  ) => void;
  onUpdateTodo: (
    id: string,
    changes: Partial<
      Pick<Todo, "title" | "dueDate" | "priority" | "completed">
    >,
  ) => void;
  onDeleteTodo: (id: string) => void;
}

const priorityColors: Record<Priority, string> = {
  None: "",
  Low: "bg-green-100 text-green-800 hover:bg-green-100/80 dark:bg-green-900 dark:text-green-300",
  Medium:
    "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80 dark:bg-yellow-900 dark:text-yellow-300",
  High: "bg-red-100 text-red-800 hover:bg-red-100/80 dark:bg-red-900 dark:text-red-300",
};

function getToday(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function isOverdue(dueDate: string | null): boolean {
  if (!dueDate) return false;
  return dueDate < getToday();
}

function sortActiveTodos(todos: Todo[]): Todo[] {
  return [...todos].sort((a, b) => {
    if (a.dueDate && b.dueDate) {
      if (a.dueDate !== b.dueDate) return a.dueDate < b.dueDate ? -1 : 1;
      return a.createdAt < b.createdAt ? -1 : 1;
    }
    if (a.dueDate && !b.dueDate) return -1;
    if (!a.dueDate && b.dueDate) return 1;
    return a.createdAt < b.createdAt ? -1 : 1;
  });
}

interface TodoItemProps {
  todo: Todo;
  showOverdue: boolean;
  isEditing: boolean;
  onToggle: () => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSave: (
    changes: Partial<Pick<Todo, "title" | "dueDate" | "priority">>,
  ) => void;
  onRequestDelete: () => void;
}

function TodoItem({
  todo,
  showOverdue,
  isEditing,
  onToggle,
  onStartEdit,
  onCancelEdit,
  onSave,
  onRequestDelete,
}: TodoItemProps) {
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDueDate, setEditDueDate] = useState(todo.dueDate ?? "");
  const [editPriority, setEditPriority] = useState<Priority>(todo.priority);

  const overdue = showOverdue && isOverdue(todo.dueDate);

  function handleStartEdit() {
    setEditTitle(todo.title);
    setEditDueDate(todo.dueDate ?? "");
    setEditPriority(todo.priority);
    onStartEdit();
  }

  function handleSave() {
    const trimmed = editTitle.trim();
    if (!trimmed) return;
    onSave({
      title: trimmed,
      dueDate: editDueDate || null,
      priority: editPriority,
    });
  }

  if (isEditing) {
    return (
      <li className="px-4 py-3 bg-muted/30 space-y-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="space-y-2"
        >
          <Input
            autoFocus
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Todo title..."
            onKeyDown={(e) => {
              if (e.key === "Escape") onCancelEdit();
            }}
          />
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
                className="h-8 w-auto text-sm"
              />
              {editDueDate && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-xs"
                  onClick={() => setEditDueDate("")}
                >
                  Clear
                </Button>
              )}
            </div>
            <Select
              value={editPriority}
              onValueChange={(v) => setEditPriority(v as Priority)}
            >
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
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={!editTitle.trim()}>
              Save
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onCancelEdit}
            >
              Cancel
            </Button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className="group flex items-center gap-3 px-4 py-3">
      <Checkbox
        checked={todo.completed}
        onCheckedChange={onToggle}
        aria-label={`Mark "${todo.title}" as ${todo.completed ? "incomplete" : "complete"}`}
        className="shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p
          className={`truncate ${todo.completed ? "line-through text-muted-foreground" : ""}`}
        >
          {todo.title}
        </p>
        <div className="flex items-center gap-2 mt-1">
          {todo.dueDate && (
            <span
              className={`text-xs flex items-center gap-1 ${
                overdue
                  ? "text-destructive font-medium"
                  : "text-muted-foreground"
              }`}
            >
              {overdue && <AlertCircle className="h-3 w-3" />}
              {new Date(todo.dueDate).toLocaleDateString()}
              {overdue && " — overdue"}
            </span>
          )}
          {todo.priority !== "None" && (
            <Badge
              variant="outline"
              className={`text-xs border-0 ${priorityColors[todo.priority]}`}
            >
              {todo.priority}
            </Badge>
          )}
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity"
          >
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleStartEdit}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onRequestDelete}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </li>
  );
}

export function ListContent({
  list,
  todos,
  onCreateTodo,
  onUpdateTodo,
  onDeleteTodo,
}: ListContentProps) {
  const [completedOpen, setCompletedOpen] = useState(true);
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [todoToDelete, setTodoToDelete] = useState<Todo | null>(null);

  const { activeTodos, completedTodos } = useMemo(() => {
    const active: Todo[] = [];
    const completed: Todo[] = [];
    for (const todo of todos) {
      if (todo.completed) {
        completed.push(todo);
      } else {
        active.push(todo);
      }
    }
    return {
      activeTodos: sortActiveTodos(active),
      completedTodos: completed,
    };
  }, [todos]);

  function renderTodoItem(todo: Todo, showOverdue: boolean) {
    return (
      <TodoItem
        key={todo.id}
        todo={todo}
        showOverdue={showOverdue}
        isEditing={editingTodoId === todo.id}
        onToggle={() => {
          if (!todo.completed) {
            import("canvas-confetti").then((mod) =>
              mod.default({
                particleCount: 80,
                spread: 70,
                origin: { x: 0.5, y: 1 },
                angle: 90,
                startVelocity: 60, // 45
              }),
            );
            const ac = new AudioContext();
            const osc = ac.createOscillator();
            const gain = ac.createGain();
            osc.type = "sawtooth";
            osc.frequency.setValueAtTime(600, ac.currentTime);
            osc.frequency.exponentialRampToValueAtTime(
              100,
              ac.currentTime + 0.3,
            );
            gain.gain.setValueAtTime(0.15, ac.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.3);
            osc.connect(gain).connect(ac.destination);
            osc.start();
            osc.stop(ac.currentTime + 0.3);
          }
          onUpdateTodo(todo.id, { completed: !todo.completed });
        }}
        onStartEdit={() => setEditingTodoId(todo.id)}
        onCancelEdit={() => setEditingTodoId(null)}
        onSave={(changes) => {
          onUpdateTodo(todo.id, changes);
          setEditingTodoId(null);
        }}
        onRequestDelete={() => setTodoToDelete(todo)}
      />
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex h-14 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h2 className="text-lg font-semibold truncate">{list.name}</h2>
      </header>
      <CreateTodoForm onSubmit={onCreateTodo} />
      <div className="flex-1 overflow-auto">
        {todos.length === 0 ? (
          <div className="flex flex-1 items-center justify-center p-8">
            <p className="text-muted-foreground">
              No todos yet. Add your first task above!
            </p>
          </div>
        ) : (
          <>
            {activeTodos.length === 0 ? (
              <div className="flex items-center justify-center gap-2 p-8 text-muted-foreground">
                <CheckCircle2 className="h-5 w-5" />
                <p>All done!</p>
              </div>
            ) : (
              <ul className="divide-y">
                {activeTodos.map((todo) => renderTodoItem(todo, true))}
              </ul>
            )}

            {completedTodos.length > 0 && (
              <Collapsible open={completedOpen} onOpenChange={setCompletedOpen}>
                <CollapsibleTrigger className="flex w-full items-center gap-2 border-t bg-muted/50 px-4 py-2 text-sm text-muted-foreground hover:bg-muted transition-colors">
                  <ChevronRight
                    className={`h-4 w-4 transition-transform ${completedOpen ? "rotate-90" : ""}`}
                  />
                  Completed ({completedTodos.length})
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <ul className="divide-y">
                    {completedTodos.map((todo) => renderTodoItem(todo, false))}
                  </ul>
                </CollapsibleContent>
              </Collapsible>
            )}
          </>
        )}
      </div>

      <DeleteTodoDialog
        todo={todoToDelete}
        open={!!todoToDelete}
        onOpenChange={(open) => !open && setTodoToDelete(null)}
        onConfirm={(id) => {
          onDeleteTodo(id);
          setTodoToDelete(null);
        }}
      />
    </div>
  );
}
