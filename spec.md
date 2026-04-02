# Vakyom

## Current State
The app has a multi-role login system (User, Lawyer, Admin). The backend stores:
- `UserProfile`: name, phone, principalId
- `LawyerProfile`: name, phone, barNumber, specialization, location, principalId
- `LoginRecord`: name, phone, role, timestamp, principalId

The admin panel has 4 tabs: Users, Lawyers, Login History, Chatbot. Users tab shows a table (name, phone, principalId, delete). Lawyers tab shows cards (name, specialization, bar, location, delete). Login History shows a table (name, phone, role, timestamp).

## Requested Changes (Diff)

### Add
- A summary stats bar at the top of the admin panel showing total users, total lawyers, total logins
- "Registration Date" column/field by capturing loginHistory timestamps per user and lawyer
- Lawyer applicant cards enriched with all stored fields: Bar Council Number, specialization, location, phone, principalId, registration timestamp
- User table enriched with all stored fields: name, phone, principalId, first seen date (from loginHistory)
- A dedicated "Applicants" section or make current Users+Lawyers tabs show data in a full stacked table view with all fields
- Export-friendly dense table layout for both users and lawyers in admin panel

### Modify
- Users tab: change from minimal table to a full data table showing all fields (name, phone, principalId truncated, actions)
- Lawyers tab: change from card grid to a full table showing all fields (name, phone, bar number, specialization, location, principalId truncated, actions) so admin can see everything at a glance
- Login History tab: ensure it shows all columns clearly (name, phone, role badge, timestamp with time, principalId)
- Stats cards at top of admin dashboard to show accurate real-time counts

### Remove
- Nothing removed

## Implementation Plan
1. Update AdminScreen.tsx Users tab to show a comprehensive table with all UserProfile fields
2. Update AdminScreen.tsx Lawyers tab to show a comprehensive table (not cards) with all LawyerProfile fields: name, phone, barNumber, specialization, location, principalId (truncated)
3. Ensure Login History shows all fields in a clean, readable table with role color badges
4. Ensure the stats summary cards at the top of admin dashboard reflect actual data counts (users, lawyers, logins)
5. Keep existing delete functionality intact
