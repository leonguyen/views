class TableManager {
    constructor(tableSelector, storage, onUpdate = () => {}) {
        this.table = document.querySelector(tableSelector);
        this.storage = storage;
        this.onUpdate = onUpdate;
    }
    render() {
        const items = this.storage.getAll();
        this.table.innerHTML = '';
        const rowTemplateSrc = document.getElementById('table-row-template').innerHTML;
        const rowTemplate = Handlebars.compile(rowTemplateSrc);
        const htmlPreviewAll = document.getElementById('htmlPreviewAll').textContent;
        const htmlViewAll = document.getElementById('htmlViewAll').innerHTML;
        items.forEach((item, index) => {
            const html = this.renderHtml(item);
            const rowData = {
                index: index + 1,
                rawIndex: index,
                title: item.title || '(no title)',
                escapedHtml: this.escapeHtml(html)
            };
            const rowHtml = rowTemplate(rowData);
            this.table.insertAdjacentHTML('beforeend', rowHtml);
            document.getElementById('htmlPreviewAll').textContent = htmlPreviewAll + "\n" + html;
            document.getElementById('htmlViewAll').innerHTML = htmlViewAll + html;
        });
        Prism.highlightAll();
        this.table.querySelectorAll('button[data-index]').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.getAttribute('data-index'));
                const list = this.storage.getAll();
                list.splice(index, 1);
                this.storage.saveAll(list);
                this.render();
                this.onUpdate();
            });
        });
    }
    renderHtml(data) {
        const templateSrc = document.getElementById('input-template').innerHTML;
        const template = Handlebars.compile(templateSrc);
        return template(data).trim();
    }
    escapeHtml(html) {
        return html.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
}