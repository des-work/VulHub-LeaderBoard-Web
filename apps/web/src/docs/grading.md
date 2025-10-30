# Grading System

The grading system lets graders review student submissions, award points, and update the live leaderboard instantly.

## Roles
- Grader/Admin: Access to `/grading` to review and grade
- Student: Submits proof for activities (files, notes, activity name)

## Pages
- `/grading`: Protected console for graders
  - Filters: Text (student, activity, description), status, refresh
  - Table: Submission date, student, activity, status, points, actions
  - Grade modal: Approve/Reject, points to award, feedback

## Flow
1) Student submits proof via Submission form
2) Grader opens `/grading`, searches/filters
3) Click Review/Grade → Approve or Reject
4) On Approve: points are awarded and leaderboard updates in real time

## Points & Leaderboard
- Grading awards `pointsAwarded` to the student on `approved`
- The `AuthProvider` exposes `updateUserPoints(userId, delta)`; grading calls this
- Leaderboard recalculates rankings after point updates

## Data Model
- Submission: files, activity name/id, description, status (`pending|approved|rejected`), timestamps, feedback, pointsAwarded
- GradeEvent: emitted after grade with `deltaPoints` and `newTotalPoints`

## Error Handling
- LocalStorage-backed persistence by default (replaceable with API)
- Clean UI messages; grading operations are idempotent (regrading overwrites previous review)

## Extend
- Replace storage with backend API
- Add bulk grading, audit logs, and rubrics
- Auto-award badges based on approved submissions
