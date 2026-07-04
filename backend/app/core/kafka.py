import os
import json
import logging
from aiokafka import AIOKafkaProducer

logger = logging.getLogger(__name__)

KAFKA_BOOTSTRAP_SERVERS = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092")

producer = None


async def start_kafka_producer():
    global producer
    try:
        producer = AIOKafkaProducer(
            bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
            value_serializer=lambda v: json.dumps(v).encode()
        )
        await producer.start()
        logger.info("Kafka producer started")
    except Exception as e:
        logger.warning(f"Kafka unavailable — running without it: {e}")
        producer = None


async def stop_kafka_producer():
    global producer
    if producer:
        await producer.stop()


async def publish_result_event(student_register: str, subject_code: str, result_status: str):
    if not producer:
        logger.warning("Kafka producer not available — skipping event")
        return
    try:
        await producer.send(
            "result-published",
            value={
                "register_number": student_register,
                "subject_code": subject_code,
                "result_status": result_status,
                "event": "result_published"
            }
        )
        logger.info(f"Published result event for {student_register}")
    except Exception as e:
        logger.error(f"Failed to publish Kafka event: {e}")