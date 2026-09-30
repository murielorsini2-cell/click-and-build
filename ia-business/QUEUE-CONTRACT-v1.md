# IA Business Queue Contract v1.3

Status: proven baseline after TASK-0005 passed on 2026-09-30.

This contract documents the task shape compatible with the installed local worker after anti-replay/expiry hardening and activation of two useful read-only diagnostic capabilities. It does not grant permissions beyond the installed worker allowlist.

## Required fields

- `id`: unique task identifier, e.g. `TASK-0006`
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

Static read-only inspection of the tracked immutable repository snapshot.

The `instructions` array must contain exactly:

```text
Inspect tracked project files and Git state without modifying project files.
```

Free-form diagnostic instructions are not accepted. TASK-0004 initially failed validation with `unsupported_diagnostic_instructions`; after changing only the instruction contract to the exact allowed sentence, the scheduled worker accepted and completed it automatically.

### `repo_targeted_code_diagnostic`

Targeted static read-only inspection for the currently authorized baby-customization question.

The `instructions` array must contain exactly:

```text
Statically trace baby sex/gender, eye and hair customization representation, storage and application in tracked source files; report observable data-flow inconsistencies without executing or modifying project code.
```

The `success_criteria` array must contain exactly:

```text
Return file and line evidence for baby customization data flow and candidate inconsistencies.
```

The handler reads only tracked files from the immutable snapshot and returns static evidence. It does not execute or modify project code, install dependencies, build, start a server/browser, accept arbitrary task commands, or make network calls from the diagnostic handler.

## Canonical targeted diagnostic example

```json
{
  "id": "TASK-XXXX",
  "kind": "repo_targeted_code_diagnostic",
  "status": "ready",
  "target_repo": "click-and-build",
  "target_branch": "ia-business-test",
  "risk": "low",
  "cost_allowed": 0,
  "requires_human_approval": false,
  "created_at": "YYYY-MM-DDTHH:mm:ss.sssZ",
  "expires_at": "YYYY-MM-DDTHH:mm:ss.sssZ",
  "instructions": [
    "Statically trace baby sex/gender, eye and hair customization representation, storage and application in tracked source files; report observable data-flow inconsistencies without executing or modifying project code."
  ],
  "success_criteria": [
    "Return file and line evidence for baby customization data flow and candidate inconsistencies."
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

Worker anti-replay/expiry hardening completed on 2026-09-30: 8 automated tests passed, 0 failed.

Read-only diagnostic hardening passed 13 tests. TASK-0004 then proved the generic read-only diagnostic end-to-end.

Targeted code diagnostic hardening passed 21 tests, 0 failed, covering the valid task and refusals for wrong instruction, attempted write, arbitrary command, wrong branch, expiry and replay.

TASK-0005 provided the first real targeted static-analysis proof:
- `status: completed`
- `final_status: passed`
- verified at `2026-09-30T21:44:16.905Z`
- execution ID `b9e30cc0-871f-4dcd-b952-2d234204c8d0`
- source sync commit `6ff115dd07d81ecac050a89e3aa302ed9c37f061`
- task blob `eef995bf2163b8abe3843b1aad2d57baece8070b`
- branch `ia-business-test`
- analyzed snapshot `20c1cc29cb2ffd59826f01114cf0b281e88ddf08`
- working tree clean
- main unchanged at `b526ef57418be05ba9f10cfa8f6b75724d216a4e`
- `gameplay_unchanged: passed`
- only `ia-business/results/TASK-0005.json` was modified
- cost `0`

TASK-0005 found no tracked evidence in its inspected snapshot for `gender`, `eyes`, or `hair`; flow, storage operations, DOM references, and evidence were empty. This is a scope observation, not proof of a runtime bug. It indicates that the snapshot currently inspected by `ia-business-test` does not expose the evolved baby-customization implementation expected from prior gameplay work. The next capability/scope change must safely identify or inspect the correct gameplay snapshot before proposing fixes.

Proven loop: ChatGPT -> GitHub queue -> scheduled local worker -> strict validation -> local read-only targeted analysis -> safety checks -> GitHub result -> ChatGPT verification.
