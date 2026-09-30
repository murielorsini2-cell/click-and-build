# IA Business Queue Contract v1

Status: frozen baseline after TASK-0003 passed on 2026-09-30.

This contract documents the exact task shape proven compatible with the installed local worker. It does not expand the worker allowlist or permissions.

## Required fields

- `id`: unique task identifier, e.g. `TASK-0004`
- `kind`: currently only `bridge_self_test` is authorized for automatic execution
- `status`: must be `ready`
- `target_repo`: must be `click-and-build`
- `target_branch`: must be `ia-business-test`
- `risk`: must be `low`
- `cost_allowed`: must be `0`
- `requires_human_approval`: must be `false`
- `instructions`: array of task instructions
- `success_criteria`: array of verifiable criteria

## Canonical example

```json
{
  "id": "TASK-XXXX",
  "kind": "bridge_self_test",
  "status": "ready",
  "target_repo": "click-and-build",
  "target_branch": "ia-business-test",
  "risk": "low",
  "cost_allowed": 0,
  "requires_human_approval": false,
  "instructions": [
    "Harmless bridge self-test. No gameplay changes."
  ],
  "success_criteria": [
    "Structured result delivered to ia-business/results/TASK-XXXX.json",
    "main and gameplay unchanged"
  ]
}
```

## Known incompatible aliases

Do not substitute:
- `repository` for `target_repo`
- `purpose` for `instructions`
- `expected` for `success_criteria`

TASK-0003 initially used those aliases and was not executed. After conversion to this contract, the scheduled worker discovered it and returned a passing result.

## Safety invariants

The baseline remains fail-closed: no cost, low risk, no human-approval-required task, no `main` execution, no gameplay modification, and no automatic command type beyond the worker's current allowlist. A future contract version must be tested before replacing this baseline.
