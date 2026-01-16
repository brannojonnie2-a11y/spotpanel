import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const STATE_FILE = path.join(process.cwd(), "user_states.json")

function readStates() {
  try {
    if (fs.existsSync(STATE_FILE)) {
      return JSON.parse(fs.readFileSync(STATE_FILE, "utf8"))
    }
  } catch (e) {
    console.error("Error reading states", e)
  }
  return {}
}

function writeStates(states: any) {
  try {
    fs.writeFileSync(STATE_FILE, JSON.stringify(states, null, 2))
  } catch (e) {
    console.error("Error writing states", e)
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const ip = searchParams.get("ip")

  if (!ip) {
    return NextResponse.json({ error: "IP is required" }, { status: 400 })
  }

  const states = readStates()
  return NextResponse.json({ state: states[ip] || "normal" })
}

export async function POST(request: Request) {
  const body = await request.json()
  const { ip, state } = body

  if (!ip || !state) {
    return NextResponse.json({ error: "IP and state are required" }, { status: 400 })
  }

  const states = readStates()
  states[ip] = state
  writeStates(states)
  
  console.log(`User ${ip} state updated to: ${state}`)
  
  return NextResponse.json({ success: true })
}
