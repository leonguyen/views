class JSGen {
  constructor(name) {
    this.name = name;
    this.comments = [];
    this.properties = [];
    this.methods = [];
  }

  addComment(comment) {
    this.comments.push(comment);
    return this;
  }

  addProperty(name, value, access = 'public', type = null) {
    this.properties.push({ name, value, access, type });
    return this;
  }

  addMethod(name, args = [], body = '') {
    this.methods.push({ name, args, body });
    return this;
  }

  toString() {
    let code = '';
    if (this.comments.length)
      code += '/** ' + this.comments.join(' ') + ' */\n';
    code += `class ${this.name} {\n`;
    // Properties as fields
    for (const prop of this.properties) {
      if (prop.type)
        code += `  /** @type {${prop.type}} */\n`;
      // Only # private fields supported in JS; otherwise just comments
      let decl = prop.access === 'private' ? '#' : '';
      code += `  ${decl}${prop.name} = ${JSON.stringify(prop.value)};\n`;
    }
    // Constructor if a method has the name
    const ctor = this.methods.find(m => m.name === 'constructor');
    if (ctor) {
      code += `  constructor(${ctor.args.join(', ')}) {\n`;
      code += `    ${ctor.body}\n`;
      code += `  }\n`;
    }
    // Other methods
    for (const m of this.methods) {
      if (m.name !== 'constructor') {
        code += `  ${m.name}(${m.args.join(', ')}) {\n`;
        code += `    ${m.body}\n`;
        code += `  }\n`;
      }
    }
    code += '}\n';
    return code;
  }
}
/*
// Usage:
const cls = new JSClassGenerator('Demo');
cls.addComment('Class Demo');
cls.addProperty('items', [1,2,3], 'private', 'number[]');
cls.addMethod('constructor', [], 'this.items = Array.from({length: 10}, (_,i)=>i+1);');
console.log(cls.toString());

//Output string
class Demo {
  #items = [1,2,3];
  constructor() {
    this.items = Array.from({length: 10}, (_,i)=>i+1);
  }
}
*/