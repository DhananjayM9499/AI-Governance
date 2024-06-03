const { spawn } = require("child_process");

const pythonCode = `
from QuantileClient import QuantileClient

base_url = "http://77.37.47.33:8000"  # Adjust to your server's base URL
api_key = "quant-3rzCLlkmjyamQWB4oW1jF"

client = QuantileClient(base_url, api_key)
prompt = "what is an api"

# No need to specify model 
callcascade = client.call_cascading(
    prompt="PM India",
    max_tokens=10
)
print(callcascade)
`;

// Spawn a Python process
const pythonProcess = spawn("python", ["-c", pythonCode]);

// Listen for stdout data
pythonProcess.stdout.on("data", (data) => {
  console.log(`Python output: ${data}`);
});

// Listen for stderr data
pythonProcess.stderr.on("data", (data) => {
  console.error(`Error: ${data}`);
});

// Listen for Python process exit
pythonProcess.on("close", (code) => {
  console.log(`Python process exited with code ${code}`);
});
