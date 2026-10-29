// Owns input priority only. Effects remain mounted when ownership changes.
export function initInteractivePreview({ root, preview, running, create, simulate }) {
  const controller=create({running:true});
  const simulation=preview ? simulate?.(controller) : null;
  let hovering=root.matches(':hover'), disposed=false, resumeTimer;
  let manual=hovering||root.contains(document.activeElement);
  const sync=()=>{controller.setRunning(manual||running);simulation?.setRunning(running&&!manual);};
  const update=()=>{
    if(disposed||!preview)return;
    clearTimeout(resumeTimer);
    if(hovering||root.contains(document.activeElement)) {manual=true;sync();}
    else if(manual) resumeTimer=setTimeout(()=>{
      if(disposed||hovering||root.contains(document.activeElement))return;
      manual=false;sync();
    },900);
  };
  const enter=()=>{hovering=true;update();};
  const leave=()=>{hovering=false;update();};
  const blur=()=>queueMicrotask(update);
  const bindings=[['pointerover',enter,true],['pointerdown',enter,true],['pointerenter',enter],['pointerleave',leave],['focusin',update,true],['focusout',blur]];
  if(preview) bindings.forEach(([event,handler,capture])=>root.addEventListener(event,handler,capture));
  sync();
  return {
    setRunning(value){running=value;sync();},
    destroy(){disposed=true;clearTimeout(resumeTimer);bindings.forEach(([event,handler,capture])=>root.removeEventListener(event,handler,capture));simulation?.destroy();controller.destroy();}
  };
}
