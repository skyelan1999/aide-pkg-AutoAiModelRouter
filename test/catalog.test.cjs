'use strict';
const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const root=path.resolve(__dirname,'..');const catalog=require('../capabilities.json');const manifest=require('../manifest.json');
test('archive declaration, sourced offline profiles and unique exact names',()=>{
 assert.equal(manifest.license,'MIT');assert.deepEqual(manifest.modelRouter,{protocol:1,catalog:'capabilities.json'});assert.equal(catalog.protocol,1);
 const sources=new Map(catalog.sources.map(s=>[s.id,s]));const names=new Set();
 for(const m of catalog.models){assert(sources.has(m.source));assert(m.contextWindow>=1024);for(const n of m.aliases){assert(!names.has(n.toLowerCase()),n);names.add(n.toLowerCase());}for(const v of Object.values(m.weights))assert(v>=1&&v<=5);}
 assert(names.has('deepseek-flash'));assert(names.has('gpt-5.4'));assert(names.has('claude-sonnet-4-6'));assert(names.has('gemini-3.1-pro-preview'));
 const official=['api-docs.deepseek.com','www.anthropic.com','developers.openai.com','ai.google.dev'];for(const s of sources.values())assert(official.includes(new URL(s.url).hostname));
 assert.match(catalog.policyNote,/heuristics/);assert.match(fs.readFileSync(path.join(root,'LICENSE'),'utf8'),/MIT License/);
});
test('plugin applies without credentials, network or filesystem host APIs',async()=>{
 const tools=[];const services=[];require('../index.js').apply({settings:{},provide:(name,value)=>services.push({name,value}),tool:def=>tools.push(def)});
 assert.equal(services.length,1);assert.equal(tools.length,1);assert.deepEqual(tools[0].scheduling,{resources:[]});
 const value=await tools[0].handler({},{});assert.equal(value.revision,catalog.revision);assert(!JSON.stringify(value).includes('apiKey'));assert.equal(value.models.length,catalog.models.length);
});
