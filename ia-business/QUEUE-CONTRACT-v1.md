# IA Business Queue Contract v1.2

Status: proven baseline after TASK-0004 passed on 2026-09-30.

This contract documents the task shape compatible with the installed local worker after anti-replay/expiry hardening and activation of the first useful read-only diagnostic. It does not grant permissions beyond the installed worker allowlist.

## Required fields

- `id`: unique task identifier, e.g. `TASK-0005`
- `kind`: must be an explicitly allowlisted kind
- `status`: must be `ready`
- `target_repo`: must be `click-and-build`
- `target_branch`: must be `ia-business-test`
- `risk`: must be `low`
- `cost_allowed`: must be `0`
- `requires_human_approval`: must be `false`
- `created_at`: UTC timestamp for task creation
- `expires_at`: UTC timestamp after which the task must be rejected without execution
- `instructions`: array matching the exact contract for the selected kind
- `success_criteria`: array of verifiable criteria

## Allowlisted kinds

### `bridge_self_test`

Harmless bridge validation. It remains available for infrastructure checks.

### `repo_readonly_diagnostic`

Static read-only inspection of the tracked immutable repository snapshot. Its instruction contract is intentionally narrow.

The `instructions` array must contain exactly:

```text
Inspect tracked project files and Git state without modifying project files.
```

Free-form diagnostic instructions are not accepted. TASK-0004 initially failed validation with `unsupported_diagnostic_instructions` because its instructions were broader. After changing only the instruction contract to the exact allowed sentence, the scheduled worker accepted and completed the task automatically.

The diagnostic may inspect Git state, tracked repository structure, and fixed-scope text files. It must not run project scripts, tests, builds, dependency installation, browsers, arbitrary commands, or network calls as part of the diagnostic handler. Its output is static evidence only and does not certify runtime behavior.

## Canonical repo_readonly_diagnostic example

```json
{
  "id": "TASK-XXXX",
  "kind": "repo_readonly_diagnostic",
  "status": "ready",
  "target_repo": "click-and-build",
  "target_branch": "ia-business-test",
  "risk": "low",
  "cost_allowed": 0,
  "requires_human_approval": false,
  "created_at": "YYYY-MM-DDTHH:MM:SS.sssZ",
  "expires_at": "YYYY-MM-DDTHH:MM:SS.sssZ",
  "instructions": [
    "Inspect tracked project files and Git state without modifying project files."
  ],
  "success_criteria": [
    "Structured diagnostic delivered to ia-business/results/TASK-XXXX.json",
    "main unchanged",
    "gameplay files unchanged",
    "No cost and no arbitrary command execution"
  ]
}
```

## Known incompatible aliases

Do not substitute:
- `repository` for `target_repo`
- `purpose` for `instructions`
- `expected` for `success_criteria`

TASK-0003 initially used those aliases and was not executed. After conversion to the proven field names, the scheduled worker discovered it and returned a passing result.

## Replay and expiry guarantees

- A task ID must not be executed more than once.
- Local persistent state protects against replay across worker runs.
- A task with an expired `expires_at` must be rejected without execution.
- After an uncertain interruption, the worker fails closed rather than risking duplicate execution.
- `created_at` and `expires_at` are mandatory UTC timestamps for new tasks.

## Safety invariants

The baseline remains fail-closed: no cost, low risk, no human-approval-required task, no `main` execution, no gameplay modification, and no automatic command type beyond the worker's explicit allowlist. Every new capability requires its own narrow contract and tests before activation.

## Validation evidence

Worker anti-replay/expiry hardening completed on 2026-09-30: 8 automated tests passed, 0 failed; one real valid task executed exactly once; an expired task was rejected without execution; a third pass produced no replay; main and gameplay remained unchanged.

Read-only diagnostic hardening then passed 13 tests, including refusal of writes, arbitrary commands, wrong branch, expiry, and replay.

TASK-0004 provided the first real useful end-to-end proof:
- `status: completed`
- `final_status: passed`
- verified at `2026-09-30T20:29:18.210Z`
- branch `ia-business-test`
- working tree clean
- main unchanged at `b526ef57418be05ba9f10cfa8f6b75724d216a4e`
- `gameplay_unchanged: passed`
- only `ia-business/results/TASK-0004.json` was delivered
- cost `0`
- result pushed to `ia-business-sync` and independently readable from ChatGPT

Proven loop: ChatGPT -> GitHub queue -> scheduled local worker -> strict validation -> local read-only execution -> safety checks -> GitHub result -> ChatGPT verification.
