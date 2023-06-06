# Guess the artist

## Required environments and software

```bash
Node: 18.12.1
npm: 8.19.2
```

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run typeorm:run-migrations
$ npm run start
```

## Migrations

```bash 
# generate
$ npm run typeorm:generate-migration --name="MigrationName"

# create
$ npm run typeorm:create-migration --name="MigrationName"

# revert
$ npm run typeorm:revert-migration --name="MigrationName"
```
