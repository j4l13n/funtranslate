# FunTranslate

FunTranslate is a project that combines ASP.NET, ReactJS, GraphQL, and REST API technologies to provide a fun translation service.

## Table of Contents

- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
  - [Running the Application](#running-the-application)
  - [API Endpoints](#api-endpoints)
  - [GraphQL](#graphql)
- [Configuration](#configuration)
<!-- - [Contributing](#contributing)
- [License](#license) -->

## Introduction

FunTranslate is a project designed to make translations fun and interactive. It utilizes ASP.NET for the server, ReactJS for the client, and offers both GraphQL and REST APIs.

## Prerequisites

Before you begin, ensure you have the following prerequisites installed:

- .NET Core SDK
- Node.js
- npm or Yarn

## Installation

To get started with FunTranslate, follow these installation steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/j4l13n/funtranslate.git
   ```

2. Navigate to the project directory:

    ```bash
    cd funtranslate
    ```

3. Install server dependencies:

    ```bash
    dotnet restore
    ```

4. Install client dependencies:

    ```bash
    cd ClientApp
    npm install
    ```

## Usage

Learn how to use FunTranslate to add some fun to your translations!

### Running the Application

To run the application, follow these steps:

1. Start the ASP.NET server and ReactJs client:

    ```bash
    dotnet run
    ```

## API Endpoints

FunTranslate provides the following REST API endpoints:

- `/api/translate`: Translate text to a different language.

    - Method: POST

    - Parameters:

        - inputText: The text to translate.
        - translateLanguage: The target language code.
    - Example Request:
    ```http
    POST /api/translate
    Content-Type: application/json

    {
    "text": "Hello, World!",
    "language": "fr"
    }
    ```

## GraphQL

FunTranslate also offers a GraphQL API with an example mutation called "addRecord." Use the following GraphQL mutation to add a record:

Mutation Example: Add Record

```graphql
mutation {
  addRecord(input: {
    text: "Translate this!"
    language: "es"
  }) {
    id
    text
    language
  }
}
```

## Configuration

To customize FunTranslate, check the configuration options, environment variables, or files in the project.



