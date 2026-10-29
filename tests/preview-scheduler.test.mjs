import test from 'node:test';
import assert from 'node:assert/strict';
import { createPreviewScheduler } from '../src/scripts/preview-scheduler.js';
function setup(limit=2) {
 let active=[];
 const scheduler=createPreviewScheduler(ids=>{active=ids;},limit);
 for(const id of ['a','b','c']) { scheduler.register(id,true); scheduler.visible(id,true); }
 return {scheduler, get active(){return active;}};
}
test('completed cycles rejoin behind waiting entries without interrupting active effects',()=>{
 const s=setup(); assert.deepEqual(s.active,['a','b']);
 s.scheduler.complete('a'); assert.deepEqual(s.active,['b','c']);
 s.scheduler.requeue('a'); assert.deepEqual(s.active,['b','c']);
 s.scheduler.complete('b'); assert.deepEqual(s.active,['c','a']);
 s.scheduler.requeue('b'); s.scheduler.complete('c'); assert.deepEqual(s.active,['a','b']);
});
test('static examples never consume a slot; offscreen and removed effects release slots',()=>{
 const s=setup(); s.scheduler.register('static',false); s.scheduler.visible('static',true);
 s.scheduler.visible('a',false); assert.deepEqual(s.active,['b','c']);
 s.scheduler.remove('b'); assert.deepEqual(s.active,['c']);
 s.scheduler.remove('c'); assert.deepEqual(s.active,[]);
 s.scheduler.requeue('b'); assert.deepEqual(s.active,[]);
});
test('mobile and hidden or reduced-motion states obey execution limits',()=>{
 const s=setup(); s.scheduler.configure({limit:1,hidden:false}); assert.deepEqual(s.active,['a']);
 s.scheduler.configure({limit:1,hidden:true}); assert.deepEqual(s.active,[]);
 s.scheduler.complete('a'); s.scheduler.requeue('a'); assert.deepEqual(s.active,[]);
 s.scheduler.configure({limit:1,hidden:false}); assert.deepEqual(s.active,['b']);
 s.scheduler.stop('b'); assert.deepEqual(s.active,['c']);
});


test('all visible cards resume independently without waiting for another cycle',()=>{
 const s=setup(14);
 assert.deepEqual(s.active,['a','b','c']);
 s.scheduler.complete('a'); assert.deepEqual(s.active,['b','c']);
 s.scheduler.requeue('a'); assert.deepEqual(s.active,['b','c','a']);
 s.scheduler.visible('c',false); assert.deepEqual(s.active,['b','a']);
 s.scheduler.configure({limit:14,hidden:true}); assert.deepEqual(s.active,[]);
 s.scheduler.configure({limit:14,hidden:false}); assert.deepEqual(s.active,['b','a']);
 s.scheduler.stop('b'); assert.deepEqual(s.active,['a']);
});
