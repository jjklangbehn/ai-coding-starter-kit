# PROJ-3: Todo List View

## Status: Planned

## Overview

Displays all todos belonging to the currently selected list. Active (incomplete) todos are sorted by due date with the soonest date first and items without a due date at the bottom. Completed todos are shown in a separate "Completed" section beneath the active todos. Overdue active todos display a visual indicator.

## User Stories

1. **As a user**, I want to see all my active todos for the selected list sorted by due date (soonest first), so I can focus on the most urgent tasks.
2. **As a user**, I want todos without a due date to appear at the bottom of the active section, so dated tasks get priority visibility.
3. **As a user**, I want completed todos displayed in a separate section at the bottom of the list, so they do not clutter my active task view.
4. **As a user**, I want to see a visual overdue indicator on active todos whose due date has passed, so I can immediately spot tasks I have missed.
5. **As a user**, I want to see the priority level displayed on each todo, so I can assess urgency at a glance.

## Acceptance Criteria

- [ ] When a list is selected, all todos belonging to that list are displayed in the main content area.
- [ ] Active (incomplete) todos are displayed in their own section.
- [ ] Active todos are sorted by due date ascending (soonest first).
- [ ] Active todos without a due date appear after all dated todos.
- [ ] Among active todos with the same due date (or both without a due date), secondary sort is by creation date (oldest first).
- [ ] Completed todos are displayed in a separate "Completed" section below the active todos.
- [ ] The "Completed" section has a visual separator or heading distinguishing it from active todos.
- [ ] Each todo item displays: title, due date (if set), and priority level (if not "None").
- [ ] Active todos whose due date is before today's date show a visual overdue indicator (e.g., red text, icon, or badge).
- [ ] Completed todos do NOT show the overdue indicator, even if their due date is in the past.
- [ ] If the selected list has no todos at all, an empty state is shown (e.g., "No todos yet. Add your first task above.").
- [ ] If all todos are completed, the active section shows an encouraging empty state (e.g., "All done!") and the completed section lists the items.
- [ ] The view updates immediately when a todo is added, edited, deleted, or toggled (no manual refresh needed).
- [ ] Priority levels are visually distinguishable (e.g., color-coded labels or icons for Low, Medium, High).

## Edge Cases

1. **List with hundreds of todos**: The list should remain scrollable and usable. No pagination needed for MVP, but the layout must handle long lists without breaking.
2. **Due date is exactly today**: The todo is NOT overdue. Overdue means the due date is strictly before today.
3. **Switching between lists**: The view should immediately update to show the selected list's todos. No stale data from the previous list.
4. **Completed section with many items**: The completed section should be collapsible or at minimum scrollable so it does not push active todos out of view. (Collapsible is preferred but not strictly required for MVP.)
5. **All todos have no due date**: All active todos appear in the active section sorted by creation date. No sorting anomaly.

## Technical Notes (non-prescriptive)

- This is a read/display feature. It does not handle creating, editing, deleting, or toggling -- those are PROJ-2, PROJ-4, and PROJ-5 respectively.
- The view must reactively update when underlying data changes (triggered by other features).

## Dependencies

- **Requires: PROJ-1 (List Management)** -- a list must be selected to display its todos.
- **Requires: PROJ-2 (Create Todo)** -- todos must exist to be displayed (though the view handles the empty state gracefully).

---

## QA Test Results

**Tested:** 2026-02-11
**Method:** Code Review / Static Analysis
**Files Reviewed:** `src/components/list-content.tsx`, `src/hooks/use-todo-store.ts`, `src/lib/list-storage.ts`, `src/app/page.tsx`

### Acceptance Criteria Status

- [x] AC-1: When a list is selected, all todos belonging to that list are displayed.
  - Verified in `page.tsx` line 57: `todos={getTodosForList(selectedList.id)}` filters todos by listId. `ListContent` receives only the relevant todos.

- [x] AC-2: Active (incomplete) todos are displayed in their own section.
  - Verified in `list-content.tsx` lines 259-272: `useMemo` splits todos into `activeTodos` and `completedTodos` based on `todo.completed`. Active todos rendered in `<ul>` on line 317-319.

- [x] AC-3: Active todos are sorted by due date ascending (soonest first).
  - Verified in `sortActiveTodos` function (lines 66-76): Todos with `dueDate` are compared via string comparison (`a.dueDate < b.dueDate ? -1 : 1`). Since dates are in `YYYY-MM-DD` format (from HTML date input), lexicographic comparison produces correct chronological order.

- [x] AC-4: Active todos without a due date appear after all dated todos.
  - Verified in `sortActiveTodos` lines 72-73: `if (a.dueDate && !b.dueDate) return -1` and `if (!a.dueDate && b.dueDate) return 1` ensure dated todos sort before undated.

- [x] AC-5: Secondary sort by creation date (oldest first) for todos with the same due date or both without due date.
  - Verified in `sortActiveTodos` lines 70 and 74: When due dates are equal, or both are null, sorting falls back to `a.createdAt < b.createdAt ? -1 : 1`. `createdAt` is an ISO datetime string, so lexicographic comparison is correct.

- [x] AC-6: Completed todos are displayed in a separate "Completed" section below active todos.
  - Verified in `list-content.tsx` lines 322-335: `Collapsible` section with "Completed (N)" heading, rendered after the active todos list.

- [x] AC-7: The "Completed" section has a visual separator or heading distinguishing it from active todos.
  - Verified: The `CollapsibleTrigger` has `border-t bg-muted/50` classes (line 324), creating a visual border separator. The trigger text "Completed (N)" serves as the heading.

- [x] AC-8: Each todo item displays title, due date (if set), and priority level (if not "None").
  - Verified in `TodoItem` (lines 188-245): Title displayed on line 197. Due date shown conditionally on lines 201-210 via `{todo.dueDate && ...}`. Priority badge shown conditionally on lines 212-215 via `{todo.priority !== "None" && <Badge>}`.

- [x] AC-9: Active todos whose due date is before today show a visual overdue indicator.
  - Verified: `isOverdue` function (lines 61-64) checks `dueDate < getToday()` (strict less-than, so today is NOT overdue). When overdue, the date text gets `text-destructive font-medium` class (red text), an `AlertCircle` icon, and " -- overdue" suffix (lines 203-209). `showOverdue` is `true` for active todos (line 318) and `false` for completed (line 332).

- [x] AC-10: Completed todos do NOT show the overdue indicator even if their due date is past.
  - Verified: `renderTodoItem(todo, false)` on line 332 passes `showOverdue=false` for completed todos. The `TodoItem` component checks `const overdue = showOverdue && isOverdue(todo.dueDate)` (line 103).

- [x] AC-11: If the selected list has no todos at all, an empty state is shown.
  - Verified in `list-content.tsx` lines 303-308: When `todos.length === 0`, displays "No todos yet. Add your first task above!"

- [x] AC-12: If all todos are completed, the active section shows "All done!" and completed section lists items.
  - Verified in lines 311-315: When `activeTodos.length === 0` (but `todos.length > 0`), shows CheckCircle2 icon with "All done!" message. The completed collapsible section below still renders.

- [x] AC-13: The view updates immediately when a todo is added, edited, deleted, or toggled.
  - Verified: All mutations in `use-todo-store.ts` call `setTodos(updated)` which triggers React re-render. The `todos` prop is derived from `getTodosForList` which depends on the `todos` state.

- [x] AC-14: Priority levels are visually distinguishable.
  - Verified in `list-content.tsx` lines 49-54: `priorityVariant` maps each priority to a different shadcn/ui Badge variant: None=outline, Low=secondary, Medium=default, High=destructive. These produce visually distinct colors.

### Edge Cases Status

- [x] EC-1: List with hundreds of todos -- remains scrollable and usable.
  - Verified: `list-content.tsx` line 302 has `<div className="flex-1 overflow-auto">` wrapping the todo lists. The `flex-1` fills available space and `overflow-auto` enables scrolling. No virtualization, but acceptable for MVP.

- [x] EC-2: Due date exactly today -- NOT overdue.
  - Verified: `isOverdue` uses strict less-than (`dueDate < getToday()`). A dueDate equal to today's date returns `false`.

- [x] EC-3: Switching between lists -- view immediately updates, no stale data.
  - Verified: `page.tsx` passes `getTodosForList(selectedList.id)` which recalculates when `selectedListId` changes. React re-renders `ListContent` with new props.

- [x] EC-4: Completed section with many items -- collapsible.
  - Verified: Uses shadcn/ui `Collapsible` component (lines 323-335). The section can be collapsed/expanded by clicking the trigger. Defaults to open (`completedOpen` initialized to `true`).

- [x] EC-5: All todos have no due date -- sorted by creation date, no anomaly.
  - Verified: `sortActiveTodos` falls through to line 74: `return a.createdAt < b.createdAt ? -1 : 1` when both todos have no dueDate.

### Bugs Found

#### BUG-PROJ3-1: Due date display may show wrong day due to timezone parsing
- **Severity:** Medium
- **Location:** `src/components/list-content.tsx` line 208
- **Description:** `new Date(todo.dueDate).toLocaleDateString()` parses the `YYYY-MM-DD` date string as UTC midnight. For users in negative UTC offsets (e.g., US timezones), this results in the previous day being displayed. For example, a user in UTC-5 who sets a due date of "2026-02-11" will see "2/10/2026" displayed because `new Date("2026-02-11")` is Feb 11 00:00 UTC = Feb 10 19:00 EST.
- **Steps to Reproduce:**
  1. Set browser timezone to a negative UTC offset (e.g., US Eastern, UTC-5)
  2. Create a todo with due date "2026-02-11"
  3. Expected: Due date displays as "2/11/2026" (or equivalent locale format)
  4. Actual: Due date displays as "2/10/2026"
- **Note:** The `isOverdue` comparison (`dueDate < getToday()`) uses raw `YYYY-MM-DD` string comparison and is NOT affected by this bug -- it works correctly. Only the visual display is wrong.
- **Fix Suggestion:** Parse the date as local: `new Date(todo.dueDate + "T00:00:00")` or split the date string manually.
- **Priority:** Medium (incorrect information displayed to user, affects all users in negative UTC offsets)

#### BUG-PROJ3-2: Editing todo ID state not reset when switching lists
- **Severity:** Low
- **Location:** `src/components/list-content.tsx` line 256
- **Description:** `editingTodoId` state is local to `ListContent` and initialized to `null`. However, `ListContent` is rendered with a `key` implicitly based on `selectedList.id` via the conditional in `page.tsx`. Actually, looking more carefully at `page.tsx` lines 54-63, `ListContent` does NOT have a `key` prop that changes when the list changes. This means if a user is editing a todo, switches to another list, and that list happens to have a todo with the same ID (extremely unlikely with UUIDs), the edit state would carry over. More practically: the `editingTodoId` state persists across list switches, but since todo IDs are unique per list, the editing state will simply not match any todo in the new list, and no edit form will be shown. So there is no visible bug, but the stale `editingTodoId` is technically impure.
- **Revised assessment:** NOT a real bug. The state is harmless. Removing from bug list.

### Security Analysis

- **XSS via todo title/date display:** NOT vulnerable. React JSX auto-escapes all interpolated values.
- **Date injection:** HTML date input constrains values to valid dates. Even if localStorage is manually edited with an invalid date string, `new Date(invalidString).toLocaleDateString()` returns "Invalid Date" rather than causing a crash.

### Summary
- 14/14 Acceptance Criteria passed
- 5/5 Edge Cases passed
- 1 Bug found (0 Critical, 0 High, 1 Medium)
- Production-Ready: YES (Medium bug is a display issue in certain timezones, not a functional blocker)
