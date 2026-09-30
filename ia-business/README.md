# IA Business Sync

Source de vérité partagée entre l'orchestrateur ChatGPT/cloud et les workers locaux.

## Boucle
1. L'orchestrateur écrit une tâche structurée dans `queue/`.
2. Le worker local récupère la branche `ia-business-sync`.
3. Il verrouille le dépôt et crée/utilise une branche de travail dédiée.
4. Il exécute seulement les actions autorisées, teste et écrit un rapport dans `results/`.
5. Il synchronise le résultat vers cette branche.
6. L'orchestrateur lit le rapport et décide de la suite ou demande une validation humaine.

## Garde-fous
- Ne jamais travailler directement sur main.
- Vérifier le dépôt et le working tree avant toute écriture.
- Aucun achat, publication finale, donnée sensible ou décision commerciale/créative majeure sans validation humaine.
- Toute exécution doit produire un résultat vérifiable; ne jamais inventer un progrès.
- Les opérations gratuites, réversibles et déjà autorisées peuvent avancer automatiquement.
