import json
import logging
import os
from kafka import KafkaConsumer

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

KAFKA_BOOTSTRAP_SERVERS = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092")


def process_result_event(event: dict):
    register_number = event.get("register_number")
    subject_code = event.get("subject_code")
    result_status = event.get("result_status")
    logger.info(
        f"NOTIFICATION: Student {register_number} — "
        f"{subject_code} result: {result_status}"
    )


def consume():
    consumer = KafkaConsumer(
        "result-published",
        bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
        group_id="crms-notification-consumer",
        value_deserializer=lambda v: json.loads(v.decode()),
        auto_offset_reset="earliest"
    )
    logger.info("Starting Kafka consumer...")
    for message in consumer:
        logger.info(f"Received event: {message.value}")
        process_result_event(message.value)


if __name__ == "__main__":
    consume()