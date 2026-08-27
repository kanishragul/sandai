# Backend for Sandai

This folder contains a minimal Flask backend API to support the frontend static site.

Quick start

1. Create and activate a virtual environment (recommended):

```bash
python3 -m venv venv
source venv/bin/activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Run the app (creates SQLite DB automatically):

```bash
python app.py
```

The API will run on `http://127.0.0.1:5000` and expose endpoints under `/api`.

Files

- `app.py` — application and runner
- `config.py` — configuration
- `models.py` — SQLAlchemy models and DB helpers
- `routes.py` — API routes (auth, teams, fixtures, results, announcements, contact)
- `utils.py` — helper utilities
- `requirements.txt` — Python dependencies

Notes

- Database: SQLite file at `instance/app.db` (created automatically).
- Secrets: `SECRET_KEY` and `JWT_SECRET_KEY` default to values in `config.py`; override via environment variables.
