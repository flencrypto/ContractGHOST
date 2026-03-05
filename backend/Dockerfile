FROM python:3.11-slim

WORKDIR /app

# Copy backend source into /app/backend/ so the Python package structure
# matches the import paths used throughout the codebase (from backend.X import …).
COPY requirements.txt ./backend/
RUN pip install --no-cache-dir -r ./backend/requirements.txt

COPY . ./backend/

# Make the workspace root the Python path so "from backend.X import …" resolves.
ENV PYTHONPATH=/app

EXPOSE 8000

CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
