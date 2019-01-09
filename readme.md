# deepbot-simulator

[![Greenkeeper badge](https://badges.greenkeeper.io/Jaid/deepbot-simulator.svg)](https://greenkeeper.io/)

Command line tool that simulates a [Deepbot API](https://github.com/DeepBot-API/client-websocket) using a local WebSocket.

![Screenshot](http://i.imgur.com/UlHiRqx.png)

:warning: This is not a completely accurate simulation of how Deepbot answers your API calls.  
It just imitates basic Deepbot functionality for testing your APIs.

## Installation

npm
```bash
npm install -g deepbot-simulator
```

Yarn
```bash
yarn global add deepbot-simulator
```

## Running

```bash
deepbot-simulator
```

```
  Usage: deepbot-simulator [options]

  Very basic WebSocket that simulates the Deepbot API


  Options:

    -k, --api-key [api-key]        API key used to give access
    -p, --port [port]              Port the WebSocket listens to
    -w, --no-color                 Port the WebSocket listens to
    -n, --no-users                 Keep the initial user database empty
    -a, --auth-all                 Automatically authenticate new clients
    -r, --randomLatency [latency]  Add response latencies from 0 to [latency] ms
    -e, --events                   Send random music and newsub events to API clients
    -h, --help                     Output usage information
```


## Supported API calls

- `api|register|{secret}`
- `api|get_user|{user}`
- `api|get_points|{user}`
- `api|add_points|{user}|{points}`

The only user in the default database is `jaidchen`, so this is the testing procedure:

```
api|register|1234
api|get_points|jaidchen
api|add_points|jaidchen|322
api|get_points|jaidchen
```