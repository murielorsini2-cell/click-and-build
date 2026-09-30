# Queue

Chaque tâche est un fichier JSON immuable nommé `TASK-<id>.json`. Le worker local ne doit exécuter que les tâches dont `status` vaut `ready` et dont les garde-fous sont satisfaits.
