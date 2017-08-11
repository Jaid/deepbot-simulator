# deepbot-simulator

Command line tool that simulates a [Deepbot API](https://github.com/DeepBot-API/client-websocket) using a local WebSocket.

```
  Usage: deepbot-simulator [options]

  Very basic WebSocket that simulates the Deepbot API


  Options:

    -k, --api-key [api-key]        API key used to give access
    -p, --port [port]              Port the WebSocket listens to
    -w, --no-color                 Port the WebSocket listens to
    -n, --no-users                 Keep the initial user database empty
    -a, --auth-all                 Automatically authenticate new clients
    -r, --randomLatency [latency]  Adds response latencies from 0 to [latency] ms
    -h, --help                     output usage information
```

![Screenshot](http://i.imgur.com/JRn1Xce.png)

:warning: This is not a completely accurate simulation of how Deepbot answers your API calls.  
It just imitates basic Deepbot functionality for testing your APIs.

## Installation

```bash
npm install -g deepbot-simulator
```

## Running

```bash
deepbot-simulator
```

## Supported API calls

- `api|register|{secret}`
- `api|get_user|{user}`
- `api|get_points|{user}`
- `api|add_points|{user}|{points}`

The only user in the default database is `j4idn`, so this is the testing procedure:

```
api|register|1234
api|get_points|j4idn
api|add_points|j4idn|322
api|get_points|j4idn
```