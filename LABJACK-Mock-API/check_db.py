import sqlite3
from pathlib import Path

db_path = Path("sensors.db")

if not db_path.exists():
    print("No sensors.db file found.")
    raise SystemExit(0)

with sqlite3.connect(db_path) as conn:
    c = conn.cursor()

    c.execute("SELECT COUNT(*) FROM sensor_data")
    count = c.fetchone()[0]
    print(f"Total records: {count}")

    if count > 0:
        c.execute("SELECT * FROM sensor_data ORDER BY id DESC LIMIT 5")
        for row in c.fetchall():
            print(row)
    else:
        print("No data found.")
