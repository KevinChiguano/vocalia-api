Write-Host "Tipo de cambio:"
Write-Host "1) feature"
Write-Host "2) fix"
Write-Host "3) refactor"
Write-Host "4) chore"
Write-Host "5) docs"
Write-Host "6) test"

$type = Read-Host "Selecciona (1-6)"

switch ($type) {
    1 { $prefix = "feature"; $commit = "feat" }
    2 { $prefix = "fix"; $commit = "fix" }
    3 { $prefix = "refactor"; $commit = "refactor" }
    4 { $prefix = "chore"; $commit = "chore" }
    5 { $prefix = "docs"; $commit = "docs" }
    6 { $prefix = "test"; $commit = "test" }
    default { Write-Error "Opción inválida"; exit }
}

$name = Read-Host "Nombre corto de la rama (ej: github-standards)"
$message = Read-Host "Mensaje del commit"

git checkout main
git pull origin main
git checkout -b "$prefix/$name"

git add .
git commit -m "${commit}: $message"
git push -u origin "$prefix/$name"
