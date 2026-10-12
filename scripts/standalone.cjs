'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
let html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const css=fs.readFileSync(path.join(root,'styles.css'),'utf8');
html=html.replace('<link rel="stylesheet" href="./styles.css">',()=>'<style>'+css+'</style>');
for(const file of ['core.js','content.js','app.js']){
 const js=fs.readFileSync(path.join(root,file),'utf8').replace(/<\/script/gi,'<\\/script');
 html=html.replace('<script defer src="./'+file+'"></script>',()=>'<script defer>'+js+'</script>');
}
// Inline defer does not defer execution. Move all scripts after the body markup.
const scripts=[];html=html.replace(/<script defer>([\s\S]*?)<\/script>/g,(_,js)=>{scripts.push('<script>'+js+'</script>');return '';});
html=html.replace('</body>',()=>scripts.join('\n')+'\n</body>');
fs.writeFileSync(path.join(root,'splunk-helper-standalone.html'),html);
console.log('Created splunk-helper-standalone.html');
