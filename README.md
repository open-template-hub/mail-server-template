<p align="center">
   <a href="https://opentemplatehub.com">
    <img src="https://raw.githubusercontent.com/open-template-hub/open-template-hub.github.io/master/assets/logo/server/mail-server-logo.png" alt="Logo" width=200>
  </a>
</p>

<h1 align="center">
Open Template Hub - Mail Server Template v5
</h1>

[![License](https://img.shields.io/github/license/open-template-hub/mail-server-template?color=43b043&style=for-the-badge)](LICENSE)
[![Issues](https://img.shields.io/github/issues/open-template-hub/mail-server-template?color=43b043&style=for-the-badge)](https://github.com/open-template-hub/mail-server-template/issues)
[![PRCLosed](https://img.shields.io/github/issues-pr-closed-raw/open-template-hub/mail-server-template?color=43b043&style=for-the-badge)](https://github.com/open-template-hub/mail-server-template/pulls?q=is%3Apr+is%3Aclosed)
[![LastCommit](https://img.shields.io/github/last-commit/open-template-hub/mail-server-template?color=43b043&style=for-the-badge)](https://github.com/open-template-hub/mail-server-template/commits/master)
[![Release](https://img.shields.io/github/release/open-template-hub/mail-server-template?include_prereleases&color=43b043&style=for-the-badge)](https://github.com/open-template-hub/mail-server-template/releases)
[![SonarCloud](https://img.shields.io/sonar/quality_gate/open-template-hub_mail-server-template?server=https%3A%2F%2Fsonarcloud.io&label=Sonar%20Cloud&style=for-the-badge&logo=sonarcloud)](https://sonarcloud.io/dashboard?id=open-template-hub_mail-server-template)

Mail Server Template is a generic open-source mail server that has a simple yet powerful design to connect your business with third-party email service providers (like Gmail, Yahoo, or Outlook).

## Ways to Begin

### 1. Express Deploy

Deploy this template to Heroku

[![Deploy](https://img.shields.io/badge/Deploy_to-Heroku-7056bf.svg?style=for-the-badge&logo=heroku)](https://heroku.com/deploy?template=https://github.com/open-template-hub/mail-server-template)

### 2. Start with Server Generator

Create your server with Server Generator Package

[![NPM](https://img.shields.io/badge/NPM-server_generator-cb3837.svg?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/@open-template-hub/server-generator)

### 3. GitHub Template

Use this repository as a Template

[![GitHubTemplate](https://img.shields.io/badge/GitHub-Template-24292e.svg?style=for-the-badge&logo=github)](https://github.com/open-template-hub/mail-server-template/generate)

## Installations

Install **nodejs** and **npm** via **[nodejs.org](https://nodejs.org)**.

Check installed versions of **nodejs** and **npm** via running following commands:

```
node -v
npm -v
```

Check project's current **nodejs** and **npm** version from **[package.json](package.json)**.

## Environment Variables

If you don't give **RESPONSE_ENCRYPTION_SECRET**, response encryption mechanism will be disabled automatically.

``` applescript
PORT=4006

PROJECT=OTH
MODULE=MailServer
ENVIRONMENT=Local

CLOUDAMQP_APIKEY={MQ Api Key}
CLOUDAMQP_URL={MQ Connection Url}

MAIL_SERVER_QUEUE_CHANNEL=oth_mail_queue
ORCHESTRATION_SERVER_QUEUE_CHANNEL=oth_orchestration_queue

REDISCLOUD_URL={Redis Connection Url}
REDIS_CONNECTION_LIMIT={Redis Connection Limit}

MONGODB_URI={MongoDB Connection Url}
MONGODB_CONNECTION_LIMIT={MongoDB Connection Limit}
    
ACCESS_TOKEN_SECRET={Access Token Secret}
RESPONSE_ENCRYPTION_SECRET={Response Encryption Secret}

DEFAULT_LANGUAGE={LANGUAGE CODE}
```

## Configurations

### Example Preconfigured Mail:

```json
{
  "key" : "verifyAccount",
  "from" : "info@opentemplatehub.com",
  "mails" : [ 
      {
        "language" : "en",
        "subject" : "Verify Account",
        "body": "{Verify Account Mail Body}"
      }
  ]
}
```

If you provide 'to' value to this configuration, POST /sms/me 'to' value will be overwritten.

### Mail Service Configurations

This is the list of supported mail providers. Configuring only what you need to use is enough.

1. [Gmail](#2-gmail)
2. [Outlook](#3-outlook)
3. [Yahoo](#4-yahoo)

### 1. GMAIL

#### Service Configuration

```json
{
    "key" : "GMAIL",
    "payload" : {
        "host" : "{ smtp.gmail.com }",
        "port" : "{ 465 }"
    }
}
``` 

#### Mail Configuration

```json
{
    "provider" : "GMAIL",
    "username" : "{ Username }",
    "password" : "{ Password }"
}
```

### 2. OUTLOOK

#### Service Configuration

```json
{
    "key" : "OUTLOOK",
    "payload" : {
        "host" : "{ smtp-mail.outlook.com }",
        "port" : "{ 587 }",
        "sslV3": true
    }
}
``` 

#### Mail Configuration

```json
{
    "provider" : "OUTLOOK",
    "username" : "{ Username }",
    "password" : "{ Password }"
}
```

### 3. YAHOO

#### Service Configuration

```json
{
    "key" : "YAHOO",
    "payload" : {
        "host" : "{ smtp.mail.yahoo.com }",
        "port" : "{ 465 }"
    }
}
``` 

#### Mail Configuration

```json
{
    "provider" : "YAHOO",
    "username" : "{ Username }",
    "password" : "{ Password }"
}
```

### Custom Mail Service Configurations

For the custom mail service configurations, you can build similar configuration below.

#### Service Configuration

```json
{
    "key" : "{ Provider Key }",
    "payload" : {
        "host" : "{ smtp.host }",
        "port" : "{ port }"
    }
}
``` 

#### Mail Configuration

```json
{
    "provider" : "{ Provider Key }",
    "username" : "{ Username }",
    "password" : "{ Password }"
}
```

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/furknyavuz"><img src="https://avatars0.githubusercontent.com/u/2248168?s=460&u=435ef6ade0785a7a135ce56cae751fb3ade1d126&v=4" width="100px;" alt=""/><br /><sub><b>Furkan Yavuz</b></sub></a><br /><a href="https://github.com/open-template-hub/mail-server-template/issues/created_by/furknyavuz" title="Answering Questions">💬</a> <a href="https://github.com/open-template-hub/mail-server-template/commits?author=furknyavuz" title="Documentation">📖</a> <a href="https://github.com/open-template-hub/mail-server-template/pulls?q=is%3Apr+reviewed-by%3Afurknyavuz" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://github.com/fatihturker"><img src="https://avatars1.githubusercontent.com/u/2202179?s=460&u=261b1129e7106c067783cb022ab9999aad833bdc&v=4" width="100px;" alt=""/><br /><sub><b>Fatih Turker</b></sub></a><br /><a href="https://github.com/open-template-hub/mail-server-template/issues/created_by/fatihturker" title="Answering Questions">💬</a> <a href="https://github.com/open-template-hub/mail-server-template/commits?author=fatihturker" title="Documentation">📖</a> <a href="https://github.com/open-template-hub/mail-server-template/pulls?q=is%3Apr+reviewed-by%3Afatihturker" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://github.com/mertlsarac"><img src="https://avatars1.githubusercontent.com/u/38442589?s=400&u=aa3cda11724fc297a0bfa6beb35c9be81687cf3c&v=4" width="100px;" alt=""/><br /><sub><b>Mert Sarac</b></sub></a><br /><a href="https://github.com/open-template-hub/mail-server-template/issues/created_by/mertlsarac" title="Answering Questions">💬</a> <a href="https://github.com/open-template-hub/mail-server-template/commits?author=mertlsarac" title="Documentation">📖</a> <a href="https://github.com/open-template-hub/mail-server-template/pulls?q=is%3Apr+reviewed-by%3Amertlsarac" title="Reviewed Pull Requests">👀</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

## Contributing

Refer to **[CONTRIBUTING.md](https://github.com/open-template-hub/.github/blob/master/docs/CONTRIBUTING.md)** to see how to contribute to Open Template Hub.

<br/>

## Code of Conduct

Refer to **[CODE_OF_CONDUCT.md](https://github.com/open-template-hub/.github/blob/master/docs/CODE_OF_CONDUCT.md)** to see contributor covenant code of conduct.

<br/>

## LICENSE

The source code for this project is released under the [MIT License](LICENSE).
