import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(CustomEase);
const fillEase = CustomEase.create('buttonFill', '0.6,0,0.2,1');

export function initButtonEffect({ root, running = true, onConfirm } = {}) {
  const kind = root.dataset.buttonEffect;
  const buttons = [...root.querySelectorAll('.motion-button')];
  const original = [...root.querySelectorAll('*')].map(element => [element, element.getAttribute('style')]);
  const labels = [...root.querySelectorAll('.button-label')].map(element => [element, element.textContent]);
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const cleanups = [], controls = [], animations = new Set();
  let enabled = running, visible = true, observer;
  const own = animation => { animations.add(animation); return animation; };
  const listen = (element, event, callback) => {
    element.addEventListener(event, callback);
    cleanups.push(() => element.removeEventListener(event, callback));
  };
  const canPlay = () => enabled && visible && !document.hidden;
  let cancelHold = () => {};
  function sync() {
    if (!canPlay()) cancelHold();
    animations.forEach(animation => {
      if (kind === 'rotating-border') animation.paused(!canPlay() || reduce.matches);
      else if (!canPlay()) animation.pause();
    });
  }
  if(kind==='dock-magnify') {
    const dock=root.querySelector('.dock-menu');
    const setters=buttons.map(button=>({x:gsap.quickTo(button,'x',{duration:0.16,ease:'power2.out'}),scaleX:gsap.quickTo(button,'scaleX',{duration:0.16,ease:'power2.out'}),scaleY:gsap.quickTo(button,'scaleY',{duration:0.16,ease:'power2.out'})}));
    const widthTo=gsap.quickTo(dock,'width',{duration:0.16,ease:'power2.out'});
    setters.forEach(setter=>Object.values(setter).forEach(update=>own(update.tween)));
    own(widthTo.tween);
    let dockDisposed=false;
    const size=()=>parseFloat(getComputedStyle(buttons[0]).width);
    const layout=(clientX=null,immediate=false)=>{
      if(dockDisposed)return;
      const base=size(), gap=8, padding=10;
      const neutralWidth=buttons.length*base+(buttons.length-1)*gap+padding*2;
      const rect=dock.getBoundingClientRect();
      const left=rect.left+rect.width/2-neutralWidth/2;
      const sizes=buttons.map((_,index)=>{
        const center=left+padding+index*(base+gap)+base/2;
        const distance=clientX===null?1:Math.min(1,Math.abs(clientX-center)/(base*2.2));
        return base*(1+0.7*(Math.cos(distance*Math.PI)+1)/2);
      });
      let offset=padding;
      buttons.forEach((button,index)=>{
        const values={x:offset+(sizes[index]-base)/2,scale:sizes[index]/base};
        if(immediate||reduce.matches){setters[index].x.tween.pause();setters[index].scaleX.tween.pause();setters[index].scaleY.tween.pause();gsap.set(button,values);}
        else {setters[index].x(values.x);setters[index].scaleX(values.scale);setters[index].scaleY(values.scale);}
        offset+=sizes[index]+gap;
      });
      const width=offset-gap+padding;
      if(immediate||reduce.matches){widthTo.tween.pause();gsap.set(dock,{width});}
      else widthTo(width);
    };
    const move=event=>layout(event.clientX);
    const reset=()=>layout();
    controls.push({element:dock,enter:move,move,leave:reset,cancel:()=>layout(null,true)});
    listen(dock,'pointermove',event=>{if(event.pointerType!=='touch')move(event);});
    listen(dock,'pointerleave',()=>{if(!dock.contains(document.activeElement))reset();});
    buttons.forEach((button,index)=>listen(button,'focus',()=>{
      const rect=dock.getBoundingClientRect(),base=size();
      layout(rect.left+rect.width/2+(index-(buttons.length-1)/2)*(base+8));
    }));
    listen(dock,'focusout',()=>queueMicrotask(()=>{if(!dock.contains(document.activeElement))reset();}));
    listen(document,'visibilitychange',()=>{if(document.hidden)layout(null,true);});
    listen(reduce,'change',()=>layout(null,true));
    const resize=new ResizeObserver(()=>layout(null,true));resize.observe(root);
    cleanups.push(()=>{dockDisposed=true;resize.disconnect();gsap.killTweensOf([dock,...buttons]);});
    layout(null,true);
  }
  buttons.forEach(button => {
    if(kind==='dock-magnify')return;
    const control = { element: button };
    controls.push(control);
    const fill = button.querySelector('.button-fill');
    const label = button.querySelector('.button-label');
    let timeline;
    const cycle = { paused:true };
    if (kind === 'magnetic-button') {
        const zone = root.querySelector('.button-magnetic-zone');
        let tween;
        const move = (x,y,elastic=false) => {
          if (tween) { tween.kill(); animations.delete(tween); }
          tween = own(gsap.to([button,label],{x:i=>reduce.matches?0:x*(i?0.4:1),y:i=>reduce.matches?0:y*(i?0.4:1),duration:reduce.matches?0:elastic?0.65:0.22,ease:elastic?'elastic.out(1,0.4)':'power2.out'}));
        };
        control.element=zone;
        control.move=event=>{ if(event.pointerType==='touch')return; const rect=zone.getBoundingClientRect(); move(gsap.utils.clamp(-12,12,(event.clientX-rect.left-rect.width/2)*0.1),gsap.utils.clamp(-8,8,(event.clientY-rect.top-rect.height/2)*0.1)); };
        control.leave=()=>move(0,0,true);
        control.cancel=()=>{tween?.kill();gsap.set([button,label],{x:0,y:0});};
        listen(zone,'pointermove',control.move);
        listen(zone,'pointerleave',()=>move(0,0,true));
        listen(button,'blur',control.leave);
    } else if (kind === 'direction-aware-fill') {
      const origin = (x, y) => {
        const w=button.clientWidth, h=button.clientHeight;
        x=gsap.utils.clamp(0,w,x); y=gsap.utils.clamp(0,h,y);
        const diameter=2*Math.hypot(Math.max(x,w-x),Math.max(y,h-y));
        gsap.set(fill,{left:x,top:y,width:diameter,height:diameter,xPercent:-50,yPercent:-50,x:0,y:0});
      };
      const point = event => {
        const rect=button.getBoundingClientRect();
        origin(event ? event.clientX-rect.left-button.clientLeft : button.clientWidth/2,
          event ? event.clientY-rect.top-button.clientTop : button.clientHeight/2);
      };
        let hovered=false, keyboardFocus=false;
        const animate=(active,event)=>{
          point(event);
          if(timeline){timeline.kill();animations.delete(timeline);}
          timeline=own(gsap.timeline().to(fill,{scale:active?1:0,duration:reduce.matches?0:0.55,ease:fillEase},0)
            .to(button,{color:active?'#fff':'#496783',duration:reduce.matches?0:0.45},0));
        };
        control.cancel=()=>{timeline?.kill();hovered=false;keyboardFocus=false;gsap.set(fill,{scale:0});gsap.set(button,{color:'#496783'});};
        control.enter=event=>{hovered=true;keyboardFocus=false;animate(true,event);};
        control.leave=event=>{hovered=false;animate(false,event);};
        listen(button,'pointerenter',control.enter);
        listen(button,'pointerleave',control.leave);
        listen(button,'focus',()=>{if(!hovered){keyboardFocus=true;animate(true);}});
        listen(button,'blur',()=>{if(keyboardFocus&&!hovered)animate(false);keyboardFocus=false;});
        if(button.matches(':hover')){hovered=true;animate(true);}
        else if(button===document.activeElement){keyboardFocus=true;animate(true);}
    } else if (kind === 'rotating-border') {
      timeline=own(gsap.to(button.querySelector('.button-border-light'),{rotation:360,duration:3,repeat:-1,ease:'none',paused:true}));
    } else if (kind === 'ripple-click') {
      timeline=own(gsap.timeline(cycle).fromTo(fill,{scale:0,opacity:0.7},{scale:1,opacity:0,duration:0.7,ease:'power2.out'}));
      control.click=event=>{
        const rect=button.getBoundingClientRect();
        gsap.set(fill,{left:event.detail?event.clientX-rect.left:rect.width/2,top:event.detail?event.clientY-rect.top:rect.height/2});
        timeline.timeScale(reduce.matches?100:1).restart();
      };
      control.cancel=()=>timeline.pause(0);
      listen(button,'click',control.click);
    } else if (kind === 'hold-to-confirm') {
      const progress={value:0};
      let held=false, complete=false, reset, notify=true;
      const render=()=>{ gsap.set(fill,{scaleX:progress.value}); label.textContent=progress.value>=0.999?'已確認 ✓':'按住確認'; };
      timeline=own(gsap.to(progress,{value:1,duration:1.2,ease:'none',paused:true,onUpdate:render,onComplete:()=>{
        if(!held)return;
        complete=true; button.dataset.confirmed='true';
        if(notify){onConfirm?.();button.dispatchEvent(new CustomEvent('confirmed',{bubbles:true}));}
      }}));
      const cancel=()=>{
        held=false;
        timeline.pause();
        if(reset){reset.kill();animations.delete(reset);}
        if(!canPlay()) { progress.value=0; complete=false; delete button.dataset.confirmed; render(); return; }
        reset=own(gsap.to(progress,{value:0,duration:reduce.matches?0:0.25,delay:complete?0.6:0,onUpdate:render,onComplete:()=>{complete=false;delete button.dataset.confirmed;}}));
      };
      cancelHold=cancel;
      const start=(commit=true)=>{
        if(held||complete||!canPlay())return;
        reset?.kill(); notify=commit; held=true;
        timeline.restart();
      };
      control.press=start;
      control.release=cancel;
      control.cancel=()=>{held=false;complete=false;timeline.pause(0);reset?.kill();progress.value=0;delete button.dataset.confirmed;render();};
        listen(button,'pointerdown',event=>{if(event.button!==0)return; event.preventDefault();button.focus();button.setPointerCapture(event.pointerId);start();});
        listen(button,'pointerup',cancel); listen(button,'pointercancel',cancel);
        listen(button,'lostpointercapture',()=>{if(held)cancel();});
        listen(button,'pointermove',event=>{if(!held)return;const r=button.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)cancel();});
        listen(button,'keydown',event=>{if([' ','Enter'].includes(event.key)){event.preventDefault();if(!event.repeat)start();}if(event.key==='Escape')cancel();});
        listen(button,'keyup',event=>{if([' ','Enter'].includes(event.key)){event.preventDefault();cancel();}});
        listen(button,'blur',cancel);
        listen(button,'contextmenu',event=>event.preventDefault());
    } else {
      timeline=own(gsap.timeline(cycle));
      if(kind==='icon-slide-button') timeline.to(button.querySelector('.button-arrow--out'),{x:48,duration:0.35},0).to(button.querySelector('.button-arrow--in'),{x:0,duration:0.35},0).to(label,{x:12,duration:0.35},0);
      if(kind==='social-icon-fill') timeline.to(fill,{yPercent:-100,duration:0.4},0).to(button.querySelector('.social-icon--first'),{y:-48,duration:0.4},0).to(button.querySelector('.social-icon--next'),{y:0,duration:0.4},0).to(button,{y:-4,duration:0.4},0);
        const enter=()=>{if(reduce.matches)timeline.progress(1).pause();else timeline.play();};
        const leave=()=>{if(reduce.matches)timeline.progress(0).pause();else timeline.reverse();};
        control.enter=enter;control.leave=leave;control.cancel=()=>timeline.pause(0);
        listen(button,'pointerenter',enter);listen(button,'pointerleave',leave);
        listen(button,'focus',()=>enter());listen(button,'blur',()=>leave());
        if(button===document.activeElement || button.matches(':hover')) enter();
    }
  });
  listen(document,'visibilitychange',sync);
  listen(window,'blur',()=>cancelHold());
  listen(reduce,'change',()=>{
    cancelHold();
    if(reduce.matches) animations.forEach(animation=>animation.progress(0).pause());
    sync();
  });
  {observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();});observer.observe(root);}
  sync();
  return {controls,setRunning(value){enabled=value;sync();},destroy(){observer?.disconnect();cleanups.forEach(fn=>fn());animations.forEach(a=>a.kill());gsap.set(original.map(([element])=>element),{clearProps:"all"});original.forEach(([element,style])=>{if(style===null)element.removeAttribute('style');else element.setAttribute('style',style);});labels.forEach(([element,text])=>element.textContent=text);buttons.forEach(button=>delete button.dataset.confirmed);}};
}

