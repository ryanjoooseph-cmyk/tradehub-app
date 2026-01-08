import React from 'react';
export function Card(props:{title?:string; children?:React.ReactNode; className?:string; footer?:React.ReactNode}){
  return (
    <div className={`card ${props.className??''}`}>
      {props.title && <div className="hd">{props.title}</div>}
      <div className="bd">{props.children}</div>
      {props.footer}
    </div>
  );
}
