const test = require('node:test');
const assert = require('node:assert/strict');
const C = require('../core.js');
test('quotes values so a pipe or quote stays inside a filter literal',()=>{
 const s=C.defaults();s.groups=[{join:'AND',rules:[{field:'productName',op:'=',value:'a" | delete'}]}];
 assert.match(C.compile(s).spl,/productName="a\\" \| delete"/);
});
test('keeps grouped OR separate from outer AND',()=>{
 const s=C.defaults();s.groups=[{join:'OR',rules:[{field:'status',op:'=',value:'404'},{field:'status',op:'=',value:'500'}]},{join:'AND',rules:[{field:'action',op:'=',value:'purchase'}]}];
 assert.match(C.compile(s).spl,/\(status=404 OR status=500\) AND \(action="purchase"\)/);
});
test('rejects command-like field names and zero bucket widths',()=>{
 const s=C.defaults();s.groups[0].rules[0].field='status | delete';assert.ok(C.compile(s).errors.length);
 s.groups=[];s.output='trend';s.span='0d';assert.ok(C.compile(s).errors.length);
});
test('summarizes purchases and filters calculated counts after stats',()=>{
 const s=C.defaults();s.output='stats';s.groups=[{join:'AND',rules:[{field:'action',op:'=',value:'purchase'}]}];s.by='clientip';s.metrics=[{fn:'count',field:'',alias:'Purchases'}];s.summary={field:'Purchases',op:'>',value:'1'};s.sort='Purchases';s.limit='10';
 const q=C.compile(s);assert.ok(q.spl.indexOf('| where Purchases>1')>q.spl.indexOf('| stats'));
 const p=C.preview(s);assert.ok(p.rows.length>0);assert.ok(p.rows.every(r=>r.Purchases>1));
});
test('neq excludes absent values and NOT-equal includes them',()=>{
 const data=[{status:200},{status:500},{}];const s=C.defaults();s.index='';s.sourcetype='';s.source='';s.host='';s.output='events';s.sort='';s.columns='status';s.limit='';s.groups=[{join:'AND',rules:[{field:'status',op:'!=',value:'200'}]}];
 assert.equal(C.preview(s,data).rows.length,1);s.groups[0].rules[0].op='NOT=';assert.equal(C.preview(s,data).rows.length,2);
});
test('aggregates unique values and protects a zero denominator',()=>{
 const s=C.defaults();s.groups=[];s.index='';s.sourcetype='';s.output='stats';s.sort='';s.by='';s.metrics=[{fn:'dc',field:'user',alias:'Users'},{fn:'sum',field:'bytes',alias:'Bytes'}];s.ratio={enabled:true,name:'Rate',numerator:'Users',denominator:'Bytes',percent:true};
 const p=C.preview(s,[{user:'a',bytes:0},{user:'a',bytes:0},{user:'b',bytes:0}]);assert.equal(p.rows[0].Users,2);assert.equal(p.rows[0].Rate,null);assert.match(C.compile(s).spl,/null\(\)/);
});
test('unsupported manual expressions never appear as evaluated preview',()=>{
 const s=C.defaults();s.calculation='eval x=random()';assert.equal(C.preview(s).supported,false);
});
test('reports an unknown post-summary field before offering a query',()=>{
 const s=C.defaults();s.output='stats';s.metrics=[{fn:'count',alias:'Requests',field:''}];s.by='clientip';s.summary={field:'status',op:'=',value:'200'};assert.ok(C.compile(s).errors.some(x=>x.includes('status')));
});
test('top limits rows and computes percentages before limiting',()=>{
 const s=C.defaults();s.groups=[];s.index='';s.sourcetype='';s.output='top';s.by='user';s.limit='1';
 const p=C.preview(s,[{user:'a'},{user:'a'},{user:'b'}]);assert.equal(p.rows.length,1);assert.equal(p.rows[0].count,2);assert.ok(Math.abs(p.rows[0].percent-200/3)<0.001);
});
test('bounded imports reject invalid structures and retain only known model keys',()=>{
 assert.throws(()=>C.normalize(null));assert.throws(()=>C.normalize({groups:'bad'}));
 const s=C.normalize({...C.defaults(),unexpected:'ignored'});assert.equal(s.unexpected,undefined);
});
test('malformed imports cannot crash the real preview',()=>{
 for(const patch of [{keyword:{}},{groups:[{join:'AND',rules:[null]}]},{metrics:[null]},{ratio:{enabled:'yes'}}])assert.throws(()=>C.normalize({...C.defaults(),...patch}));
});
test('event and top outputs ignore unused invalid metric definitions',()=>{
 const s=C.defaults();s.metrics=[{fn:'sum',field:'',alias:'Bad'}];s.output='events';s.sort='';assert.deepEqual(C.compile(s).errors,[]);s.output='top';assert.deepEqual(C.compile(s).errors,[]);
});
test('tutorial preset emits accurate UTC date boundaries',()=>{
 const s=C.defaults();s.time='lab';assert.match(C.compile(s).spl,/earliest=1584835200 latest=1585440000/);
});
test('compiler and preview share trimmed values and aliases',()=>{
 const s=C.defaults();s.groups[0].rules[0].value=' 200 ';s.metrics[0].alias=' Purchases ';const p=C.preview(s);assert.ok(p.rows.length);assert.ok(Object.hasOwn(p.rows[0],'Purchases'));assert.equal(Object.hasOwn(p.rows[0],' Purchases '),false);
});
test('time and lexical extrema work on populated sample fields',()=>{
 const s=C.defaults();s.groups=[];s.by='';s.sort='';s.metrics=[{fn:'min',field:'_time',alias:'First'},{fn:'max',field:'productName',alias:'LastName'}];const p=C.preview(s);assert.equal(p.rows[0].First,Date.parse('2020-03-22T00:00:00.000Z')/1000);assert.equal(p.rows[0].LastName,'World of Cheese');
});
test('metric names cannot overwrite group fields',()=>{
 const s=C.defaults();s.metrics=[{fn:'count',field:'',alias:'clientip'}];s.sort='';assert.ok(C.compile(s).errors.some(x=>x.includes('group')));
});
test('pipeline inspection shows raw rows becoming grouped answers',()=>{
 const s=C.defaults();const frames=C.inspect(s);assert.equal(frames[0].rows.length,48);assert.equal(frames[1].rows.length,14);const stats=frames.find(f=>f.title==='Summarize events');assert.equal(stats.rows.length,3);assert.deepEqual(stats.columns,['clientip','Purchases','Products']);assert.ok(!stats.columns.includes('status'));
});
test('filtering every result row does not pretend to remove the columns',()=>{
 const s=C.defaults();s.output='top';s.by='productName';s.summary={field:'count',op:'>',value:'1000'};const frames=C.inspect(s),f=frames.find(x=>x.title==='Filter the output');assert.equal(f.rows.length,0);assert.deepEqual(f.columns,['productName','count','percent']);
 const t=C.defaults();t.metrics=[{fn:'count',field:'',alias:'Requests'},{fn:'sum',field:'bytes',alias:'Bytes'}];t.sort='';t.ratio={enabled:true,name:'Rate',numerator:'Bytes',denominator:'Requests',percent:false};t.summary={field:'Rate',op:'>',value:'1000000'};const p=C.preview(t);assert.equal(p.rows.length,0);assert.ok(p.columns.includes('Rate'));
});
