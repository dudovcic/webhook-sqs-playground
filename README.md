Project contains 4 services:

- datahog

Returns mocked provider data


- api

Main API which accepts user payload for provider type and callbackUrl which it enqueues onto SQS and returns a success message if enqueued.


- queue-tasks


SQS consumer which gets provider data from `datahog` and sends the response onto user's requested callback url
It datahog provider fails it will give it back to SQS with a 5 min delay, but if callback-api fails it will handle it with exponential backoff.

- callback-api


Very simple api to test callbackUrl in above mentioned services


Setup:

Make sure you have AWS credentials in your env variables ( AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY )

In your AWS account make sure you have SQS queue named `bills-queue` ( this would normally be auto created )

Run `docker-compose up` in root folder and everything should spin up