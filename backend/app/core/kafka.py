import os
import json
import logging
from kafka import KafkaProducer
from kafka.errors import NoBrokersAvailable

logger = logging.getLogger(__name__)
KAFKA_BOOTSTRAP_SERVERS = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092")

producer = None


def start_kafka_producer():
    global producer
    try:
        producer = KafkaProducer(
            bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
            value_serializer=lambda v: json.dumps(v).encode(),
            request_timeout_ms=5000,
            connections_max_idle_ms=10000
        )
        logger.info("Kafka producer started")
    except NoBrokersAvailable:
        logger.warning("Kafka unavailable — running without it")
        producer = None
    except Exception as e:
        logger.warning(f"Kafka unavailable: {e}")
        producer = None


def stop_kafka_producer():
    global producer
    if producer:
        producer.close()


def publish_result_event(student_register: str, subject_code: str, result_status: str):
    if not producer:
        logger.warning("Kafka producer not available — skipping event")
        return
    try:
        producer.send(
            "result-published",
            value={
                "register_number": student_register,
                "subject_code": subject_code,
                "result_status": result_status,
                "event": "result_published"
            }
        )
        producer.flush()
        logger.info(f"Published result event for {student_register}")
    except Exception as e:
        logger.error(f"Failed to publish Kafka event: {e}")