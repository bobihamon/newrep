import path from "path"
import fs from "fs"
import http from "http"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let count = 0

let server = http.createServer(function (request, response) {
    let pub = path.join(__dirname, "public")
    if (request.url == "/") {
        response.writeHead(200, { "content-type": "text/html" })
        let content = fs.readFileSync(path.join(pub, "index.html"))
        response.end(content)
    }
    else if (request.url == "/add" && request.method == "POST") {
        let data = ""
        request.on("data", function (chunk) {
            data += chunk
        })
        request.on("end", function () {
            let usp = new URLSearchParams(data)
            console.log(usp.get("author"))
            console.log(usp.get("content"))
            let content = `
            <div>
            <h3>${usp.get("author")}</h3>
            <p>${usp.get("content")}</p>
            </div>
            `
            fs.appendFileSync(path.join(pub, "index.html"), content)
            response.writeHead(302, { "location": "/" })
            response.end()
        })
    }
    else {
        response.writeHead(404)
        response.end("<h1> 404 ne</h1>")
    }


})

server.listen(8905)