'use client';

import { useEffect, useRef, useState } from 'react';

export type MyriaVisualStatus='idle'|'observing'|'thinking'|'talking'|'error';

const BASE_PATH=process.env.NEXT_PUBLIC_BASE_PATH||'';
const PORTRAIT=process.env.NEXT_PUBLIC_MYRIA_AVATAR_IMAGE||`${BASE_PATH}/myria-avatar.svg`;
const RPM_SUBDOMAIN=process.env.NEXT_PUBLIC_RPM_SUBDOMAIN||'demo';
const MODEL_KEY='reforge-myria-rpm-model';

export function MyriaAvatar({status,onOpen,compact=false}:{status:MyriaVisualStatus;onOpen?:()=>void;compact?:boolean}){
  return <button type="button" className={`myria-portrait ${status} ${compact?'compact':''}`} onClick={onOpen} aria-label="Open Myria avatar studio" title="Myria avatar">
    <img src={PORTRAIT} alt="Myria, Reforge AI companion"/>
    <span className="myria-portrait-ring" aria-hidden/>
    <span className="myria-portrait-status" aria-hidden/>
  </button>;
}

export function MyriaAvatarStudio({onClose,onSaved}:{onClose:()=>void;onSaved?:(url:string)=>void}){
  const frameRef=useRef<HTMLIFrameElement|null>(null);
  const [modelUrl,setModelUrl]=useState('');
  const [state,setState]=useState('Create or edit Myria’s 3D body, then export it.');

  useEffect(()=>{
    setModelUrl(window.localStorage.getItem(MODEL_KEY)||'');
    const receive=(event:MessageEvent)=>{
      let payload=event.data;
      if(typeof payload==='string'){try{payload=JSON.parse(payload)}catch{return}}
      if(!payload||payload.source!=='readyplayerme')return;
      if(payload.eventName==='v1.frame.ready'){
        frameRef.current?.contentWindow?.postMessage(JSON.stringify({target:'readyplayerme',type:'subscribe',eventName:'v1.**'}),'*');
      }
      if(payload.eventName==='v1.avatar.exported'&&payload.data?.url){
        const url=String(payload.data.url);
        window.localStorage.setItem(MODEL_KEY,url);
        setModelUrl(url);
        setState('Avatar exported and linked to Myria on this device.');
        onSaved?.(url);
      }
    };
    window.addEventListener('message',receive);
    return()=>window.removeEventListener('message',receive);
  },[onSaved]);

  const src=`https://${RPM_SUBDOMAIN}.readyplayer.me/avatar?frameApi&bodyType=fullbody&clearCache=false`;

  return <div className="avatar-studio">
    <div className="avatar-studio-head">
      <div className="avatar-studio-title"><MyriaAvatar status="idle" compact/><div><p className="eyebrow">AI AVATAR</p><h2>Myria Avatar Studio</h2><p>{state}</p></div></div>
      <button type="button" className="close" onClick={onClose} aria-label="Close avatar studio">×</button>
    </div>
    <div className="avatar-studio-grid">
      <section className="avatar-preview-card">
        <MyriaAvatar status="observing"/>
        <strong>Myria</strong>
        <span>Persistent Reforge companion</span>
        {modelUrl?<small>3D model connected</small>:<small>Portrait active · 3D model optional</small>}
      </section>
      <iframe ref={frameRef} className="rpm-frame" title="Ready Player Me avatar creator" src={src} allow="camera *; microphone *; clipboard-write *"/>
    </div>
    {modelUrl&&<p className="avatar-model-url" title={modelUrl}>Model: {modelUrl}</p>}
  </div>;
}
