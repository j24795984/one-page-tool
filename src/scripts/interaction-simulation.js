import { gsap } from 'gsap';
import '../styles/interaction-simulation.css';

// Coordinates describe gestures relative to each target, independently of its effect.
export function interactionSteps(kind, count) {
  const move=(index,x,y,duration=0.65)=>({index,x,y,duration});
  const wait=duration=>({duration});
  if(kind==='rotating-border')return [];
  if(kind==='search-box')return [move(0,0.5,0.5),{action:'click'},wait(0.9),move(1,0.5,0.5),{action:'click'},wait(0.75)];
  if(kind==='dock-magnify')return [move(0,-0.05,0.65,0),move(0,0.95,0.65,2.4),wait(0.25),move(0,0.05,0.65,2.4),move(0,-0.1,0.65,0.3),wait(0.3)];
  if(kind==='magnetic-button')return [move(0,-0.1,0.5,0),move(0,0.3,0.35),move(0,0.75,0.65,0.9),move(0,0.35,0.65,0.8),move(0,1.1,0.5),wait(0.4)];
  if(kind==='direction-aware-fill')return [[-0.15,0.5,1.15,0.5],[0.5,-0.5,0.5,1.5],[1.15,0.5,-0.15,0.5],[0.5,1.5,0.5,-0.5]].flatMap(([x,y,ex,ey])=>[move(0,x,y,0.25),move(0,0.5,0.5,0.65),wait(0.3),move(0,ex,ey,0.65),wait(0.55)]);
  if(kind==='ripple-click')return [0.25,0.7,0.45].flatMap(x=>[move(0,x,0.5),{action:'click'},wait(0.75)]);
  if(kind==='hold-to-confirm')return [move(0,0.5,0.5),{action:'press'},wait(0.4),{action:'release'},wait(0.5),{action:'press'},wait(1.25),{action:'release'},wait(0.8),move(0,1.2,0.5)];
  if(kind==='liquid-radio')return [1,2,1,0].flatMap(index=>[move(index,0.12,0.5),{action:'click'},wait(0.8)]);
  return Array.from({length:count},(_,index)=>[move(index,0.5,1.6,0.3),move(index,0.5,0.5),wait(0.55),move(index,0.5,1.6),wait(0.45)]).flat();
}

export function initInteractionSimulation({root,kind,controls}) {
  const steps=interactionSteps(kind,controls.length);
  if(!steps.length)return {setRunning(){},destroy(){}};
  const cursor=document.createElement('span');
  cursor.className='preview-cursor';cursor.setAttribute('aria-hidden','true');cursor.hidden=true;
  root.append(cursor);
  const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
  let enabled=false,timeline,hovered=null,target=controls[0],active=false;
  const position={x:0,y:0};
  const event=()=>({clientX:position.x,clientY:position.y,detail:1});
  function render(){
    const box=root.getBoundingClientRect();
    cursor.style.transform=`translate(${position.x-box.left}px,${position.y-box.top}px)`;
    const next=controls.find(control=>{const r=control.element.getBoundingClientRect();return position.x>=r.left&&position.x<=r.right&&position.y>=r.top&&position.y<=r.bottom;});
    if(next!==hovered){hovered?.leave?.(event());hovered=next;hovered?.enter?.(event());}
    hovered?.move?.(event());
  }
  function stop(){
    timeline?.kill();timeline=null;cursor.hidden=true;cursor.classList.remove('is-pressed');
    if(active){hovered?.leave?.(event());controls.forEach(control=>control.cancel?.());}
    hovered=null;active=false;
  }
  function start(){
    const initial=controls[0].element.getBoundingClientRect();
    position.x=initial.left-12;position.y=initial.top+initial.height/2;
    active=true;cursor.hidden=false;render();
    timeline=gsap.timeline({repeat:-1,repeatDelay:0.2});
    steps.forEach(step=>{
      if(step.action)timeline.call(()=>{
        cursor.classList.toggle('is-pressed',step.action==='press'||step.action==='click');
        if(step.action==='press')target.press?.(false);
        else target[step.action]?.(event());
      });
      else if(step.index!==undefined){
        const from={},to={};
        timeline.call(()=>{
          target=controls[step.index];const r=target.element.getBoundingClientRect();
          Object.assign(from,position);to.x=r.left+r.width*step.x;to.y=r.top+r.height*step.y;
          cursor.classList.remove('is-pressed');
        });
        const progress={value:0};
        timeline.fromTo(progress,{value:0},{value:1,duration:step.duration,ease:'power1.inOut',immediateRender:false,onUpdate:()=>{
          position.x=from.x+(to.x-from.x)*progress.value;position.y=from.y+(to.y-from.y)*progress.value;render();
        }});
      } else timeline.to({}, {duration:step.duration});
    });
  }
  function sync(){const next=enabled&&!document.hidden&&!preference.matches;if(next&&!active)start();else if(!next&&active)stop();}
  document.addEventListener('visibilitychange',sync);preference.addEventListener('change',sync);
  return {setRunning(value){enabled=value;sync();},destroy(){stop();cursor.remove();document.removeEventListener('visibilitychange',sync);preference.removeEventListener('change',sync);}};
}
