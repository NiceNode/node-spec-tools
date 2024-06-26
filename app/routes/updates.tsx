import type { MetaFunction } from "@vercel/remix";
import type { Change } from "diff";
import { diffChars, diffJson, diffLines } from "diff";
import { useEffect, useState } from "react";

import { gethv1 } from "../util";
import type { NodeSpecification } from "../lib/nodeSpec";
import {
	type ConfigValuesMap,
	calcNewControllerConfig,
} from "../updateController";

export const meta: MetaFunction = () => {
	return [
		{ title: "Container Controllers" },
		{ name: "Controller Config Updates", content: "Controller Config Updates" },
	];
};

const fmt = (a: any) => JSON.stringify(a, undefined, 4);

export default function Index() {
	const [oldText, setOldText] = useState('{ "name": "new spec" }');
	const [newText, setNewText] = useState('{ "name": "node config" }');
	const [oldSpec, setOldSpec] = useState<NodeSpecification>();
	const [currentControllerConfig, setCurrentControllerConfig] =
		useState<ConfigValuesMap>();
	const [configValuesMaps, setConfigValuesMaps] = useState<ConfigValuesMap>({});
	const [specDiffError, setSpecDiffError] = useState<string>();
	const [oldSpecParseError, setOldSpecParseError] = useState<string>();
	const [
		currentControllerConfigParseError,
		setCurrentControllerConfigParseError,
	] = useState<string>();

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
		try {
			setCurrentControllerConfig(JSON.parse(newText));
			setCurrentControllerConfigParseError(undefined);
		} catch (e) {
			console.error(e);
			setCurrentControllerConfig(undefined);
			setCurrentControllerConfigParseError((e as Error).message);
		}
	}, [newText]);

	useEffect(() => {
		setSpecDiffError(undefined);
		let newConfigValuesMaps: ConfigValuesMap = {};
		if (oldSpec && currentControllerConfig) {
			try {
				newConfigValuesMaps = calcNewControllerConfig(
					oldSpec,
					currentControllerConfig,
				);
			} catch (e) {
				console.error(e);
				setSpecDiffError((e as Error).message);
			}
		}
		setConfigValuesMaps(newConfigValuesMaps);
	}, [oldSpec, currentControllerConfig]);

	const diff2 = diffJson(oldText, newText, { ignoreWhitespace: false });

	return (
		<div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
			<h1>Node spec tools - Container Controller Updates</h1>
			<button
				type="button"
				onClick={() => {
					setOldText(fmt(gethv1));
					setNewText(fmt(gethv1));
				}}
			>
				Load Geth's spec
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
				<div style={{ display: "flex", flexDirection: "column", width: "49%" }}>
					<textarea
						value={newText}
						onChange={(e) => setNewText(e.target.value)}
						placeholder="New spec"
						style={{ height: "300px" }}
					/>
					{currentControllerConfigParseError && (
						<span style={{ color: "red" }}>
							{currentControllerConfigParseError}
						</span>
					)}
				</div>
			</div>

			<br />
			<h3>Run Command for the Active Controller</h3>
			{specDiffError && <div style={{ color: "red" }}>{specDiffError}</div>}
			{Object.entries(configValuesMaps)?.map(([key, value]) => {
				return (
					<div key={key}>{`key ${key} value ${JSON.stringify(value)}`}</div>
				);
			})}
		</div>
	);
}
