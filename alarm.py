#!/usr/bin/python

import redis
import time
import random

r = redis.StrictRedis(host='localhost', port=6379, db=0)

while True:
    message = random.randint(0, 100)
    #wait = random.randint(0, 10000) / 1000
    wait = 0.5
    r.publish("spark-alarm", message)
    time.sleep(wait)


