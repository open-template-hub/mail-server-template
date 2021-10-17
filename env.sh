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

    echo "MAIL_HOST={Mail Host}"
    echo "MAIL_PORT={Mail Port}"
    echo "MAIL_USERNAME={Mail Username}"
    echo "MAIL_PASSWORD={Mail Password}"

    echo "ACCESS_TOKEN_SECRET={Access Token Secret}"
    echo "RESPONSE_ENCRYPTION_SECRET={Response Encryption Secret}"
  } >>.env
else
  echo ".env file already exists. Nothing to do..."
fi