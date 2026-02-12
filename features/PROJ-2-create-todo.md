# PROJ-2: Create Todo

## Status: Planned

## Overview

Users can add a new todo item to a specific list. Only the title is required. Due date and priority level are optional fields. Priority defaults to "None" when not explicitly set. The todo is immediately persisted in localStorage and appears in the active list.

## User Stories

1. **As a user**, I want to add a new todo by typing a title, so I can quickly capture a task without friction.
2. **As a user**, I want to optionally set a due date when creating a todo, so I can track deadlines.
3. **As a user**, I want to optionally set a priority level (Low, Medium, High) when creating a todo, so I can indicate urgency.
4. **As a user**, I want the todo to appear immediately in my current list after creation, so I have instant feedback that the task was saved.
5. **As a user**, I want the create form to reset after submission, so I can quickly add multiple todos in a row.

## Acceptance Criteria

- [ ] A "create todo" input/form is visible when a list is selected.
- [ ] The user can type a todo title into a text input field.
- [ ] The submit/add action is triggered by clicking a button or pressing Enter.
- [ ] Only the title field is required. Due date and priority are optional.
- [ ] If no priority is selected, it defaults to "None".
- [ ] If no due date is selected, the todo is created without a due date.
- [ ] Due dates are selected via a date picker input (native or component).
- [ ] Priority is selected from a set of options: None, Low, Medium, High.
- [ ] After successful creation, the new todo appears in the current list immediately without page reload.
- [ ] After successful creation, the form resets (title cleared, due date cleared, priority reset to "None").
- [ ] The new todo is persisted in localStorage and survives page reload.
- [ ] Each todo has a unique identifier (e.g., UUID).
- [ ] Each todo stores: id, title, listId, createdAt, dueDate (nullable), priority (None/Low/Medium/High), completed (boolean, initially false).

## Edge Cases

1. **Empty or whitespace-only title**: The submit button is disabled and/or the form shows a validation hint. No todo is created.
2. **Due date in the past**: Allowed -- the user may be logging an already-overdue task. No warning or blocking.
3. **No list selected (all lists deleted)**: The create form should not be accessible. The user should see the PROJ-1 empty state prompting list creation instead.
4. **Rapid successive submissions**: Each submission should create a distinct todo. No debounce that would swallow entries.
5. **localStorage write failure (quota exceeded or unavailable)**: Show an error message indicating the todo could not be saved. Do not clear the form so the user can retry or copy their input.

## Technical Notes (non-prescriptive)

- The todo data model and storage structure will be defined by the Solution Architect.
- This feature covers creation only. Viewing, editing, deleting, and status toggling are separate features.

## Dependencies

- **Requires: PROJ-1 (List Management)** -- a list must exist before a todo can be created, since every todo belongs to a list.

---

## QA Test Results

**Tested:** 2026-02-11
**Method:** Code Review / Static Analysis
**Files Reviewed:** `src/components/create-todo-form.tsx`, `src/hooks/use-todo-store.ts`, `src/lib/list-storage.ts`, `src/app/page.tsx`, `src/components/list-content.tsx`

### Acceptance Criteria Status

- [x] AC-1: A "create todo" input/form is visible when a list is selected.
  - Verified in `list-content.tsx` line 301: `<CreateTodoForm onSubmit={onCreateTodo} />` is rendered inside `ListContent`, which only renders when `selectedList` is truthy.

- [x] AC-2: The user can type a todo title into a text input field.
  - Verified in `create-todo-form.tsx` line 40-45: `<Input placeholder="Add a todo..." value={title} onChange={...} />`.

- [x] AC-3: The submit/add action is triggered by clicking a button or pressing Enter.
  - Verified: The input is inside a `<form onSubmit={handleSubmit}>`, so Enter triggers submission. The `<Button type="submit">` with Plus icon also triggers it.

- [x] AC-4: Only the title field is required. Due date and priority are optional.
  - Verified in `create-todo-form.tsx`: Title is checked with `if (!trimmed) return`. Due date defaults to `""` (sent as `null`), priority defaults to `"None"`. Optional fields are hidden behind an expandable "Due date & priority" toggle.

- [x] AC-5: If no priority is selected, it defaults to "None".
  - Verified in `create-todo-form.tsx` line 23: `const [priority, setPriority] = useState<Priority>("None")`.

- [x] AC-6: If no due date is selected, the todo is created without a due date.
  - Verified: `dueDate || null` on line 30 sends `null` when dueDate is empty string. Todo schema has `dueDate: z.string().nullable()`.

- [x] AC-7: Due dates are selected via a date picker input.
  - Verified in `create-todo-form.tsx` line 67-70: `<Input type="date" />` -- native HTML date picker. Includes "Clear" button when a date is set.

- [x] AC-8: Priority is selected from options: None, Low, Medium, High.
  - Verified in `create-todo-form.tsx` line 85-96: `<Select>` component iterating over `priorities` array from `list-storage.ts` which is `["None", "Low", "Medium", "High"]`.

- [x] AC-9: After successful creation, the new todo appears immediately without page reload.
  - Verified: `createTodo` in `use-todo-store.ts` calls `setTodos(updated)` which triggers React re-render. `page.tsx` passes `getTodosForList(selectedList.id)` to `ListContent`.

- [x] AC-10: After successful creation, the form resets (title cleared, due date cleared, priority reset to "None").
  - Verified in `create-todo-form.tsx` `handleSubmit` lines 31-34: `setTitle("")`, `setDueDate("")`, `setPriority("None")`, `setExpanded(false)`.

- [x] AC-11: The new todo is persisted in localStorage and survives page reload.
  - Verified: `createTodo` in `use-todo-store.ts` calls `persist(updated)` which calls `saveTodos(updated)` -> `localStorage.setItem(TODOS_KEY, ...)`. On mount, `loadTodos()` reads from localStorage.

- [x] AC-12: Each todo has a unique identifier (UUID).
  - Verified: `crypto.randomUUID()` in `createTodo`. Schema validates `z.string().uuid()`.

- [x] AC-13: Each todo stores: id, title, listId, createdAt, dueDate (nullable), priority, completed (initially false).
  - Verified in `use-todo-store.ts` `createTodo` and `list-storage.ts` `todoSchema`: All fields present. `completed: false` is hardcoded on creation.

### Edge Cases Status

- [x] EC-1: Empty or whitespace-only title -- submit button is disabled and no todo is created.
  - Verified: Button `disabled={!title.trim()}` in `create-todo-form.tsx` line 46. `handleSubmit` also checks `if (!trimmed) return`.

- [x] EC-2: Due date in the past -- allowed, no warning or blocking.
  - Verified: No date validation in `create-todo-form.tsx` or `use-todo-store.ts`. Any valid date string from the HTML date input is accepted.

- [x] EC-3: No list selected (all lists deleted) -- create form is not accessible.
  - Verified in `page.tsx` lines 54-72: When `selectedList` is falsy, `EmptyState` is rendered instead of `ListContent`. The `CreateTodoForm` is only inside `ListContent`.

- [ ] **EC-4: Rapid successive submissions -- each should create a distinct todo. No debounce that swallows entries.**
  - **BUG:** `createTodo` in `use-todo-store.ts` uses a stale closure over `todos`. If called twice rapidly within the same render cycle, the second call uses the same `todos` array as the first, overwriting the first todo in localStorage. See BUG-PROJ2-1 below.

- [x] EC-5: localStorage write failure -- show error, do not clear the form.
  - **Partially verified:** `persist` in `use-todo-store.ts` catches errors and shows `toast.error(...)`, then throws `new Error("storage_error")`. However, the `createTodo` function does NOT catch this re-thrown error. The form reset in `create-todo-form.tsx` `handleSubmit` runs unconditionally after `onSubmit(...)` -- it does NOT check for success/failure. See BUG-PROJ2-2 below.

### Bugs Found

#### BUG-PROJ2-1: Stale closure causes data loss on rapid todo creation
- **Severity:** Medium
- **Location:** `src/hooks/use-todo-store.ts` lines 34-52
- **Description:** The `createTodo` callback closes over the `todos` state variable. If called twice rapidly before React re-renders, the second call sees the pre-first-call `todos` array. This means `[...todos, secondTodo]` does not include `firstTodo`, and `persist(updated)` writes only `[...originalTodos, secondTodo]` to localStorage, losing the first todo.
- **Steps to Reproduce:**
  1. Have an empty list selected
  2. Rapidly submit two todos (e.g., via programmatic double-call or extremely fast typing + Enter)
  3. Expected: Both todos appear and are persisted
  4. Actual: Only the second todo survives in localStorage (first is lost)
- **Priority:** Medium (data loss scenario, though unlikely with normal human typing speed)

#### BUG-PROJ2-2: Form resets even when localStorage write fails
- **Severity:** High
- **Location:** `src/components/create-todo-form.tsx` lines 26-35, `src/hooks/use-todo-store.ts` lines 34-52
- **Description:** When `persist` throws in `createTodo`, the error propagates up. But `create-todo-form.tsx`'s `handleSubmit` calls `onSubmit(...)` and then unconditionally resets the form state. The spec explicitly requires: "Do not clear the form so the user can retry or copy their input." The thrown error from `persist` will become an unhandled exception in the React event handler, and the form will have already been cleared.
- **Steps to Reproduce:**
  1. Fill localStorage to quota
  2. Type a todo title and submit
  3. Expected: Error toast, form keeps user's input
  4. Actual: Error toast appears, but form is cleared and user loses their input. Additionally, an unhandled error may occur.
- **Priority:** High (user loses input they cannot recover; spec explicitly requires preserving form on error)

### Security Analysis

- **XSS via todo title:** NOT vulnerable. React auto-escapes `{todo.title}` in JSX.
- **HTML injection via date picker:** Not possible. `<input type="date">` only accepts date values.
- **Priority value injection:** The `as Priority` cast on line 85 of `create-todo-form.tsx` (`onValueChange={(v) => setPriority(v as Priority)}`) does not validate. However, the `<Select>` component only offers valid `SelectItem` values, so invalid values cannot be injected via UI. If localStorage is manipulated directly, zod validation on load will catch invalid priority values.

### Summary
- 13/13 Acceptance Criteria passed
- 4/5 Edge Cases passed (1 failed: rapid submissions)
- 2 Bugs found (0 Critical, 1 High, 1 Medium)
- Production-Ready: NO (BUG-PROJ2-2 is High severity -- form clears on storage failure, violating spec and causing user data loss)
