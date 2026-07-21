# Modo: apply — Asistente de Aplicación en Vivo

Modo interactivo para cuando el candidato está rellenando un formulario de aplicación en Chrome. Lee lo que hay en pantalla, carga el contexto previo de la oferta, y genera respuestas personalizadas para cada pregunta del formulario.

## Requisitos

- **Mejor con Playwright visible**: En modo visible, el candidato ve el navegador y Claude puede interactuar con la página.
- **Sin Playwright**: el candidato comparte un screenshot o pega las preguntas manualmente.

## Workflow

```
1. DETECTAR    → Leer Chrome tab activa (screenshot/URL/título)
2. IDENTIFICAR → Extraer empresa + rol de la página
3. BUSCAR      → Match contra reports existentes en reports/
4. CARGAR      → Leer report completo + Section G (si existe)
5. COMPARAR    → ¿El rol en pantalla coincide con el evaluado? Si cambió → avisar
6. ANALIZAR    → Identificar TODAS las preguntas del formulario visibles
7. GENERAR     → Para cada pregunta, generar respuesta personalizada
8. PRESENTAR   → Mostrar respuestas formateadas para copy-paste
```

## Paso 1 — Detectar la oferta

**Con Playwright:** Tomar snapshot de la página activa. Leer título, URL, y contenido visible.

**Sin Playwright:** Pedir al candidato que:
- Comparta un screenshot del formulario (Read tool lee imágenes)
- O pegue las preguntas del formulario como texto
- O diga empresa + rol para que lo busquemos

## Paso 2 — Identificar y buscar contexto

1. Extraer nombre de empresa y título del rol de la página
2. Buscar en `reports/` por nombre de empresa (Grep case-insensitive)
3. Si hay match → cargar el report completo
4. Si hay Section G → cargar los draft answers previos como base
5. Si NO hay match → avisar y ofrecer ejecutar auto-pipeline rápido

## Paso 3 — Detectar cambios en el rol

Si el rol en pantalla difiere del evaluado:
- **Avisar al candidato**: "El rol ha cambiado de [X] a [Y]. ¿Quieres que re-evalúe o adapto las respuestas al nuevo título?"
- **Si adaptar**: Ajustar las respuestas al nuevo rol sin re-evaluar
- **Si re-evaluar**: Ejecutar evaluación A-F completa, actualizar report, regenerar Section G
- **Actualizar tracker**: Cambiar título del rol en applications.md si procede

## Paso 4 — Analizar preguntas del formulario

Identificar TODAS las preguntas visibles:
- Campos de texto libre (cover letter, why this role, etc.)
- Dropdowns (how did you hear, work authorization, etc.)
- Yes/No (relocation, visa, etc.)
- Campos de salario (range, expectation)
- Upload fields (resume, cover letter PDF)

Clasificar cada pregunta:
- **Ya respondida en Section G** → adaptar la respuesta existente
- **Nueva pregunta** → generar respuesta desde el report + cv.md

## Paso 5 — Generar respuestas

Para cada pregunta, generar la respuesta siguiendo:

1. **Contexto del report**: Usar proof points del bloque B, historias STAR del bloque F
2. **Section G previa**: Si existe una respuesta draft, usarla como base y refinar
3. **Tono "I'm choosing you"**: Mismo framework del auto-pipeline
4. **Especificidad**: Referenciar algo concreto del JD visible en pantalla
5. **career-ops proof point**: Incluir en "Additional info" si hay campo para ello

**Formato de output:**

```
## Respuestas para [Empresa] — [Rol]

Basado en: Report #NNN | Score: X.X/5 | Arquetipo: [tipo]

---

### 1. [Pregunta exacta del formulario]
> [Respuesta lista para copy-paste]

### 2. [Siguiente pregunta]
> [Respuesta]

...

---

Notas:
- [Cualquier observación sobre el rol, cambios, etc.]
- [Sugerencias de personalización que el candidato debería revisar]
```

## Verification gate (before any Submit)

Read `config/profile.yml` → `application` before filling or submitting.

| Check | Required when |
|-------|----------------|
| Report exists for this company+role | Always |
| Tailored PDF generated (or user waived) | Always |
| Form answers drafted (Section G or Paso 5) | Always |
| User reviewed report + PDF + answers | `require_explicit_confirm: true` |
| User said to submit (e.g. "verified, submit", "go ahead and apply") | `require_explicit_confirm: true` |
| Playwright liveness: title + JD + active Apply/Submit | `require_liveness_check: true` |
| Score ≥ `min_score_to_submit` | Always (default 4.0); below only with explicit override |
| No duplicate `Applied` for same company+role | Always |

Present a short checklist to the user when `require_explicit_confirm` is true:

```
Ready to submit — [Company] — [Role] (Score X.X/5)
☑ Liveness verified
☑ PDF: [path]
☑ Answers drafted (N questions)
Confirm: reply "verified, submit" to proceed, or edit anything first.
```

## Paso 6 — Submit on behalf (when enabled)

**Only if** `application.auto_submit_after_verification: true` **and** the verification gate above passes.

1. **Playwright (visible preferred):** Navigate to application URL
2. **Upload** tailored PDF from `output/` (and cover letter PDF if generated)
3. **Fill** fields using Paso 5 answers; use profile.yml for contact fields (name, email, phone, LinkedIn)
4. **Review** filled values in snapshot — do not invent data not in cv.md / profile / report
5. **Click** Submit / Apply / Send (or locale equivalent)
6. **Confirm** success page or confirmation email mention in snapshot
7. If `screenshot_on_submit: true`, save annotated screenshot path in report notes

**If submit fails** (captcha, login wall, broken form): stop, document error, leave status as `Evaluated`, tell user what to complete manually.

**If `auto_submit_after_verification` is false:** stop after Paso 5 — user submits manually.

## Paso 7 — Post-apply

After successful submit (agent or user):
1. Update status in `applications.md` to `Applied` (edit existing row or merge TSV)
2. Update report notes with submission date + channel (e.g. LinkedIn, Greenhouse)
3. Persist final form answers in report (Section G / H)
4. Suggest `/career-ops contacto` for LinkedIn outreach if relevant

## Scroll handling

Si el formulario tiene más preguntas que las visibles:
- Pedir al candidato que haga scroll y comparta otro screenshot
- O que pegue las preguntas restantes
- Procesar en iteraciones hasta cubrir todo el formulario
