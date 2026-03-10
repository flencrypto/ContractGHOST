"""Standalone background worker entry-point.

Runs the APScheduler intelligence-collection jobs independently of the API
server so the workload can be scaled (and deployed) separately in Kubernetes.

Usage::

    python -m backend.worker
"""

import asyncio
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger("align.worker")


async def _main() -> None:
    from backend.services.scheduler import scheduler, setup_scheduler

    # setup_scheduler accepts a FastAPI app object only to register lifespan
    # hooks; passing None is safe because the worker manages its own lifecycle.
    setup_scheduler(None)  # type: ignore[arg-type]

    scheduler.start()
    logger.info("Worker scheduler started – waiting for jobs…")
    try:
        while True:
            await asyncio.sleep(60)
    except (KeyboardInterrupt, SystemExit):
        pass
    finally:
        scheduler.shutdown()
        logger.info("Worker scheduler stopped.")


if __name__ == "__main__":
    asyncio.run(_main())
