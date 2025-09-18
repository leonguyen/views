// VanAdapter.js (adds VanJS integration to Html.js)
// Ensure this is loaded after Html.js and VanJS
(function(global){
  if(!global.HtmlElement){ 
    console.error("Html.js must be loaded before VanAdapter.js"); 
    return; 
  }

  // Extend HtmlElement
  HtmlElement.prototype.toVanNode = function() {
    if (!window.van || !van.tags) return this.toHtmlElement();
    const tags = van.tags;
    const createTag = this.tag ? (tags[this.tag] || tags.div) : tags.div;
    const attrs = { ...this.attrs };
    const children = this.children.map(c =>
      typeof c.toVanNode === "function" ? c.toVanNode() :
      typeof c.toHtmlElement === "function" ? c.toHtmlElement() :
      c.toString()
    );
    return createTag(attrs, ...children);
  };

  // Extend HtmlText
  if (global.HtmlText) {
    HtmlText.prototype.toVanNode = function() { return this.text; };
  }

  // Extend HtmlRaw
  if (global.HtmlRaw) {
    HtmlRaw.prototype.toVanNode = function() {
      const temp = document.createElement("div");
      temp.innerHTML = this.html;
      return [...temp.childNodes];
    };
  }

  // Generic mountWithVan
  HtmlElement.prototype.mountWithVan = function(container) {
    if (window.van) van.add(container, this.toVanNode());
    else container.appendChild(this.toHtmlElement());
    if (typeof this.init === "function") this.init();
    return this;
  };

  // PinturaEditorCard integration
  if (global.PinturaEditorCard) {
    PinturaEditorCard.prototype.mountWithVan = async function(container) {
      if (window.van) van.add(container, this.toVanNode());
      else container.appendChild(this.toHtmlElement());
      await this.editor.init();
      return this.editor.getInstance();
    };
  }

  console.info("VanAdapter.js loaded: Html.js elements can now render as VanJS nodes.");
})(window);
