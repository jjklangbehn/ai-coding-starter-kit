# PROJ-1: List Management

## Status: Planned

## Overview

Users can create, rename, and delete todo lists to organize their tasks into separate categories (e.g., "Work", "Personal", "Shopping"). First-time users see an empty state prompting them to create their first list. All data is persisted in localStorage.

## User Stories

1. **As a first-time user**, I want to see a clear empty state that prompts me to create my first list, so I understand how to get started with the app.
2. **As a user**, I want to create a new list by providing a name, so I can organize my todos into categories.
3. **As a user**, I want to rename an existing list, so I can correct typos or update the category name.
4. **As a user**, I want to delete a list I no longer need, so my workspace stays clean and relevant.
5. **As a user**, I want to see all my lists in a sidebar or navigation area, so I can quickly switch between them.

## Acceptance Criteria

- [ ] When no lists exist, the app displays an empty state with a message (e.g., "No lists yet") and a prominent "Create your first list" button or input.
- [ ] Users can create a new list by entering a name and confirming (button click or Enter key).
- [ ] Newly created lists appear immediately in the list navigation without page reload.
- [ ] Users can rename a list via an inline edit or modal interaction.
- [ ] Renaming a list updates the displayed name immediately without losing any todos inside it.
- [ ] Users can delete a list via a delete action (icon/button).
- [ ] Deleting a list shows a confirmation dialog that warns: "This will permanently delete the list and all its todos. This cannot be undone."
- [ ] Confirming deletion removes the list and all its associated todos from localStorage.
- [ ] Canceling deletion leaves the list and its todos unchanged.
- [ ] Clicking a list in the navigation selects it and displays its contents in the main area.
- [ ] All list data (name, ID, creation order) is persisted in localStorage and survives page reload.
- [ ] Each list has a unique identifier (e.g., UUID) that is used internally for referencing.
- [ ] There is no limit on the number of lists a user can create (MVP).

## Edge Cases

1. **Empty or whitespace-only list name**: The create/rename action should be disabled or show a validation message. Users cannot save a list with a blank name.
2. **Duplicate list names**: Allowed -- users may want "Work" and "Work" (no uniqueness constraint on names, only on internal IDs).
3. **Deleting the currently selected list**: After deletion, the app should select the next available list, or show the empty state if no lists remain.
4. **localStorage corrupted or unreadable**: Show an error message explaining the data could not be loaded and offer a "Reset App" button that clears localStorage and returns to the empty state.
5. **Very long list names**: Names should be visually truncated in the navigation (CSS truncation) but the full name is preserved in storage. No character limit enforced for MVP.

## Technical Notes (non-prescriptive)

- Storage key convention and data structure will be defined by the Solution Architect.
- This is the foundational feature -- all other features depend on at least one list existing.
- No backend, no authentication. Single-user, browser-only.

## Dependencies

- None -- this is the foundational feature.

---

## Tech-Design (Solution Architect)

### Ergebnis der Architektur-Analyse

- Die App ist ein frisches Next.js-Projekt (Standard-Startseite noch vorhanden)
- Es existieren **keine eigenen Components** -- nur die shadcn/ui Component Library
- Es gibt **keine API-Endpoints** -- passt, da kein Backend noetig ist
- Bereits vorhandene und nutzbare shadcn/ui Components: Sidebar, Button, Input, Card, Dialog, Sheet, Tooltip, Dropdown-Menu, Scroll-Area, Separator, Sonner (Toast)
- Bereits vorhandene Libraries: lucide-react (Icons), sonner (Toast-Benachrichtigungen), zod (Validierung)

### A) Component-Struktur

```
App Layout (Gesamte Seite)
|
+-- Sidebar (Listen-Navigation, links)
|   |
|   +-- App-Titel / Logo (oben in der Sidebar)
|   |
|   +-- "Neue Liste erstellen" Button
|   |
|   +-- Listen-Eintraege (scrollbar bei vielen Listen)
|   |   |
|   |   +-- Listen-Eintrag (pro Liste)
|   |       +-- Listen-Name (klickbar, visuell gekuerzt bei langen Namen)
|   |       +-- Aktions-Menu (drei Punkte)
|   |           +-- "Umbenennen"
|   |           +-- "Loeschen"
|   |
|   +-- Sidebar-Toggle (Ein-/Ausklappen auf kleinen Bildschirmen)
|
+-- Hauptbereich (rechts neben der Sidebar)
    |
    +-- ENTWEDER: Empty State (wenn keine Listen existieren)
    |   +-- Illustration oder Icon
    |   +-- Nachricht: "Noch keine Listen vorhanden"
    |   +-- Grosser "Erste Liste erstellen" Button
    |
    +-- ODER: Listen-Inhalt (wenn eine Liste ausgewaehlt ist)
        +-- Listen-Titel (oben, zeigt Name der ausgewaehlten Liste)
        +-- Platzhalter fuer zukuenftige Todo-Inhalte (PROJ-2+)

Dialoge (erscheinen ueber dem Rest):
|
+-- Loesch-Bestaetigungs-Dialog
|   +-- Warnung: "Dies loescht die Liste und alle Todos darin dauerhaft."
|   +-- "Abbrechen" Button
|   +-- "Endgueltig loeschen" Button (rot hervorgehoben)
|
+-- Umbenennen-Dialog
|   +-- Eingabefeld mit aktuellem Namen vorausgefuellt
|   +-- Validierung: Leere/nur-Leerzeichen-Namen nicht erlaubt
|   +-- "Abbrechen" Button
|   +-- "Speichern" Button
|
+-- Fehler-Anzeige (bei localStorage-Problemen)
    +-- Fehlermeldung: "Daten konnten nicht geladen werden"
    +-- "App zuruecksetzen" Button (loescht localStorage, zurueck zum Empty State)
```

### B) Daten-Model

**Was wird gespeichert?**

Jede Liste hat folgende Informationen:
- **Eindeutige ID** -- eine automatisch generierte, einzigartige Kennung (UUID-Format). Wird intern verwendet, um Listen eindeutig zu referenzieren.
- **Name** -- der vom User vergebene Name (z.B. "Einkaufen", "Arbeit"). Keine Zeichenbegrenzung, doppelte Namen sind erlaubt.
- **Erstellungszeitpunkt** -- wann die Liste erstellt wurde. Wird fuer die Sortierung der Listen verwendet.

**Wo wird gespeichert?**

- Alles wird im **Browser localStorage** gespeichert (keine Server-Verbindung noetig)
- Ein einzelner Speicher-Schluessel fuer alle Listen-Daten
- Die Daten ueberleben Browser-Neuladen und bleiben bestehen, bis der User loescht oder den Browser-Speicher leert

**Was passiert bei Aktionen?**

| Aktion | Auswirkung auf gespeicherte Daten |
|---|---|
| Liste erstellen | Neue Liste mit ID, Name und Zeitstempel wird hinzugefuegt |
| Liste umbenennen | Nur der Name der betroffenen Liste wird aktualisiert |
| Liste loeschen | Liste UND alle zugehoerigen Todos (spaeter PROJ-2+) werden entfernt |
| Seite neu laden | Alle Listen werden aus localStorage wiederhergestellt |
| Daten beschaedigt | Fehlermeldung + "App zuruecksetzen" Button |

**Ausgewaehlte Liste:**

- Die aktuell ausgewaehlte Liste wird ebenfalls im localStorage gespeichert, damit nach einem Seite-Neuladen die gleiche Liste wieder aktiv ist
- Wird die ausgewaehlte Liste geloescht, springt die Auswahl automatisch zur naechsten verfuegbaren Liste (oder zum Empty State, wenn keine mehr existiert)

### C) Tech-Entscheidungen

| Entscheidung | Begruendung |
|---|---|
| **shadcn/ui Sidebar** fuer die Listen-Navigation | Ist bereits im Projekt vorhanden, bietet responsive Funktionalitaet (klappt auf kleinen Bildschirmen zusammen), spart Entwicklungszeit |
| **shadcn/ui Dialog** fuer Loesch-Bestaetigung und Umbenennen | Bereits vorhanden, barrierearm (Tastatur-Support, Screen-Reader), einheitliches Design |
| **shadcn/ui Dropdown-Menu** fuer Listen-Aktionen | Bereits vorhanden, kompaktes "Drei-Punkte-Menu" fuer Umbenennen/Loeschen, spart Platz |
| **shadcn/ui Input + Button** fuer Formulare | Bereits vorhanden, konsistentes Design mit dem Rest der App |
| **shadcn/ui Scroll-Area** fuer die Listenuebersicht | Bereits vorhanden, sorgt fuer ansprechende Scrollbar bei vielen Listen |
| **sonner (Toast)** fuer Erfolgs-/Fehler-Meldungen | Bereits installiert, zeigt kurze Benachrichtigungen wie "Liste erstellt" oder "Liste geloescht" |
| **lucide-react** fuer Icons | Bereits installiert, bietet alle benoetigten Icons (Plus, Trash, Pencil, MoreVertical, AlertTriangle) |
| **localStorage** statt Datenbank | Kein Server noetig, keine Kosten, funktioniert offline, ideal fuer ein MVP mit einem einzelnen User pro Browser |
| **crypto.randomUUID()** fuer eindeutige IDs | Eingebaut in alle modernen Browser, kein zusaetzliches Package noetig, erzeugt sichere UUIDs |
| **zod** fuer Daten-Validierung beim Laden aus localStorage | Bereits installiert, stellt sicher, dass beschaedigte Daten erkannt werden und der Fehler-Zustand ausgeloest wird |

### D) Dependencies

**Keine neuen Packages noetig!**

Alles was fuer dieses Feature benoetigt wird, ist bereits im Projekt vorhanden:
- shadcn/ui Components (Sidebar, Dialog, Button, Input, Dropdown-Menu, Scroll-Area)
- lucide-react (Icons)
- sonner (Toast-Benachrichtigungen)
- zod (Daten-Validierung)
- crypto.randomUUID() (Browser-eingebaut, kein Package)

### E) Zusammenfassung fuer den Frontend Developer

**Neue Dateien die erstellt werden muessen:**
1. Ein App-Layout mit Sidebar und Hauptbereich (ersetzt die aktuelle Standard-Startseite)
2. Eine Listen-Sidebar-Component (zeigt alle Listen, "Neue Liste" Button, Aktions-Menus)
3. Ein Empty-State-Component (fuer Erstbesucher ohne Listen)
4. Ein Listen-Inhalt-Component (zeigt den Inhalt der ausgewaehlten Liste -- erstmal nur den Titel als Platzhalter)
5. Ein Loesch-Bestaetigungs-Dialog
6. Ein Umbenennen-Dialog
7. Ein Fehler-/Reset-Component (fuer localStorage-Probleme)
8. Wiederverwendbare Logik fuer localStorage-Zugriff (Lesen, Schreiben, Validieren)

**Wichtig:** Dieses Feature ist die Grundlage fuer alle weiteren Features (Todos, Drag & Drop, etc.). Die localStorage-Struktur muss so designed sein, dass spaeter Todos pro Liste hinzugefuegt werden koennen.

---

## QA Test Results

**Tested:** 2026-02-11
**Method:** Code Review / Static Analysis
**Files Reviewed:** `src/lib/list-storage.ts`, `src/hooks/use-list-store.ts`, `src/app/page.tsx`, `src/components/list-sidebar.tsx`, `src/components/empty-state.tsx`, `src/components/delete-list-dialog.tsx`, `src/components/rename-list-dialog.tsx`, `src/components/storage-error.tsx`

### Acceptance Criteria Status

- [x] AC-1: When no lists exist, the app displays an empty state with "No lists yet" message and a prominent "Create your first list" button.
  - Verified in `empty-state.tsx`: Shows "No lists yet" heading, descriptive text, and "Create your first list" button. Additionally, the sidebar shows "No lists yet" text when empty (`list-sidebar.tsx` line 143-147).

- [x] AC-2: Users can create a new list by entering a name and confirming (button click or Enter key).
  - Verified in `list-sidebar.tsx`: Form with `onSubmit` handler (Enter key) and "Add" button. Also in `empty-state.tsx` for the initial create flow.

- [x] AC-3: Newly created lists appear immediately in the list navigation without page reload.
  - Verified in `use-list-store.ts`: `createList` updates React state via `setLists(updated)` synchronously. No page reload needed.

- [x] AC-4: Users can rename a list via a modal interaction.
  - Verified in `rename-list-dialog.tsx`: Dialog component with input pre-filled with current name, Save/Cancel buttons.

- [x] AC-5: Renaming a list updates the displayed name immediately without losing any todos inside it.
  - Verified in `use-list-store.ts` `renameList`: Only updates the name field via `{ ...l, name: newName.trim() }`. Todos are stored separately and are not affected.

- [x] AC-6: Users can delete a list via a delete action (icon/button).
  - Verified in `list-sidebar.tsx`: DropdownMenu with "Delete" option per list item.

- [x] AC-7: Deleting a list shows a confirmation dialog with warning message.
  - Verified in `delete-list-dialog.tsx`: AlertDialog with message "This will permanently delete [name] and all its todos. This cannot be undone."

- [x] AC-8: Confirming deletion removes the list and all its associated todos from localStorage.
  - Verified in `page.tsx` line 80-84: `onConfirm` calls both `deleteList(id)` and `deleteTodosForList(id)`. Both persist to localStorage.

- [x] AC-9: Canceling deletion leaves the list and its todos unchanged.
  - Verified in `delete-list-dialog.tsx`: AlertDialogCancel simply closes the dialog. No state mutation occurs.

- [x] AC-10: Clicking a list in the navigation selects it and displays its contents in the main area.
  - Verified in `list-sidebar.tsx`: `SidebarMenuButton` with `onClick={() => onSelectList(list.id)}`. In `page.tsx`, `selectedList` drives which content is shown.

- [x] AC-11: All list data is persisted in localStorage and survives page reload.
  - Verified in `list-storage.ts`: `saveLists` writes to `LISTS_KEY`, `saveSelectedListId` writes to `SELECTED_LIST_KEY`. `useListStore` loads from localStorage on mount.

- [x] AC-12: Each list has a unique identifier (UUID) used internally for referencing.
  - Verified in `use-list-store.ts` `createList`: Uses `crypto.randomUUID()`. Schema validates UUID format via `z.string().uuid()`.

- [x] AC-13: There is no limit on the number of lists a user can create.
  - Verified: No artificial limit anywhere in the code. Limited only by localStorage quota (~5-10MB depending on browser).

### Edge Cases Status

- [x] EC-1: Empty or whitespace-only list name -- create/rename action is disabled or shows validation.
  - **Create (sidebar):** Button disabled via `disabled={!newListName.trim()}` (line 99). `handleCreate` also checks `if (!trimmed) return`.
  - **Create (empty state):** Button disabled via `disabled={!name.trim()}` (line 54). `handleCreate` also checks.
  - **Rename:** Save button disabled via `disabled={!name.trim()}` (line 76). `handleSubmit` also checks `if (!trimmed || !list) return`.

- [x] EC-2: Duplicate list names -- allowed.
  - Verified: No uniqueness check on names anywhere. Only IDs are unique (UUID).

- [x] EC-3: Deleting the currently selected list -- app selects next available or shows empty state.
  - Verified in `use-list-store.ts` `deleteList` (line 82-87): If the deleted list is the selected one, `newSelectedId` is set to `updated[0].id` (first remaining list) or `null` (triggers empty state).

- [x] EC-4: localStorage corrupted or unreadable -- shows error with "Reset App" button.
  - Verified: `loadLists` uses `listsSchema.parse()` which throws on invalid data. `useListStore` catches this and sets `storageError = true`. `page.tsx` renders `<StorageError onReset={handleReset} />` when `storageError` is true. Reset clears all localStorage keys.

- [x] EC-5: Very long list names -- visually truncated, full name preserved.
  - Verified in `list-sidebar.tsx` line 116: `<span className="truncate">`. In `list-content.tsx` header line 299: `<h2 className="... truncate">`. Full name preserved in localStorage (no character limit).

### Bugs Found

#### BUG-PROJ1-1: `selectList` does not handle localStorage write failure
- **Severity:** Low
- **Location:** `src/hooks/use-list-store.ts` lines 95-101
- **Description:** The `selectList` function calls `saveSelectedListId(id)` directly without a try-catch. All other state-mutating functions use the `persist` helper which wraps writes in try-catch. If localStorage is full or unavailable when a user clicks a different list, an unhandled exception will be thrown.
- **Steps to Reproduce:**
  1. Fill localStorage to near-capacity
  2. Click a different list in the sidebar
  3. Expected: Graceful error toast
  4. Actual: Unhandled exception, potential app crash
- **Priority:** Low (unlikely scenario, non-destructive)

#### BUG-PROJ1-2: Stale closure in `createList` can lose data on rapid list creation
- **Severity:** Medium
- **Location:** `src/hooks/use-list-store.ts` lines 48-63
- **Description:** `createList` closes over `lists` from the last render. If called twice rapidly before a re-render, the second call uses a stale `lists` array, causing the first created list to be overwritten in localStorage. The same pattern affects `renameList` and `deleteList`, though rapid-fire rename/delete is far less likely than rapid-fire creation.
- **Steps to Reproduce:**
  1. Click "New List" twice very quickly (or programmatically call createList twice)
  2. Expected: Two new lists are created
  3. Actual: Only the second list is saved (first is overwritten in localStorage)
- **Fix Suggestion:** Use functional state updates: `setLists(prev => [...prev, newList])` and persist inside the functional updater, or use `useReducer`.
- **Priority:** Medium (data loss possible, though unlikely with normal usage)

#### BUG-PROJ1-3: `deleteTodosForList` error handling inconsistency
- **Severity:** Low
- **Location:** `src/hooks/use-todo-store.ts` lines 80-87
- **Description:** In `deleteTodosForList`, `setTodos(updated)` is called BEFORE `persist(updated)`. If `persist` throws (storage full), the React state will be updated but localStorage will not match. The UI shows todos as deleted, but on page reload they will reappear. All other functions in the store call `persist` first, then `setTodos`.
- **Steps to Reproduce:**
  1. Have a list with todos
  2. Make localStorage near full
  3. Delete the list
  4. The list deletion succeeds (useListStore persist), but todo cleanup fails silently
  5. Reload: orphaned todos remain in localStorage
- **Priority:** Low (edge case, but causes data inconsistency)

### Security Analysis

- **XSS via list names:** NOT vulnerable. React JSX auto-escapes HTML in `{list.name}`. List names rendered via `{list.name}` in sidebar and header are safe.
- **localStorage manipulation:** An attacker with access to DevTools can modify localStorage directly. However, zod schema validation on load (`listsSchema.parse`) will catch structurally invalid data and trigger the error state. This is appropriate for a client-side-only app.
- **Prototype pollution:** Not a concern. `JSON.parse` does not invoke prototype methods, and zod validation strips unknown keys.
- **No rate limiting needed:** Client-side only app with no server communication.

### Accessibility Analysis

- Sidebar uses shadcn/ui `Sidebar` component with built-in keyboard support
- Dropdown menus use Radix UI (via shadcn/ui) with proper `aria` attributes
- `SidebarMenuAction` has `showOnHover` which hides actions visually but they remain accessible via keyboard
- `sr-only` spans present for "New List" button and action buttons
- Delete dialog uses `AlertDialog` (accessible by default with focus trapping)
- Rename dialog uses `Dialog` with proper `Label` element
- Keyboard: Escape closes dialogs and cancels list creation forms

### Summary
- 13/13 Acceptance Criteria passed
- 5/5 Edge Cases passed
- 3 Bugs found (0 Critical, 1 Medium, 2 Low)
- Production-Ready: YES (no critical or high-severity bugs; medium bug is unlikely in normal usage)
