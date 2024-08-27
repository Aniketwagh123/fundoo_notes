import redis
from django.conf import settings
from loguru import logger


class RedisUtils:
    def __init__(self):
        """
        Initializes the RedisUtils class and creates a Redis instance.

        desc: Initializes the Redis utility class with a Redis connection instance.
        """
        self.redis_instance = redis.StrictRedis.from_url(
            settings.CACHES['default']['LOCATION'])
        logger.info("Redis instance created")

    def save(self, key, value, expiry=None):
        """
        Save data to Redis, handling both create and update.

        desc: Saves a key-value pair to Redis, optionally setting an expiry time.
        params:
            key (str): The key under which to store the value.
            value (str): The value to be stored.
            expiry (int, optional): Expiry time in seconds for the key-value pair.
        return: None
        """
        try:
            if expiry:
                self.redis_instance.set(key, value, ex=expiry)
                logger.debug(f"Saved key {key} with expiry {expiry}")
            else:
                self.redis_instance.set(key, value)
                logger.debug(f"Saved key {key} without expiry")
        except redis.RedisError as e:
            logger.error(f"Error saving key {key}: {e}")

    def get(self, key):
        """
        Get data from Redis by key.

        desc: Retrieves the value stored under a given key from Redis.
        params:
            key (str): The key whose value is to be retrieved.
        return: str: The value associated with the key, or None if not found.
        """
        try:
            value = self.redis_instance.get(key)
            logger.debug(f"Retrieved key {key} with value {value}")
            return value
        except redis.RedisError as e:
            logger.error(f"Error retrieving key {key}: {e}")
            return None

    def delete(self, key):
        """
        Delete data from Redis by key.

        desc: Deletes a key-value pair from Redis.
        params:
            key (str): The key to be deleted from Redis.
        return: int: The number of keys that were removed.
        """
        try:
            result = self.redis_instance.delete(key)
            logger.debug(f"Deleted key {key}")
            return result
        except redis.RedisError as e:
            logger.error(f"Error deleting key {key}: {e}")
            return 0

    def hset(self, name, key, value):
        """
        Set a hash key-value pair in Redis.

        desc: Sets a field in the hash stored at the specified key.
        params:
            name (str): The name of the Redis hash.
            key (str): The field name within the hash.
            value (str): The value to set for the specified field.
        return: None
        """
        try:
            self.redis_instance.hset(name, key, value)
            logger.debug(
                f"Set hash field {key} in hash {name} with value {value}")
        except redis.RedisError as e:
            logger.error(f"Error setting hash field {key} in hash {name}: {e}")

    def hget(self, name, key):
        """
        Get a value by hash key from Redis.

        desc: Retrieves the value of a field in the hash stored at the specified key.
        params:
            name (str): The name of the Redis hash.
            key (str): The field name within the hash.
        return: str: The value associated with the field, or None if not found.
        """
        try:
            value = self.redis_instance.hget(name, key)
            logger.debug(
                f"Retrieved hash field {key} from hash {name} with value {value}")
            return value
        except redis.RedisError as e:
            logger.error(
                f"Error retrieving hash field {key} from hash {name}: {e}")
            return None

    def hgetall(self, name):
        """
        Get all key-value pairs from a Redis hash.

        desc: Retrieves all fields and values of a hash stored at the specified key.
        params:
            name (str): The name of the Redis hash.
        return: dict: A dictionary of all fields and their values in the hash.
        """
        try:
            result = self.redis_instance.hgetall(name)
            logger.debug(f"Retrieved all fields from hash {name}")
            return result
        except redis.RedisError as e:
            logger.error(f"Error retrieving all fields from hash {name}: {e}")
            return {}

    def hdel(self, name, key):
        """
        Delete a hash key from Redis.

        desc: Deletes a field from the hash stored at the specified key.
        params:
            name (str): The name of the Redis hash.
            key (str): The field name within the hash to be deleted.
        return: int: The number of fields that were removed.
        """
        try:
            result = self.redis_instance.hdel(name, key)
            logger.debug(f"Deleted hash field {key} from hash {name}")
            return result
        except redis.RedisError as e:
            logger.error(
                f"Error deleting hash field {key} from hash {name}: {e}")
            return 0
