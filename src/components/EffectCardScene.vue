<script setup>
import { ref, onMounted, onBeforeUnmount, watch, inject } from 'vue';
import { getCardScene, sceneCss, number, objects } from '../data/card-scenes.js';
const props = defineProps({ id: String, running: Boolean });
const emit = defineEmits(['complete', 'error']);
const host = ref(null);
const { suspended } = inject('preview-controller');
let root, stage, observer, stopWatch;
let revision = 0;
let settled = false;
let replay = null;
let cleanup = () => {};
async function start() {
  const current = ++revision;
  if (!props.running && settled && !suspended.value) return;
  if (!props.running) { cleanup(); cleanup = () => {}; settled = false; }
  stage.classList.toggle('is-playing', props.running);
  if (!props.running) return;
  const valid = () => current === revision;
  const complete = () => { if (valid()) { settled = true; emit('complete'); } };
  if (settled && replay) { settled = false; replay(complete); return; }
  try {
    const { gsap } = await import('gsap');
    if (!valid()) return;
    cleanup(); cleanup = () => {}; settled = false;
    const q = selector => root.querySelector(selector);
    let effect, timeline, deadline;
    const abort = new AbortController();
    cleanup = () => { replay = null; clearTimeout(deadline); timeline?.kill(); abort.abort(); if (typeof effect === 'function') effect(); else effect?.destroy(); };
    const trip = (target, values, duration = 3) => {
      timeline = gsap.timeline({ onComplete: complete }).to(target, { ...values, duration:duration/1.5, ease:'power1.inOut', repeat:1, yoyo:true, repeatDelay:0.3 }, 0.2).to({}, {duration:0.3});
    };
    if (props.id === 'text-fade') {
      const { initFadeText } = await import('../scripts/text-fade.js');
      if (valid()) effect = initFadeText({root:stage, scroller:stage, previewCycle:true, onComplete:complete});
    } else if (props.id === 'text-fade-module') {
      const { createTextFade } = await import('../scripts/text-fade-module.mjs');
      if (!valid()) return;
      effect = createTextFade(q('#demo-text'), {gsap});
      effect.timeline.repeat(1).yoyo(true).repeatDelay(0.45).timeScale(1.5).eventCallback('onComplete',complete).play();
    } else if (props.id === 'number-scroll') {
      const { initNumberScroll } = await import('../scripts/number-scroll.js');
      if (!valid()) return;
      const s = number.defaults;
      effect = initNumberScroll({element:q('.number-scroll'), ...s, start:s.startValue,end:s.endValue,previewCycle:true,onComplete:complete});
    } else if (props.id === 'object-fade-active') {
      const { initObjectFadeActive } = await import('../scripts/object-fade-active.js');
      if (!valid()) return;
      stage.scrollTop = 0;
      effect = initObjectFadeActive({root:stage, scroller:stage, options:objects.defaults});
      trip(stage, {scrollTop:stage.scrollHeight-stage.clientHeight}, 4);
    } else if (props.id === 'svg-line-grow') {
      const { initSvgLineGrow } = await import('../scripts/svg-line-grow.js');
      if (valid()) effect = initSvgLineGrow({path:q('path'),repeat:1,speed:1.5,onComplete:complete});
    } else if (props.id === 'custom-scrollbar') {
      const { initCustomScrollbar } = await import('../scripts/custom-scrollbar.js');
      if (!valid()) return;
      const container = q('.custom-scrollbar-demo__container'); container.scrollTop=0;
      effect = initCustomScrollbar({container,track:q('.custom-scrollbar-demo__track'),thumb:q('.custom-scrollbar-demo__thumb')});
      trip(container,{scrollTop:container.scrollHeight-container.clientHeight},5);
    } else if (props.id === 'horizontal-scroll') {
      const list=q('.horizontal-scroll__list'); gsap.set(list,{x:0});
      trip(list,{x:-(list.scrollWidth-stage.clientWidth)},5);
    } else if (props.id === 'news-nav') {
      const nav=q('.category-nav'), indicator=q('.category-indicator');
      const links=[...root.querySelectorAll('.category-link')];
      const select = index => {
        const link=links[index];
        links.forEach((el,i)=>el.setAttribute('aria-pressed',String(i===index)));
        indicator.style.setProperty('--indicator-x',`${link.offsetLeft+link.offsetWidth/2}px`);
        indicator.style.setProperty('--indicator-y',`${link.offsetTop-indicator.offsetHeight-8}px`);
      };
      nav.classList.add('is-ready'); select(0);
      timeline=gsap.timeline({onComplete:complete}).call(()=>select(1),[],0.3).call(()=>select(2),[],1.1).call(()=>select(1),[],1.9).call(()=>select(0),[],2.7).to({}, {duration:0.5});
    } else if (props.id === 'dramatic-diagonal-carousel') {
      const { initDiagonalCarousel } = await import('../scripts/dramaticDiagonalCarousel.js');
      if (!valid()) return;
      effect=initDiagonalCarousel(q('[data-diagonal-carousel]'),{interactive:false,duration:700});
      timeline=gsap.timeline({onComplete:complete}).call(()=>effect.goTo(1),[],0.2).call(()=>effect.goTo(2),[],1.2).call(()=>effect.goTo(1),[],2.2).call(()=>effect.goTo(0),[],3.2).to({}, {duration:1});
    } else if (props.id === 'infinite-drag-grid') {
      const { initInfiniteGrid } = await import('../scripts/infinite-drag-grid.js');
      if (!valid()) return;
      const container=q('#grid-container'); gsap.set(container,{x:0,y:0});
      const still = container.innerHTML;
      const grid=initInfiniteGrid(q('#viewport'),container,{interactive:false});
      effect={render:grid.render,destroy(){grid.destroy();container.innerHTML=still;}};
      trip(container,{x:-360,y:-200,onUpdate:()=>effect.render()},4);
    } else if (props.id === 'webgl-image-reveal') {
      const { initWebGLImageReveal } = await import('../scripts/webgl-image-reveal.js');
      if (!valid()) return;
      deadline=setTimeout(()=>{if(valid()){++revision;cleanup();emit('error');}},10000);
      effect=await initWebGLImageReveal({container:q('.webgl-canvas'),imageUrl:q('.webgl-still').src,width:800,height:500,signal:abort.signal});
      clearTimeout(deadline);
      if(!valid()){effect.destroy();return;}
      timeline=gsap.timeline({onComplete:complete}).call(()=>effect.play(2)).to({}, {duration:2.3}).call(()=>effect.reset(2)).to({}, {duration:2.3});
    }
    if (timeline) replay = onComplete => timeline.eventCallback('onComplete', onComplete).restart();
  } catch { if(valid()){cleanup();emit('error');} }
}
onMounted(() => {
  try {
    const scene=getCardScene(props.id);
    root=host.value.attachShadow({mode:'open'});
    root.innerHTML=`<style>:host{display:block;position:absolute;inset:0;overflow:hidden;}*{box-sizing:border-box;} .stage{position:absolute;width:800px;height:500px;overflow:hidden;transform-origin:top left;background:var(--surface-page,#f7f7f4);font-family:Inter,Arial,sans-serif;color:#314d74;} ${sceneCss(scene.css)} .diagonal-image{transition-duration:700ms;} .stage:not(.is-playing) *{transition:none!important;animation:none!important;}</style><div class="stage" inert>${scene.html}</div>`;
    stage=root.querySelector('.stage');
    if(props.id==='dramatic-diagonal-carousel') stage.querySelector('[data-slide]').dataset.state='active';
    observer=new ResizeObserver(([entry])=>{stage.style.transform=`scale(${entry.contentRect.width/800})`;});
    observer.observe(host.value);
    stopWatch=watch([()=>props.running,suspended],start,{immediate:true});
  } catch { emit('error'); }
});
onBeforeUnmount(()=>{++revision;stopWatch?.();observer?.disconnect();cleanup();});
</script>
<template><div ref="host" class="effect-card-scene" /></template>
