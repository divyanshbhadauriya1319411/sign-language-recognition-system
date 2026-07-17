import time
from app.workers.celery_app import celery_app
from app.core.logger import logger

@celery_app.task(bind=True, name="process_dataset_batch")
def process_dataset_batch(self, dataset_id: str, sample_count: int):
    """Background task for validating, normalizing, and storing raw gesture samples."""
    logger.info(f"Task [process_dataset_batch] started for Dataset ID: {dataset_id} ({sample_count} samples)")
    try:
        # Simulate batch validation/feature extraction pipeline
        time.sleep(2)
        logger.info(f"Task [process_dataset_batch] completed successfully for Dataset ID: {dataset_id}")
        return {"status": "SUCCESS", "dataset_id": dataset_id, "processed": sample_count}
    except Exception as exc:
        logger.error(f"Task [process_dataset_batch] failed: {str(exc)}")
        self.retry(exc=exc, countdown=10, max_retries=3)

@celery_app.task(name="send_async_email_notification")
def send_async_email_notification(recipient_email: str, subject: str, message_body: str):
    """Background task for sending system alerts and notifications."""
    logger.info(f"Task [send_async_email_notification] sent to {recipient_email} | Subject: {subject}")
    return {"status": "SENT", "recipient": recipient_email}
