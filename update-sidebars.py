from pathlib import Path
import re
import shutil

STATIC_DIR = Path("src/main/resources/static")

PAGES = [
    {
        "file": "index.html",
        "href": "/index.html",
        "label": "Dashboard",
        "icon": "&#8962;"
    },
    {
        "file": "identity.html",
        "href": "/identity.html",
        "label": "Identidad",
        "icon": "&#128100;"
    },
    {
        "file": "members.html",
        "href": "/members.html",
        "label": "Deportistas",
        "icon": "&#127939;"
    },
    {
        "file": "health-records.html",
        "href": "/health-records.html",
        "label": "Expediente Clínico",
        "icon": "&#9829;"
    },
    {
        "file": "physical-assessments.html",
        "href": "/physical-assessments.html",
        "label": "Evaluación Física",
        "icon": "&#128170;"
    },
    {
        "file": "training-routines.html",
        "href": "/training-routines.html",
        "label": "Rutinas",
        "icon": "&#127942;"
    },
    {
        "file": "nutrition.html",
        "href": "/nutrition.html",
        "label": "Nutrición",
        "icon": "&#9673;"
    },
    {
        "file": "analytics.html",
        "href": "/analytics.html",
        "label": "Analítica",
        "icon": "&#128200;"
    }
]

TARGET_FILES = [
    "index.html",
    "identity.html",
    "members.html",
    "health-records.html",
    "physical-assessments.html",
    "training-routines.html",
    "nutrition.html",
    "analytics.html"
]


def build_navigation(current_filename: str) -> str:
    lines = ['        <nav class="navigation">', '']

    for page in PAGES:
        classes = ["nav-item"]

        if page["file"] == current_filename:
            classes.append("active")

        class_value = " ".join(classes)

        lines.extend([
            f'            <a href="{page["href"]}" class="{class_value}">',
            f'                <span class="nav-icon">{page["icon"]}</span>',
            f'                <span class="nav-label">{page["label"]}</span>',
            '            </a>',
            ''
        ])

    lines.append('        </nav>')

    return "\n".join(lines)


def create_analytics_placeholder() -> None:
    analytics_file = STATIC_DIR / "analytics.html"

    if analytics_file.exists():
        return

    navigation = build_navigation("analytics.html")

    content = f"""<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>Analítica | SMARTGYM Health Track</title>

    <link rel="stylesheet" href="/css/styles.css?v=18">
    <link rel="stylesheet" href="/css/enterprise.css?v=18">
</head>

<body>

<div class="app-layout">

    <aside class="sidebar">

        <div class="brand">

            <div class="brand-icon">
                SG
            </div>

            <div>
                <h1>SMARTGYM</h1>
                <span>Health Track</span>
            </div>

        </div>

{navigation}

        <div class="sidebar-footer">
            <strong>SMARTGYM</strong>
            <small>Versión 1.0.0</small>
        </div>

    </aside>

    <main class="main-content">

        <header class="topbar">

            <div>
                <p class="eyebrow">
                    Inteligencia institucional
                </p>

                <h2>
                    Analítica
                </h2>
            </div>

            <div class="user-area">

                <div class="status-indicator">
                    <span class="status-dot"></span>
                    Sistema activo
                </div>

                <div class="avatar">
                    AC
                </div>

            </div>

        </header>

        <section class="hero">

            <div>

                <p class="eyebrow">
                    SMARTGYM Health Track
                </p>

                <h3>
                    Analítica deportiva y clínica
                </h3>

                <p>
                    Este módulo integrará indicadores de deportistas,
                    evaluaciones físicas, expedientes clínicos,
                    entrenamiento y nutrición.
                </p>

            </div>

            <div class="hero-badge">
                <span>AN</span>
                <small>Módulo en construcción</small>
            </div>

        </section>

        <section class="content-card">

            <div class="section-header">

                <div>
                    <p class="eyebrow">
                        Próxima fase
                    </p>

                    <h3>
                        Dashboard analítico
                    </h3>
                </div>

            </div>

            <div class="loading-message">
                El módulo de Analítica está preparado para
                su siguiente etapa de implementación.
            </div>

        </section>

    </main>

</div>

</body>
</html>
"""

    analytics_file.write_text(content, encoding="utf-8")

    print(f"CREADO: {analytics_file}")


def update_file(filename: str) -> None:
    file_path = STATIC_DIR / filename

    if not file_path.exists():
        print(f"OMITIDO: {file_path} no existe")
        return

    content = file_path.read_text(encoding="utf-8")

    pattern = re.compile(
        r'<nav\s+class=["\']navigation["\']\s*>.*?</nav>',
        re.IGNORECASE | re.DOTALL
    )

    navigation = build_navigation(filename)

    if not pattern.search(content):
        print(
            f"OMITIDO: {file_path} no contiene "
            '<nav class="navigation">'
        )
        return

    backup_path = file_path.with_suffix(
        file_path.suffix + ".bak"
    )

    shutil.copy2(file_path, backup_path)

    updated_content, replacements = pattern.subn(
        navigation,
        content,
        count=1
    )

    file_path.write_text(
        updated_content,
        encoding="utf-8"
    )

    print(
        f"ACTUALIZADO: {file_path} "
        f"({replacements} menú reemplazado)"
    )


def main() -> None:
    if not STATIC_DIR.exists():
        raise SystemExit(
            f"No existe la carpeta: {STATIC_DIR}"
        )

    create_analytics_placeholder()

    for filename in TARGET_FILES:
        update_file(filename)

    print("")
    print("Menús laterales actualizados correctamente.")
    print("Se crearon copias .bak de los archivos modificados.")


if __name__ == "__main__":
    main()
