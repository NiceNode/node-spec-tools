import type { NodeSpecification } from "./lib/nodeSpec";
import { assert } from "./util";

export type UserSpecDiff = {
    message: string;
}

// Only time a user default would be overridden is if the user default is not in the new spec as
// an option on a select config. In that case, the default should be used. So we should highlight any
// removal of select options.
// returns a list of changes
export const calcUserSpecDiff = (oldSpec: NodeSpecification, newSpec: NodeSpecification): UserSpecDiff[] => {
    assert(oldSpec.specId === newSpec.specId, "specId mismatch");
    assert(oldSpec.version < newSpec.version, "newSpec version is not greater than oldSpec version");
    const diffs: UserSpecDiff[] = [];
    diffs.push({ message: `Version: ${oldSpec.version} -> ${newSpec.version}`})
    return diffs;
}