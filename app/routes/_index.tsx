import type { MetaFunction } from "@vercel/remix";
import type { Change } from 'diff';
import {diffChars, diffJson, diffLines} from 'diff';
import { useState } from "react";

import { gethv1 } from "../util";


export const meta: MetaFunction = () => {
  return [
    { title: "Spec upgrade tool" },
    { name: "compare a new spec to an old spec", content: "Spec upgrade tool" },
  ];
};

const fmt = (a: any) => JSON.stringify(a, undefined, 4);

export default function Index() {
  const [oldText, setOldText] = useState('{ "name": "old spec" }');
  const [newText, setNewText] = useState('{ "name": "new spec" }');
  
  const diff2 = diffJson(oldText, newText, { ignoreWhitespace: false });

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Node spec tools</h1>
      <button type='button' onClick={() => { setOldText(fmt(gethv1)); setNewText(fmt(gethv1)) }}>Load Geth's spec</button>
      <div>
        <textarea value={oldText} onChange={(e) => setOldText(e.target.value)} placeholder="Old spec" style={{width: 
        '49%', height: '300px'
        }}/>
        <textarea value={newText} onChange={(e) => setNewText(e.target.value)} placeholder="New spec"  style={{width: 
        '49%', height: '300px'
        }}/>
      </div>

      <br/>
      <h3>User difference</h3>

      <br/>
      <h3>Raw difference</h3>
      {diff2?.map((part: Change, index: number) => {
        const color = part.added ? 'green' : part.removed ? 'red' : 'grey';
        // if(color === 'grey') return undefined;
        console.log("part.value: ", part.value)
        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
        return <div key={index} style={{ color }}>{part.value}</div>;
      })}
    </div>
  );
}
