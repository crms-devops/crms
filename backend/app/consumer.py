import asyncio
import json
import logging
import os
from aiokafka import AIOKafkaConsumer

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

KAFKA_BOOTSTRAP_SERVERS = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092")


async def process_result_event(event: dict):
    """Process a result published event — send notification to student."""
    register_number = event.get("register_number")
    subject_code = event.get("subject_code")
    result_status = event.get("result_status")

    # In production: send email/SMS via AWS SES/SNS
    # For now: log the notification
    logger.info(
        f"NOTIFICATION: Student {register_number} — "
        f"{subject_code} result: {result_status}"
    )


async def consume():
    consumer = AIOKafkaConsumer(
        "result-published",
        bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
        group_id="crms-notification-consumer",
        value_deserializer=lambda v: json.loads(v.decode())
    )

    logger.info("Starting Kafka consumer...")
    await consumer.start()

    try:
        async for message in consumer:
            logger.info(f"Received event: {message.value}")
            await process_result_event(message.value)
    except Exception as e:
        logger.error(f"Consumer error: {e}")
    finally:
        await consumer.stop()


if __name__ == "__main__":
    asyncio.run(consume())