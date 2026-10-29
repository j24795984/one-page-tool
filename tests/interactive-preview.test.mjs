import test from 'node:test';
import assert from 'node:assert/strict';
import { initInteractivePreview } from '../src/scripts/interactive-preview.js';

function setup(t, hovered=false) {
  t.mock.timers.enable({ apis:['setTimeout'] });
  const root=new EventTarget(), focus={};
  root.matches=()=>hovered;
  root.contains=element=>element===focus;
  const previous=globalThis.document;
  globalThis.document={activeElement:null};
  t.after(()=>{globalThis.document=previous;});
  const modes=[];
  let live=0;
  const controller=initInteractivePreview({root,preview:true,running:true,create:options=>{
    assert.equal(++live,1,'only one controller may own the preview');
    assert.equal(options.preview,undefined,'effect has no demonstration mode');
    return {destroy(){live--;},setRunning(){}};
  },simulate:()=>{let active;return {setRunning(value){if(value!==active){active=value;modes.push(value?'auto':'manual');}},destroy(){}};}});
  return {root,focus,modes,controller};
}

test('leave allows return animation; reentry cancels pending autoplay',t=>{
  const {root,modes,controller}=setup(t);
  root.dispatchEvent(new Event('pointerover'));
  root.dispatchEvent(new Event('pointerleave'));
  t.mock.timers.tick(800);
  assert.deepEqual(modes,['auto','manual']);
  root.dispatchEvent(new Event('pointerover'));
  t.mock.timers.tick(1000);
  assert.deepEqual(modes,['auto','manual']);
  root.dispatchEvent(new Event('pointerleave'));
  t.mock.timers.tick(900);
  assert.deepEqual(modes,['auto','manual','auto']);
  controller.destroy();
});

test('focus retains manual ownership after pointer leaves',async t=>{
  const {root,focus,modes,controller}=setup(t);
  document.activeElement=focus;
  root.dispatchEvent(new Event('focusin'));
  root.dispatchEvent(new Event('pointerleave'));
  t.mock.timers.tick(2000);
  assert.deepEqual(modes,['auto','manual']);
  document.activeElement=null;
  root.dispatchEvent(new Event('focusout'));
  await Promise.resolve();
  t.mock.timers.tick(900);
  assert.deepEqual(modes,['auto','manual','auto']);
  controller.destroy();
});

test('mount under pointer starts manual; disposal cancels pending resume',t=>{
  const {root,modes,controller}=setup(t,true);
  assert.deepEqual(modes,['manual']);
  root.dispatchEvent(new Event('pointerleave'));
  controller.destroy();
  t.mock.timers.tick(2000);
  assert.deepEqual(modes,['manual']);
});

test('pausing automatic execution does not disable real input or recreate effects',t=>{
  const {root,modes,controller}=setup(t);
  controller.setRunning(false);
  assert.deepEqual(modes,['auto','manual']);
  root.dispatchEvent(new Event('pointerover'));
  controller.setRunning(true);
  assert.deepEqual(modes,['auto','manual']);
  root.dispatchEvent(new Event('pointerleave'));
  t.mock.timers.tick(900);
  assert.deepEqual(modes,['auto','manual','auto']);
  controller.destroy();
});
