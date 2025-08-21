/**
 * Html.js (rewritten, minimal)
 * - Lightweight DOM helpers
 * - Reusable BlueimpUploader component
 *   Renders a Bootstrap card with:
 *     - file input (#fileupload)
 *     - progress bar
 *     - files list
 *     - Ace editor
 *     - Clear button
 *   Initialization of Blueimp happens in Upload.js to keep separation of concerns.
 */

(function (global) {
  const h = {
    el(tag, attrs = {}, children = []) {
      const el = document.createElement(tag);
      for (const [k, v] of Object.entries(attrs || {})) {
        if (k === "class") el.className = v;
        else if (k === "html") el.innerHTML = v;
        else if (k.startsWith("on") && typeof v === "function") el.addEventListener(k.slice(2), v);
        else el.setAttribute(k, v);
      }
      (Array.isArray(children) ? children : [children]).forEach(c => {
        if (c == null) return;
        if (typeof c === "string") el.appendChild(document.createTextNode(c));
        else el.appendChild(c);
      });
      return el;
    },
    mount(target, node) {
      const host = (typeof target === "string") ? document.querySelector(target) : target;
      if (!host) throw new Error("Mount target not found: " + target);
      host.innerHTML = "";
      host.appendChild(node);
      return host;
    }
  };

  class BlueimpUploader {
    constructor(opts = {}) {
      this.opts = Object.assign({
        title: "File Uploader",
        aceHeight: "220px",
        ids: {
          root: "blueimp-root",
          input: "fileupload",
          progress: "progress",
          progressBar: "progress-bar",
          files: "files",
          clearBtn: "clearUploads",
          ace: "htmlStringInput",
          addBtn: "addHtmlBtn",
          clearAllBtn: "newAgainButton",
          tabContainer: "tabContainer",
          tabContent: "tabContent",
          inputListContainer: "inputListContainer",
        }
      }, opts || {});
    }

    render() {
      const ids = this.opts.ids;
      const root = h.el("div", { id: ids.root });

      // Header
      root.appendChild(h.el("h1", { class: "text-center mb-4" }, "JS Completion"));

      // Card: Uploader
      const card1 = h.el("div", { class: "card card-hover shadow mb-3" }, [
        h.el("div", { class: "card-body" }, [
          h.el("div", { class: "d-flex align-items-center justify-content-between mb-3" }, [
            h.el("h4", { class: "mb-0" }, this.opts.title),
            h.el("button", { id: ids.clearBtn, class: "btn btn-outline-danger btn-sm", type: "button" }, "Clear All")
          ]),
          // File button
          (() => {
            const span = h.el("span", { class: "btn btn-success fileinput-button" }, [
              h.el("span", {}, "Select files..."),
              h.el("input", { id: ids.input, type: "file", name: "files[]", multiple: "multiple" })
            ]);
            return span;
          })(),
          // Progress
          h.el("div", { id: ids.progress, class: "progress mt-3" }, [
            h.el("div", { class: "progress-bar progress-bar-striped bg-success", role: "progressbar", style: "width:0%" })
          ]),
          // Files list
          h.el("div", { id: ids.files, class: "files mt-3" })
        ])
      ]);

      // Card: Ace editor + actions
      const card2 = h.el("div", { class: "card card-hover shadow" }, [
        h.el("div", { class: "card-body" }, [
          h.el("div", { class: "mb-3" }, [
            h.el("label", { for: ids.ace, class: "form-label" }, "Input JS:"),
            h.el("div", { id: ids.ace, style: `height:${this.opts.aceHeight}; border:1px solid #ced4da; border-radius:.25rem;` })
          ]),
          h.el("div", { class: "mb-3 text-end" }, [
            h.el("button", { class: "btn btn-success", id: ids.addBtn, type: "button" }, "Add"),
            h.el("button", { class: "btn btn-warning ms-2", id: ids.clearAllBtn, type: "button" }, "Clear All")
          ])
        ])
      ]);

      // Card: Completion Tabs shell
      const card3 = h.el("div", { class: "card card-hover shadow mt-2" }, [
        h.el("div", { class: "card-body" }, [
          h.el("h4", { class: "mb-4" }, "Completion"),
          h.el("div", { class: "panel with-nav-tabs panel-default" }, [
            h.el("div", { class: "panel-heading" }, [
              h.el("div", { id: this.opts.ids.tabContainer })
            ]),
            h.el("div", { class: "panel-body" }, [
              h.el("div", { id: this.opts.ids.tabContent, class: "mt-4" })
            ])
          ])
        ])
      ]);

      // Card: Input List
      const card4 = h.el("div", { class: "card card-hover shadow mt-2" }, [
        h.el("div", { class: "card-body", id: this.opts.ids.inputListContainer })
      ]);

      const container = h.el("div", { class: "container py-4" }, [
        card1, card2, card3, card4,
        h.el("div", { id: "backlink" })
      ]);

      return container;
    }

    mount(target) {
      const node = this.render();
      return h.mount(target, node);
    }
  }

  // Expose
  global.Html = global.Html || {};
  global.Html.h = h;
  global.Html.BlueimpUploader = BlueimpUploader;
})(window);
