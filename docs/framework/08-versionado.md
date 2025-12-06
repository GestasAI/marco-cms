# 📦 Versionado en GestasAI

**Versión**: 1.0  
**Fecha**: 22 de Noviembre de 2025

---

## 🎯 Semantic Versioning

GestasAI sigue **Semantic Versioning 2.0.0**: `MAJOR.MINOR.PATCH`

### Formato
```
1.2.3
│ │ │
│ │ └─ PATCH: Bug fixes
│ └─── MINOR: New features (backward compatible)
└───── MAJOR: Breaking changes
```

### Ejemplos
- `1.0.0` → Primera versión estable
- `1.1.0` → Nuevo plugin añadido
- `1.1.1` → Bug fix en autenticación
- `2.0.0` → Cambio en API (breaking change)

---

## 🔖 Git Workflow

### Branches
- `main` - Producción (siempre estable)
- `develop` - Desarrollo (integración)
- `feature/*` - Nuevas funcionalidades
- `fix/*` - Bug fixes
- `hotfix/*` - Fixes urgentes en producción

### Commits
Formato: `<tipo>(<scope>): <mensaje>`

**Tipos**:
- `feat` - Nueva funcionalidad
- `fix` - Bug fix
- `docs` - Documentación
- `refactor` - Refactorización
- `test` - Tests
- `chore` - Tareas de mantenimiento

**Ejemplos**:
```
feat(auth): add OAuth Google integration
fix(users): resolve email validation issue
docs(api): update endpoint documentation
refactor(cms): split PageService into smaller functions
```

---

## 📝 Changelog

Mantener `CHANGELOG.md` actualizado:

```markdown
# Changelog

## [1.2.0] - 2025-11-22

### Added
- Plugin CMS con editor visual
- Soporte para OAuth Google

### Fixed
- Bug en validación de emails
- Error en paginación de usuarios

### Changed
- Mejorado performance de queries

## [1.1.0] - 2025-11-15
...
```

---

## 🚀 Releases

### Proceso
1. Crear tag: `git tag v1.2.0`
2. Push tag: `git push origin v1.2.0`
3. Crear release en GitHub
4. Actualizar CHANGELOG.md
5. Deploy a producción

### Release Notes
Incluir:
- Nuevas funcionalidades
- Bug fixes
- Breaking changes
- Migration guide (si aplica)

---

**Última actualización**: 22 de Noviembre de 2025
