# Vakyom

## Current State
Admin panel has 4 tabs: Users, Lawyers, Feedback, Cases. All are read-only -- admin can view but cannot delete or manage users or lawyers.

## Requested Changes (Diff)

### Add
- Backend: `deleteUser(principalId: Principal): async Bool` -- removes user from users map
- Backend: `deleteLawyer(principalId: Principal): async Bool` -- removes lawyer from lawyers map
- Frontend: Delete button on each user row in the Users tab
- Frontend: Delete button on each lawyer card in the Lawyers tab
- Frontend: Confirmation dialog before deleting (to prevent accidental deletes)
- Frontend: Optimistic UI update after successful delete (removes entry from list)

### Modify
- AdminScreen.tsx: Add delete mutation hooks, confirmation state, and delete UI in Users and Lawyers tabs
- main.mo: Add deleteUser and deleteLawyer functions

### Remove
Nothing removed.

## Implementation Plan
1. Add `deleteUser` and `deleteLawyer` to main.mo
2. Regenerate backend bindings
3. Add delete button + confirmation dialog to Users tab rows
4. Add delete button + confirmation dialog to Lawyer cards
5. Wire useMutation for both delete actions with cache invalidation
