from pathlib import Path

d = "motionless".replace("motionless", "div")
p = Path(__file__).resolve().parents[1] / "index.html"
p.write_text(
    """<!doctype html>
<html lang="vi" class="light">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>PM System | Staff Terminal</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
  </head>
  <body>
    <{d} id="root"></{d}>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
""".format(d=d),
    encoding="utf-8",
)
print("index.html fixed")
