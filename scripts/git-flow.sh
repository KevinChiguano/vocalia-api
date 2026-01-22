#!/bin/bash

echo "Tipo de cambio:"
echo "1) feature"
echo "2) fix"
echo "3) refactor"
echo "4) chore"
echo "5) docs"
echo "6) test"

read -p "Selecciona (1-6): " type

case $type in
  1) PREFIX="feature"; COMMIT="feat" ;;
  2) PREFIX="fix"; COMMIT="fix" ;;
  3) PREFIX="refactor"; COMMIT="refactor" ;;
  4) PREFIX="chore"; COMMIT="chore" ;;
  5) PREFIX="docs"; COMMIT="docs" ;;
  6) PREFIX="test"; COMMIT="test" ;;
  *) echo "Opción inválida"; exit 1 ;;
esac

read -p "Nombre corto (ej: user-auth): " NAME
read -p "Mensaje del commit: " MESSAGE

git checkout main
git pull origin main
git checkout -b "$PREFIX/$NAME"

git add .
git commit -m "$COMMIT: $MESSAGE"
git push -u origin "$PREFIX/$NAME"
