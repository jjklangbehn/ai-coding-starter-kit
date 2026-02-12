# PROJ-4: Edit & Delete Todo

## Status: Planned

## Overview

Users can modify the title, due date, and priority of an existing todo. Users can also delete a todo they no longer need. Edits are persisted immediately to localStorage. Deletion requires a confirmation step to prevent accidental data loss.

## User Stories

1. **As a user**, I want to edit a todo's title, so I can fix typos or refine the task description.
2. **As a user**, I want to change a todo's due date, so I can adjust deadlines as plans change.
3. **As a user**, I want to change a todo's priority level, so I can re-prioritize tasks as circumstances evolve.
4. **As a user**, I want to remove a due date or priority from a todo, so I can simplify a task that no longer needs those attributes.
5. **As a user**, I want to delete a todo I no longer need, with a confirmation step, so I do not accidentally lose a task.

## Acceptance Criteria

- [ ] Each todo item has an edit action (e.g., edit icon/button or click-to-edit interaction).
- [ ] Editing a todo allows the user to change the title, due date, and priority level.
- [ ] The edit interaction can be inline (in-place editing) or via a modal/panel -- either approach is acceptable.
- [ ] The title field retains the same validation as creation: empty or whitespace-only titles are rejected.
- [ ] The due date can be changed to a new date, or cleared entirely (set back to "no due date").
- [ ] The priority can be changed to any valid value (None, Low, Medium, High).
- [ ] Changes are saved explicitly (e.g., via a "Save" button or pressing Enter), not on every keystroke.
- [ ] Canceling an edit discards all unsaved changes and restores the original values.
- [ ] Saved changes are persisted to localStorage immediately and the todo list view updates reactively.
- [ ] Each todo item has a delete action (e.g., trash icon/button).
- [ ] Clicking delete shows a confirmation dialog (e.g., "Delete this todo? This cannot be undone.").
- [ ] Confirming deletion removes the todo from localStorage and from the list view immediately.
- [ ] Canceling deletion leaves the todo unchanged.

## Edge Cases

1. **Editing a completed todo**: Allowed -- users may want to fix a typo on a completed item or update its metadata. Editing does not change the completed status.
2. **Editing while another edit is open**: If inline editing is used, only one todo should be in edit mode at a time. Starting a new edit should cancel (discard) the previous unsaved edit.
3. **Deleting the only todo in a list**: After deletion, the list view should show its empty state (from PROJ-3). The list itself remains.
4. **Setting due date to past during edit**: Allowed, consistent with PROJ-2 creation behavior. The overdue indicator (PROJ-3) will apply if the todo is still active.
5. **localStorage write failure during save**: Show an error message. Keep the edit form open with the user's changes so they can retry.

## Technical Notes (non-prescriptive)

- This feature covers modification and deletion of individual todos only. List deletion is covered in PROJ-1. Status toggling is covered in PROJ-5.

## Dependencies

- **Requires: PROJ-1 (List Management)** -- todos exist within lists.
- **Requires: PROJ-2 (Create Todo)** -- todos must exist before they can be edited or deleted.
- **Requires: PROJ-3 (Todo List View)** -- the list view provides the UI context where edit/delete actions are triggered.

---

## QA Test Results

**Tested:** 2026-02-11
**Method:** Code Review / Static Analysis
**Files Reviewed:** `src/components/list-content.tsx` (TodoItem component), `src/components/delete-todo-dialog.tsx`, `src/hooks/use-todo-store.ts`, `src/lib/list-storage.ts`

### Acceptance Criteria Status

- [x] AC-1: Each todo item has an edit action.
  - Verified in `list-content.tsx` lines 219-243: Each `TodoItem` has a `DropdownMenu` with an "Edit" menu item that calls `handleStartEdit()`.

- [x] AC-2: Editing allows changing title, due date, and priority.
  - Verified in `TodoItem` edit mode (lines 122-185): The edit form includes an `Input` for title (line 132-138), an `Input type="date"` for due date (line 144-148), and a `Select` for priority (line 162-173).

- [x] AC-3: The edit interaction is inline (in-place editing).
  - Verified: When `isEditing` is true, the `TodoItem` renders an inline form replacing the normal display (line 122: `if (isEditing)`). This is in-place editing within the list, not a modal.

- [x] AC-4: Title field validation -- empty/whitespace-only rejected.
  - Verified in `TodoItem` `handleSave` (line 113): `const trimmed = editTitle.trim(); if (!trimmed) return;`. Also, Save button is disabled: `disabled={!editTitle.trim()}` (line 176).

- [x] AC-5: Due date can be changed or cleared entirely.
  - Verified: Date input at line 144-148. "Clear" button at lines 150-159 sets `editDueDate` to `""`. On save, `dueDate: editDueDate || null` (line 117) converts empty string to `null`.

- [x] AC-6: Priority can be changed to any valid value (None, Low, Medium, High).
  - Verified: `Select` component iterates over `priorities` array (line 167). All four values available.

- [x] AC-7: Changes are saved explicitly (Save button or Enter), not on every keystroke.
  - Verified: Form uses `onSubmit={handleSave}` (line 126-129). Changes are only applied when the form is submitted. No `onChange` persistence.

- [x] AC-8: Canceling an edit discards unsaved changes and restores original values.
  - Verified: Cancel button calls `onCancelEdit()` (line 179) which sets `editingTodoId` to `null` (line 284 in `ListContent`). Next time edit is opened, `handleStartEdit` (lines 105-109) re-initializes state from `todo.title`, `todo.dueDate`, `todo.priority`. Original values are never mutated.

- [x] AC-9: Saved changes are persisted to localStorage immediately and view updates reactively.
  - Verified: `onSave` calls `onUpdateTodo(todo.id, changes)` (line 286) which calls `updateTodo` in `use-todo-store.ts`. This calls `persist(updated)` then `setTodos(updated)`.

- [x] AC-10: Each todo item has a delete action.
  - Verified: DropdownMenu with "Delete" option (lines 235-240) that calls `onRequestDelete()`.

- [x] AC-11: Clicking delete shows a confirmation dialog.
  - Verified: `onRequestDelete` sets `todoToDelete` state (line 289), which opens `DeleteTodoDialog` (line 341-349). Dialog text: "Delete [title]? This cannot be undone."

- [x] AC-12: Confirming deletion removes the todo from localStorage and list view.
  - Verified: `onConfirm` calls `onDeleteTodo(id)` (line 346) -> `deleteTodo` in `use-todo-store.ts` which filters, persists, and updates state.

- [x] AC-13: Canceling deletion leaves the todo unchanged.
  - Verified: `AlertDialogCancel` in `delete-todo-dialog.tsx` simply closes the dialog. `onOpenChange` sets `todoToDelete` to null.

### Edge Cases Status

- [x] EC-1: Editing a completed todo -- allowed, does not change completed status.
  - Verified: The edit `onSave` handler (line 285-287 in `ListContent`) calls `onUpdateTodo(todo.id, changes)` where `changes` only contains `title`, `dueDate`, `priority`. The `completed` field is not included in the changes, so it remains unchanged. The edit action is available for completed todos (the DropdownMenu is rendered for all todos).

- [x] EC-2: Editing while another edit is open -- only one edit at a time.
  - Verified: `editingTodoId` state in `ListContent` (line 256) is a single string. When `onStartEdit` is called, it sets `editingTodoId` to the new todo's ID (line 283), which automatically closes any previous edit. This matches the spec requirement that starting a new edit cancels (discards) the previous unsaved edit.

- [x] EC-3: Deleting the only todo in a list -- list shows empty state.
  - Verified: After deletion, `todos` will be empty. `list-content.tsx` line 303: `todos.length === 0` shows "No todos yet" message. The list itself remains (deletion only removes the todo, not the list).

- [x] EC-4: Setting due date to past during edit -- allowed.
  - Verified: No date validation in the edit form. Any date from the HTML date picker is accepted.

- [ ] **EC-5: localStorage write failure during save -- show error, keep edit form open.**
  - **BUG:** When `persist` throws in `updateTodo`, the error propagates to `onSave` in `ListContent` (line 285-287). The code calls `onUpdateTodo(todo.id, changes)` and then immediately calls `setEditingTodoId(null)` on line 287, closing the edit form. If `updateTodo` throws (because `persist` throws), the `setEditingTodoId(null)` line will NOT execute (the exception prevents it). However, the React state (`todos`) has already been updated via `setTodos(updated)` on line 65 of `use-todo-store.ts` -- wait, looking again: in `updateTodo` (lines 59-68), `persist(updated)` is called first (line 64), and if it throws, `setTodos(updated)` on line 65 is NOT reached. So the UI correctly stays in the old state. And the edit form stays open because `setEditingTodoId(null)` is not reached. Actually, this works correctly! The error propagation prevents the form from closing. Revising: this is PASS.

  **Re-analysis:** Looking more carefully at `persist` in `use-todo-store.ts` lines 25-32: it catches the error, shows a toast, then `throw new Error("storage_error")`. In `updateTodo`, `persist(updated)` is on line 64, `setTodos(updated)` on line 65. If persist throws, setTodos is not called. The error propagates to `onSave` in `list-content.tsx` line 286, and `setEditingTodoId(null)` on line 287 is not reached. So the edit form stays open. PASS.

  Revised: [x] PASS -- error handling correctly keeps edit form open.

### Bugs Found

#### BUG-PROJ4-1: Dropdown menu action button only visible on hover -- inaccessible on touch devices
- **Severity:** Medium
- **Location:** `src/components/list-content.tsx` lines 223-227
- **Description:** The DropdownMenu trigger button for edit/delete actions uses `opacity-0 group-hover:opacity-100 focus-visible:opacity-100`. On touch devices without hover capability, the button is invisible (opacity-0) and has no way to become visible except through focus (which requires tab navigation). Users on mobile/tablet who interact via touch cannot see or easily tap the action menu.
- **Steps to Reproduce:**
  1. Open the app on a touch-only device (phone, tablet)
  2. Look at a todo item
  3. Expected: Some way to access edit/delete actions (e.g., always-visible button, swipe, long-press)
  4. Actual: The three-dot menu button is invisible (opacity-0) and cannot be revealed by touch (no hover event on touch devices)
- **Fix Suggestion:** Add a media query or touch detection: on touch devices, always show the action button, or use `opacity-0 sm:group-hover:opacity-100` with a touch-friendly fallback.
- **Priority:** Medium (blocks core functionality on touch/mobile devices)

#### BUG-PROJ4-2: Stale closure in `updateTodo` can cause data loss
- **Severity:** Low
- **Location:** `src/hooks/use-todo-store.ts` lines 59-68
- **Description:** Same stale closure pattern as BUG-PROJ2-1. If `updateTodo` is called twice rapidly (e.g., toggling two different todos quickly), the second call may overwrite the first change. This is less likely than with create because edits target specific IDs, but the underlying `todos.map(...)` uses the stale closure snapshot.
- **Priority:** Low (extremely unlikely in edit scenario since user must open edit, change, and save)

### Security Analysis

- **XSS:** Not vulnerable. All user input rendered via React JSX which auto-escapes.
- **Privilege escalation:** N/A -- client-side only, no authentication.
- **Data integrity:** The `updateTodo` function accepts `Partial<Pick<Todo, "title" | "dueDate" | "priority" | "completed">>`. It does NOT allow changing `id`, `listId`, or `createdAt`, which protects structural integrity.

### Accessibility Analysis

- Edit form has `autoFocus` on the title input for keyboard users
- Escape key cancels edit (line 138-139: `onKeyDown` handler)
- Delete dialog uses `AlertDialog` with proper focus trapping
- **Issue:** The action menu trigger (three-dot button) has `sr-only` text "Actions" -- good for screen readers. However, the `opacity-0 group-hover:opacity-100` pattern means keyboard users must Tab to the button to see it (focus-visible reveals it), which is acceptable but not ideal.

### Summary
- 13/13 Acceptance Criteria passed
- 5/5 Edge Cases passed
- 2 Bugs found (0 Critical, 0 High, 2 Medium-Low)
- Production-Ready: YES (with caveat that BUG-PROJ4-1 affects mobile usability significantly -- recommended fix before mobile launch)
