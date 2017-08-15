#!/usr/bin/env node
import program from "commander"
import lodash from "lodash"
import WebSocket from "ws"
import chalk from "chalk"
import moment from "moment"
import numeral from "numeral"

require("numeral/locales/de")

const eventMessages = [
    () => `newsub|${lodash.sample(["j4idn", "botemicmight", "gronkh"])}|giorap90|5|5|VGVzdCBTdWJzY3JpcHRpb24gZnJvbSBkZWVwYm90LXNpbXVsYXRvcg==`,
    () => `music|loadVideo|${lodash.sample(["sdLv6uI_3xo", "0W_k5WzaCSY", "7SqFQYX4grY"])}|small`
]

program
    .description("Very basic WebSocket that simulates the Deepbot API")
    .option("-k, --api-key [api-key]", "API key used to give access", "1234")
    .option("-p, --port [port]", "Port the WebSocket listens to", Number, 3337)
    .option("-w, --no-color", "Port the WebSocket listens to")
    .option("-n, --no-users", "Keep the initial user database empty")
    .option("-a, --auth-all", "Automatically authenticate new clients")
    .option("-r, --random-latency [latency]", "Adds response latencies from 0 to [latency] ms", Number)
    .option("-e, --events", "Send random music and newsub events to API clients")
    .parse(process.argv)

chalk.enabled = !program.noColor

const userData = program.noUsers
    ? {}
    : {
        j4idn: {
            user: "j4idn",
            points: 13.37,
            watchtime: 9412,
            vip: 10,
            mod: 5,
            join_date: moment().subtract(7, "days").valueOf(),
            last_seen: moment().valueOf(),
            vip_expiry: moment().add(30, "days").valueOf()
        }
    }

let server

try {
    server = new WebSocket.Server({port: program.port})
} catch (error) {
    console.error(error)
    process.exit(1)
}

if (program.events) {
    setInterval(() => {
        if (lodash.isEmpty(server.clients)) {
            return
        }

        const message = lodash.sample(eventMessages)()
        console.log(chalk.yellow(`[${server.clients.length}] 🡸 ${message}`))
        server.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message)
            }
        })
    }, 5000)
}

server.on("connection", (client, message) => {

    let isAuthorized = program.authAll
    const clientName = message.connection.remoteAddress

    console.log(chalk.green(`[${clientName}] Connected!`))
    client.on("message", message => {

        const [apiName, command, ...args] = message.split("|")
        console.log(chalk.blue(`[${clientName}] 🡺 ${JSON.stringify({apiName: apiName, command: command, args: args})}`))

        new Promise((resolve) => {
            setTimeout(resolve, lodash.random(0, program.randomLatency))
        }).then(() => {
                return new Promise((resolve, reject) => {

                    if (apiName !== "api") {
                        reject(`First parameter must be "api", but it is ${apiName}`)
                        return
                    }

                    if (!command) {
                        reject(`command is ${command}`)
                        return
                    }

                    if (command === "register") {
                        if (args[0] === program.apiKey) {
                            resolve({"function": "register", param: "register", msg: "success"})
                        } else {
                            resolve({"function": "register", param: "error", msg: "incorrect api secret"})
                        }
                        isAuthorized = true
                        return
                    }

                    if (!isAuthorized) {
                        resolve({"function": command, param: "error", msg: "not authorized"})
                        return
                    }

                    if (command === "get_user") {
                        const user = userData[args[0].toLowerCase()]
                        if (user) {
                            resolve({"function": command, param: args[0], msg: userToJson(user)})
                        } else {
                            reject(`User ${args[0]} not found!`)
                        }
                        return
                    }

                    if (command === "get_points") {
                        const user = userData[args[0].toLowerCase()]
                        if (user) {
                            numeral.locale("de")
                            resolve({"function": command, param: args[0], msg: numeral(user.points).format("0.00")})
                            numeral.locale("en")
                        } else {
                            reject(`User ${args[0]} not found!`)
                        }
                        return
                    }

                    if (command === "add_points") {
                        const user = userData[args[0].toLowerCase()]
                        const pointsToAdd = args[1]
                        if (user) {
                            if (!pointsToAdd) {
                                reject("Missing parameter!")
                                return
                            }
                            user.points += +pointsToAdd
                            resolve({"function": command, param: args[0], msg: "success"})
                        } else {
                            reject(`User ${args[0]} not found!`)
                        }
                        return
                    }

                })
            }
        )
            .then(data => {
                console.log(chalk.gray(`[${clientName}] 🡸 ${JSON.stringify(data)}`))
                client.send(JSON.stringify(data, null, 4))
            }).catch(error => console.log(chalk.gray(`[${clientName}] ⚠ ${error}`)))

    })
    client.on("close", () => {
        console.log(chalk.red(`[${clientName}] Disconnected!`))
    })
})

console.log(chalk.yellow(`Deepbot API WebSocket running on ws://127.0.0.1:${program.port}`))
if (program.authAll) {
    console.log(chalk.yellow(`--auth-all is enabled`))
} else {
    console.log(chalk.yellow(`You can log in with api|register|${program.apiKey}`))
}
if (program.events) {
    console.log(chalk.yellow(`--events is enabled`))
}

process.stdin.setEncoding("utf8")
process.stdin.on("readable", () => {
    const chunk = process.stdin.read()
    if (chunk !== null) {
        // Nothing to do with CLI input
    }
})

function userToJson(user) {
    return {
        user: user.user,
        points: numeral(user.points).format("0.0"),
        watchtime: numeral(user.watchtime).format("0.0"),
        vip: user.vip,
        mod: user.mod,
        join_date: moment(user.join_date).format(),
        last_seen: moment(user.last_seen).format(),
        vip_expiry: moment(user.vip_expiry).format()
    }
}