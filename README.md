<p align="center">
  <img src="assets/adaptive-icon.png" alt="App Screenshot" width="300" />
</p>

# LLM-mar (Large Language Model - Made Accessible Remotely)

LLM-mar is a mobile application for Android designed to help make it easier to connect to a self-hosted LLM. It is intended to be used with a secure tunneling service to allow for direct access to an LLM running on a user's own hardware.

## Usage

1. You need to have an LLM exposed to your network. Depending on the tunneling service you are using, this may be enough to make the connection.

<p align="center">
  <img src="screenshots/ollama-Expose Ollama to the network.png" alt="Ollama Expose to network" width="500" />
</p>

2. Open the settings page in LLM-mar by clicking the hamburger button in the top right corner. This will open the settings modal.

<p align="center">
  <img src="screenshots/settings-screen.jpg" alt="Settings screen" width="300" />
</p>

-   Change the LLM IP to the remotely accessible IP of your self-hosted LLM.
-   Change the model name to match the model you are running.

3. The main screen should show a server status. If the server is online, you can send your prompts as you would if you were interacting with your LLM in at your desktop.

<p align="center">
  <img src="screenshots/main-screen.jpg" alt="Main screen" width="300" />
  <img src="screenshots/prompt.jpg" alt="Prompt" width="300" />
  <img src="screenshots/prompt-and-response.jpg" alt="Prompt and response" width="300" />
</p>

## Settings

The following settings are available beyond LLM IP, and Model Name.

- Verbose: The Verbose setting works with some LLM's. It is meant to reduce the output.

- Dark Mode: This changes the UI to dark mode. It is likely that you know about dark mode if you are here.

<p align="center">
  <a href="https://www.buymeacoffee.com/woodalanmc)" target="_blank">
    <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" width="200" />
  </a>
</p>
