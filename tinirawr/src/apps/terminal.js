const output = document.getElementById("console-output");

function addLine(text) {
  const line = document.createElement("div");
  line.textContent = text;
  output.insertBefore(line, document.querySelector(".console-input-line"));
}

function createInputLine() {
  const inputLine = document.createElement("div");
  inputLine.className = "console-input-line";

  const span = document.createElement("span");
  span.textContent = "C:\\>";

  const input = document.createElement("input");
  input.className = "console-input";
  input.setAttribute("autofocus", "true");

  inputLine.appendChild(span);
  inputLine.appendChild(input);
  output.appendChild(inputLine);

  input.focus();

  input.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
      const command = input.value.trim();
      addLine(`C:\\>${command}`);
      input.parentElement.remove();

      // If command is cls, clear and return early
      if (command === "cls") {
        output.innerHTML = "";
        createInputLine();
        return;
      }

      handleCommand(command);
      createInputLine();
      output.scrollTop = output.scrollHeight;
    }
  });
}

function handleCommand(cmd) {
  if (cmd === "help") {
    addLine("Commands: help, dir, echo [text], cls");
  } else if (cmd === "dir") {
    addLine("Volume in drive C is OS\nDirectory of C:\\\n\nCOMMAND  <DIR>\nWINDOWS  <DIR>\n...");
  } else if (cmd.startsWith("echo ")) {
    addLine(cmd.slice(5));
  } else {
    addLine(`'${cmd}' is not recognized as an internal or external command`);
  }
}

// Initialize first input
document.querySelector(".console-input").addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    const command = this.value.trim();
    addLine(`C:\\>${command}`);
    this.parentElement.remove();

    if (command === "cls") {
      output.innerHTML = "";
      createInputLine();
      return;
    }

    handleCommand(command);
    createInputLine();
    output.scrollTop = output.scrollHeight;
  }
});
