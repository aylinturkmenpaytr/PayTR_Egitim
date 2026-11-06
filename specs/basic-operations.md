# TodoMVC Basic Operations Test Plan

## Application Overview

Basic functional coverage for the React TodoMVC demo at https://demo.playwright.dev/todomvc, focused on creating, completing, filtering, editing, and removing todo items. Each test should begin with a clean app state and should not rely on execution order.

## Test Scenarios

### 1. Basic operations

**Seed:** `tests/seed.spec.ts`

#### 1.1. should add a todo and update the remaining count

**File:** `tests/basic-operations/add-todo.spec.ts`

**Steps:**
  1. Open the TodoMVC page in a fresh state.
    - expect: The page shows the heading "todos" and the textbox "What needs to be done?".
  2. Enter "Buy groceries" in the new-todo textbox and press Enter.
    - expect: A todo labeled "Buy groceries" appears in the list.
    - expect: The remaining count shows 1 item left.
    - expect: The textbox is cleared.

#### 1.2. should add multiple todos independently

**File:** `tests/basic-operations/add-multiple-todos.spec.ts`

**Steps:**
  1. Open the TodoMVC page in a fresh state.
    - expect: The todo list is empty.
  2. Add "Buy groceries" and "Walk the dog" one at a time using Enter.
    - expect: Both todos appear as separate list items.
    - expect: The remaining count shows 2 items left.

#### 1.3. should complete and reactivate an individual todo

**File:** `tests/basic-operations/toggle-todo.spec.ts`

**Steps:**
  1. Add a todo named "Read a book".
    - expect: The todo appears with an unchecked completion checkbox.
    - expect: The remaining count is 1 item left.
  2. Check the todo's completion checkbox.
    - expect: The todo is marked completed.
    - expect: The remaining count changes to 0 items.
  3. Uncheck the completion checkbox.
    - expect: The todo is active again.
    - expect: The remaining count returns to 1 item left.

#### 1.4. should toggle all todos between active and completed

**File:** `tests/basic-operations/toggle-all.spec.ts`

**Steps:**
  1. Add two distinct todos.
    - expect: Both todos are active.
  2. Use the "Mark all as complete" checkbox.
    - expect: Both todos are completed.
    - expect: The remaining count shows 0 items.
  3. Use the same checkbox again.
    - expect: Both todos are active.
    - expect: The remaining count shows 2 items left.

#### 1.5. should filter todos by all, active, and completed status

**File:** `tests/basic-operations/filter-todos.spec.ts`

**Steps:**
  1. Add two todos and complete one of them.
    - expect: One todo is active and one is completed.
  2. Select the "Active" filter.
    - expect: Only the active todo is displayed.
  3. Select the "Completed" filter.
    - expect: Only the completed todo is displayed.
  4. Select the "All" filter.
    - expect: Both todos are displayed.

#### 1.6. should edit a todo and save the updated text

**File:** `tests/basic-operations/edit-todo.spec.ts`

**Steps:**
  1. Add a todo named "Old title".
    - expect: The todo is visible in the list.
  2. Double-click the todo text, replace it with "Updated title", and press Enter.
    - expect: The updated title is shown.
    - expect: The old title is no longer shown.
    - expect: The remaining count is unchanged.

#### 1.7. should delete a todo from the list

**File:** `tests/basic-operations/delete-todo.spec.ts`

**Steps:**
  1. Add a todo named "Temporary task".
    - expect: The todo is visible in the list.
  2. Reveal and activate that todo's Delete control.
    - expect: The todo is removed from the list.
    - expect: The remaining count is 0 items.

#### 1.8. should clear completed todos while retaining active todos

**File:** `tests/basic-operations/clear-completed.spec.ts`

**Steps:**
  1. Add two todos and complete exactly one.
    - expect: One todo is completed and one remains active.
  2. Activate the "Clear completed" control.
    - expect: The completed todo is removed.
    - expect: The active todo remains visible.
    - expect: The remaining count is 1 item left.
