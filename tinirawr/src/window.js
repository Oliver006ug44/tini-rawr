let zIndexCounter = 100;

class Window98 {
  constructor({
    title = "Window",
    content = "",
    url = "",
    width = 400,
    height = 300,
    x = 100,
    y = 100,
    scrollable = false,
    controls = ["minimize", "maximize", "close"]
  }) {
    this.el = document.createElement("div");
    this.el.className = "window";
    this.el.style.width = `${width}px`;
    this.el.style.height = `${height}px`;
    this.el.style.left = `${x}px`;
    this.el.style.top = `${y}px`;
    this.el.style.position = "absolute";
    this.el.style.zIndex = zIndexCounter++;

    const buttonHTML = controls.map(control => {
      const label = control.charAt(0).toUpperCase() + control.slice(1);
      return `<button class="win-btn ${control}" aria-label="${label}"></button>`;
    }).join("");

    this.el.innerHTML = `
      <div class="title-bar">
        <div class="title-bar-text">${title}</div>
        <div class="title-bar-controls">
          ${buttonHTML}
        </div>
      </div>
      <div class="window-body ${scrollable ? "scrollable" : ""}" style="overflow-y: ${scrollable ? "auto" : "hidden"};"></div>
    `;

    document.body.appendChild(this.el);

    this.makeDraggable();

    if (controls.includes("close")) {
      this.el.querySelector(".close").addEventListener("click", () => {
        this.el.remove();
      });
    }

    if (controls.includes("minimize")) {
      this.el.querySelector(".minimize").addEventListener("click", () => {
        this.el.style.display = "none";
      });
    }

    if (controls.includes("maximize")) {
      this.el.querySelector(".maximize").addEventListener("click", () => {
        if (this.el.classList.toggle("maximized")) {
          this.el.style.left = "0";
          this.el.style.top = "0";
          this.el.style.width = "100vw";
          this.el.style.height = "100vh";
        } else {
          this.el.style.width = `${width}px`;
          this.el.style.height = `${height}px`;
          this.el.style.left = `${x}px`;
          this.el.style.top = `${y}px`;
        }
      });
    }

    const windowBody = this.el.querySelector(".window-body");

    if (url) {
      this.loadExternalContent(url, windowBody);
    } else {
      windowBody.innerHTML = content;
      this.executeScripts(windowBody);
      this.focusFirstInput(windowBody);
    }
  }

  makeDraggable() {
    const titleBar = this.el.querySelector(".title-bar");
    let offsetX = 0, offsetY = 0, isDragging = false;

    titleBar.addEventListener("mousedown", (e) => {
      isDragging = true;
      offsetX = e.clientX - this.el.offsetLeft;
      offsetY = e.clientY - this.el.offsetTop;
      document.body.style.userSelect = "none";
      this.el.style.zIndex = ++zIndexCounter;
    });

    window.addEventListener("mousemove", (e) => {
      if (isDragging) {
        this.el.style.left = `${e.clientX - offsetX}px`;
        this.el.style.top = `${e.clientY - offsetY}px`;
      }
    });

    window.addEventListener("mouseup", () => {
      isDragging = false;
      document.body.style.userSelect = "";
    });
  }

  async loadExternalContent(url, container) {
    try {
      container.innerHTML = "";
      const iframe = document.createElement("iframe");
      iframe.style.width = "100%";
      iframe.style.height = "100%";
      iframe.style.border = "none";
      iframe.setAttribute("sandbox", "allow-scripts allow-same-origin allow-forms"); // sandbox for safety
      container.appendChild(iframe);
      iframe.src = url;
    } catch (error) {
      console.error(error);
      container.innerHTML = `<pre style="color:red;">${error}</pre>`;
    }
  }

  executeScripts(container) {
    const scripts = container.querySelectorAll("script");

    scripts.forEach(oldScript => {
      const newScript = document.createElement("script");

      if (oldScript.src) {
        newScript.src = oldScript.src;
        newScript.async = false;
        document.body.appendChild(newScript);
      } else {
        try {
          // Evaluate inline script
          const inlineCode = document.createTextNode(oldScript.innerHTML);
          newScript.appendChild(inlineCode);
          container.appendChild(newScript);
        } catch (e) {
          console.warn("Inline script failed:", e);
        }
      }
    });
  }

  focusFirstInput(container) {
    const input = container.querySelector("input, textarea");
    if (input) {
      setTimeout(() => input.focus(), 50);
    }
  }
}

export default Window98;
