#!/usr/bin/env bash

if [ ! -f .env ]; then
  echo "Generating .env file.."
  touch .env
  {
    echo "PORT=4006"

    echo "PROJECT=OTH"
    echo "MODULE=MailServer"
    echo "ENVIRONMENT=Local"

    echo "CLOUDAMQP_APIKEY={MQ Api Key}"
    echo "CLOUDAMQP_URL={MQ Connection Url}"

    echo "MAIL_SERVER_QUEUE_CHANNEL=oth_mail_queue"
    echo "ORCHESTRATION_SERVER_QUEUE_CHANNEL=oth_orchestration_queue"

    echo "REDISCLOUD_URL={Redis Connection Url}"
    echo "REDIS_CONNECTION_LIMIT={Redis Connection Limit}"

    echo "MONGODB_URI={MongoDB Connection Url}"
    echo "MONGODB_CONNECTION_LIMIT={MongoDB Connection Limit}"

    echo "ACCESS_TOKEN_SECRET={Access Token Secret}"
    echo "RESPONSE_ENCRYPTION_SECRET={Response Encryption Secret}"
    
    echo "DEFAULT_LANGUAGE={LANGUAGE CODE}"
  } >>.env
else
  echo ".env file already exists. Nothing to do..."
fi
