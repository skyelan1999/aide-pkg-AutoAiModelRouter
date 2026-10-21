'use strict';
module.exports = {name:'auto-ai-model-router', apply(ctx) {
  ctx.provide('auto-ai-model-router.catalog', {protocol:1});
  ctx.tool({name:'auto_model_router_catalog', description:'读取离线模型能力档案及官方来源。权重是选型启发式，不是官方跨厂商统一排名；本工具不联网、不读取 API 密钥。',
    parameters:{type:'object',properties:{},additionalProperties:false}, scheduling:{resources:[]},
    handler:()=>{ const catalog = require('./capabilities.json'); return {revision:catalog.revision, checkedAt:catalog.checkedAt, policyNote:catalog.policyNote, models:catalog.models, sources:catalog.sources}; }});
}};
