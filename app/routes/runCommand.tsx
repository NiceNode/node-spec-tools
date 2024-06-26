import type { MetaFunction } from "@vercel/remix";
import { useEffect, useState } from "react";

import { gethActiveControllerV1 } from "../gethActiveController";
import { createRunCommand } from "../lib/podman";
import type Node from "../lib/node";

export const meta: MetaFunction = () => {
	return [
		{ title: "Container Controllers" },
		{
			name: "Test a Controller's Run Command",
			content: "Controller's Run Command",
		},
	];
};

const fmt = (a: any) => JSON.stringify(a, undefined, 4);

export default function Index() {
	const [oldText, setOldText] = useState('{ "name": "node json" }');
	const [oldSpec, setOldSpec] = useState<Node>();
	const [runCommand, setRunCommand] = useState<string>("");
	const [specDiffError, setSpecDiffError] = useState<string>();
	const [oldSpecParseError, setOldSpecParseError] = useState<string>();

	useEffect(() => {
		try {
			setOldSpec(JSON.parse(oldText));
			setOldSpecParseError(undefined);
		} catch (e) {
			console.error(e);
			setOldSpec(undefined);
			setOldSpecParseError((e as Error).message);
		}
	}, [oldText]);

	useEffect(() => {
		setSpecDiffError(undefined);
		let runCommand = "";
		if (oldSpec) {
			try {
				runCommand = createRunCommand(oldSpec);
			} catch (e) {
				console.error(e);
				setSpecDiffError((e as Error).message);
			}
		}
		setRunCommand(runCommand);
	}, [oldSpec]);

	return (
		<div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
			<h1>Node spec tools - Container Controller Updates</h1>
			<button
				type="button"
				onClick={() => {
					setOldText(fmt(gethActiveControllerV1));
				}}
			>
				Load Geth Active Controller
			</button>
			<div style={{ display: "flex", flexDirection: "row" }}>
				<div style={{ display: "flex", flexDirection: "column", width: "49%" }}>
					<textarea
						value={oldText}
						onChange={(e) => setOldText(e.target.value)}
						placeholder="Old spec"
						style={{ height: "300px" }}
					/>
					{oldSpecParseError && (
						<span style={{ color: "red" }}>{oldSpecParseError}</span>
					)}
				</div>
			</div>

			<br />
			<h3>New Controller Config Values</h3>
			{specDiffError && <div style={{ color: "red" }}>{specDiffError}</div>}
			<div>
				<pre style={{ textWrap: "wrap" }}>{runCommand}</pre>
			</div>
		</div>
	);
}
