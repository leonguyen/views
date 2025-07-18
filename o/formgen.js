// JavaScript Form Generator
// copyright Stephen Chapman 21st June 2008, 22nd January 2013
// http://www.felgall.com
// You are granted permission to use this script
// provided that the code including these comments
// is used exactly as supplied
Form = function(a, m, e, txt) {
    var t, l;
    this.F = document.createElement("form");
    this.F.action = a;
    this.F.method = m;
    if (e != '') this.F.enctype = e;
    this.fld = document.createElement("fieldset");
    t = document.createTextNode(txt);
    l = document.createElement("legend");
    l.appendChild(t);
    this.fld.appendChild(l);
}
Form.prototype.addInput = function(tx, l, n, v, st) {
    var d, t, lab, inp;
    switch (tx) {
        case 'text':
        case 'radio':
        case 'checkbox':
        case 'submit':
        case 'button':
            d = document.createElement("div");
            t = document.createTextNode(l + ' ');
            lab = document.createElement("label");
            lab.appendChild(t); /*@cc_on @if(@_jscript) @if(@_jscript_version<9) inp=document.createElement("<input name='"+n+"'>");@else inp=document.createElement("input");inp.name=n; @end @else */
            inp = document.createElement("input");
            inp.name = n; /* @end @*/
            inp.type = tx;
            if (tx == 'radio') {
                if (this.n != +this.n) this.n = 0;
                this.n++;
                n += this.n;
            }
            inp.id = n;
            lab.htmlFor = n;
            inp.value = v;
            if (st.match(/c/i)) inp.checked = true;
            if (st.match(/d/i)) inp.disabled = true;
            if (st.match(/r/i)) inp.readOnly = true;
            if (tx == 'radio' || tx == 'checkbox') {
                d.appendChild(inp);
                d.appendChild(lab);
            } else {
                d.appendChild(lab);
                d.appendChild(inp);
            }
            this.fld.appendChild(d);
            break;
        default:
    }
};
Form.prototype.addTextarea = function(l, n, w, h, v, st) {
    var d, t, lab, inp, c;
    d = document.createElement("div");
    t = document.createTextNode(l + ' ');
    lab = document.createElement("label");
    lab.appendChild(t); /*@cc_on @if(@_jscript) @if(@_jscript_version<9)inp=document.createElement("<textarea name='"+n+"'>"); @else inp=document.createElement("textarea");inp.name=n; @end @else */
    inp = document.createElement("textarea");
    inp.name = n; /* @end @*/
    inp.id = n;
    inp.cols = w;
    inp.rows = h;
    c = document.createTextNode(v);
    inp.appendChild(c);
    if (st.match(/d/i)) inp.disabled = true;
    if (st.match(/r/i)) inp.readOnly = true;
    d.appendChild(lab);
    d.appendChild(inp);
    this.fld.appendChild(d);
};
Form.prototype.addHidden = function(n, v) {
    var inp; /*@cc_on @if(@_jscript)@if(@_jscript_version<9) inp=document.createElement("<input name='"+n+"'>"); @else inp=document.createElement("input");inp.name=n; @end @else */
    inp = document.createElement("input");
    inp.name = n; /* @end @*/
    inp.type = 'hidden';
    inp.id = n;
    inp.value = v;
    this.fld.appendChild(inp);
};
Form.prototype.addSelect = function(l, n, sz, opt, st) {
    var d, t, lab, inp, grp, i, j;
    d = document.createElement("div");
    t = document.createTextNode(l + ' ');
    lab = document.createElement("label");
    lab.appendChild(t); /*@cc_on @if(@_jscript) @if(@_jscript_version<9) inp=document.createElement("<select name='"+n+"'>"); @else inp=document.createElement("select");inp.name=n; @end @else */
    inp = document.createElement("select");
    inp.name = n; /* @end @*/
    inp.id = n;
    lab.htmlFor = n;
    for (i = 0, j = 0; i < opt.length; i++) {
        if (opt[i].length > 1) {
            inp.options[j] = new Option(opt[i][0], opt[i][1]);
            if (opt[i][2].match(/d/i)) inp.options[j].disabled = true;
            if (opt[i][2].match(/s/i)) inp.options[j].selected = true;
            j++;
        } else {
            grp = document.createElement('optgroup');
            grp.label = opt[i][0];
            inp.appendChild(grp);
        }
    }
    if (st.match(/d/i)) inp.disabled = true;
    if (st.match(/m/i)) {
        inp.multiple = true;
        if (sz == 1) sz = '';
    }
    if (sz != '') inp.size = sz;
    d.appendChild(lab);
    d.appendChild(inp);
    this.fld.appendChild(d);
};
Form.prototype.addForm = function(i) {
    this.F.appendChild(this.fld);
    document.getElementById(i).appendChild(this.F);
};