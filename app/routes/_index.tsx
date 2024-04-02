import type { MetaFunction } from "@vercel/remix";
import type { Change } from 'diff';
import {diffChars, diffJson, diffLines} from 'diff';
import { useEffect, useState } from "react";

import { gethv1 } from "../util";
import type { NodeSpecification } from "../lib/nodeSpec";
import type { UserSpecDiff} from "../specDiff";
import { calcUserSpecDiff } from "../specDiff";


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
  const [oldSpec, setOldSpec] = useState<NodeSpecification>();
  const [newSpec, setNewSpec] = useState<NodeSpecification>();
  const [userSpecDiffs, setUserSpecDiffs] = useState<UserSpecDiff[]>();
  const [specDiffError, setSpecDiffError] = useState<string>();
  const [oldSpecParseError, setOldSpecParseError] = useState<string>();
  const [newSpecParseError, setNewSpecParseError] = useState<string>();

  useEffect(() => { 
    try {
      setOldSpec(JSON.parse(oldText));
      setOldSpecParseError(undefined);
    } catch(e) {
      console.error(e);
      setOldSpec(undefined);
      setOldSpecParseError((e as Error).message);
    }
  }, [oldText]);

  useEffect(() => { 
    try {
      setNewSpec(JSON.parse(newText));
      setNewSpecParseError(undefined);
    } catch(e) {
      console.error(e);
      setNewSpec(undefined);
      setNewSpecParseError((e as Error).message);
    }
  }, [newText]);

  useEffect(() => { 
    setSpecDiffError(undefined);
    let newUserSpecDiffs: UserSpecDiff[] | undefined = undefined;
    if(oldSpec && newSpec) {
      try {
        newUserSpecDiffs = calcUserSpecDiff(oldSpec, newSpec);
      } catch(e) {
        console.error(e);
        setSpecDiffError((e as Error).message);
      }
    }
    setUserSpecDiffs(newUserSpecDiffs);
  }, [oldSpec, newSpec]);
    
    
    const diff2 = diffJson(oldText, newText, { ignoreWhitespace: false });


  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Node spec tools</h1>
      <button type='button' onClick={() => { setOldText(fmt(gethv1)); setNewText(fmt(gethv1)) }}>Load Geth's spec</button>
      <div  style={{display: 'flex', flexDirection: 'row'}}>
        <div style={{display: 'flex', flexDirection: 'column', width: '49%'}}>
          <textarea value={oldText} onChange={(e) => setOldText(e.target.value)} placeholder="Old spec" style={{height: '300px'
          }}/>
          { oldSpecParseError && <span style={{ color: 'red' }}>{oldSpecParseError}</span> }
        </div>
        <div style={{display: 'flex', flexDirection: 'column', width: '49%'}}>
          <textarea value={newText} onChange={(e) => setNewText(e.target.value)} placeholder="New spec"  style={{height: '300px'
          }}/>
          { newSpecParseError && <span style={{ color: 'red' }}>{newSpecParseError}</span> }
        </div>

      </div>

      <br/>
      <h3>User difference</h3>
      { specDiffError && <div style={{ color: 'red' }}>{specDiffError}</div> }
      {userSpecDiffs?.map((diff: UserSpecDiff, index: number) => {
        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
        return <div key={index}>{diff.message}</div>;
      })}
      <br/>
      <h3>Raw difference</h3>
      {diff2?.map((part: Change, index: number) => {
        const color = part.added ? 'green' : part.removed ? 'red' : 'grey';
        // if(color === 'grey') return undefined;
        console.log("part.value: ", part.value)
        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
        return <div key={index} style={{ color }}>{part.value}</div>;
      })}
      <br/>
      <a href="http://incaseofstairs.com/jsdiff/" target="_blank" rel="noreferrer">jsdiff's demo</a>
      <br/>
      <a href="https://github.com/kpdecker/jsdiff?tab=readme-ov-file#usage" target="_blank" rel="noreferrer">jsdiff docs</a>
    </div>
  );
}
