  
  /**
   * Minimally modified podman.ts file from NiceNode to test Run Command output
   */
  import type Node from './node';
  import { getContainerName, getImageTag } from './node.js';
  import type { DockerExecution as PodmanExecution } from './nodeSpec.js';

  import {
    type ConfigTranslationMap,
    type ConfigValuesMap,
    buildCliConfig,
  } from './nodeConfig';
  
  const createPodmanPortInput = (
    configTranslation: ConfigTranslationMap,
    configValuesMap?: ConfigValuesMap,
  ) => {
    const {
      p2pPorts,
      p2pPortsUdp,
      p2pPortsTcp,
      enginePort,
      httpPort,
      webSocketsPort,
      quicPortUdp = undefined,
      gRpcPort,
    } = configTranslation;
    const {
      p2pPorts: configP2pPorts,
      p2pPortsUdp: configP2pPortsUdp,
      p2pPortsTcp: configP2pPortsTcp,
      enginePort: configEnginePort,
      httpPort: configHttpPort,
      webSocketsPort: configWsPort,
      quicPortUdp: configQuicPortUdp,
      gRpcPort: configGRpcPort,
    } = configValuesMap || {};
    const result = [];
  
    // Handle p2p ports
    if (configP2pPortsUdp || p2pPortsUdp || configP2pPortsTcp || p2pPortsTcp) {
      const p2pUdpValue = configP2pPortsUdp || p2pPortsUdp?.defaultValue;
      const p2pTcpValue = configP2pPortsTcp || p2pPortsTcp?.defaultValue;
  
      if (p2pTcpValue) {
        result.push(`-p ${p2pTcpValue}:${p2pTcpValue}/tcp`);
      }
      if (p2pUdpValue) {
        result.push(`-p ${p2pUdpValue}:${p2pUdpValue}/udp`);
      }
    } else if (configP2pPorts || p2pPorts) {
      const p2pValue = configP2pPorts || p2pPorts?.defaultValue;
      if (p2pValue) {
        result.push(`-p ${p2pValue}:${p2pValue}/tcp`);
        result.push(`-p ${p2pValue}:${p2pValue}/udp`);
      }
    }
  
    // Handle http port
    const restPortValue = configHttpPort || httpPort?.defaultValue;
    if (restPortValue) {
      result.push(`-p ${restPortValue}:${restPortValue}`);
    }
  
    // Handle ws port if it exists
    const wsPortValue = configWsPort || webSocketsPort?.defaultValue;
    if (wsPortValue) {
      result.push(`-p ${wsPortValue}:${wsPortValue}`);
    }
  
    // Handle engine port if it exists
    const enginePortValue = configEnginePort || enginePort?.defaultValue;
    if (enginePortValue) {
      result.push(`-p ${enginePortValue}:${enginePortValue}`);
    }
  
    // Handle quic port if it exists (only lighthouse)
    const quicPortValue = configQuicPortUdp || quicPortUdp?.defaultValue;
    if (quicPortValue) {
      result.push(`-p ${quicPortValue}:${quicPortValue}/udp`);
    }
  
    // Handle grpc port
    const gRpcPortValue = configGRpcPort || gRpcPort?.defaultValue;
    if (gRpcPortValue) {
      result.push(`-p ${gRpcPortValue}:${gRpcPortValue}`);
    }
  
    return result.join(' ');
  };
  
  export const createRunCommand = (node: Node): string => {
    const { specId, execution, configTranslation } = node.spec;
    const { imageName, input } = execution as PodmanExecution;
    // try catch? .. podman dameon might need to be restarted if a bad gateway error occurs
  
    let podmanPortInput = '';
    let podmanVolumePath = '';
    let finalPodmanInput = '';
    if (input?.docker) {
      if (configTranslation) {
        podmanPortInput = createPodmanPortInput(
          configTranslation,
          node.config.configValuesMap,
        );
      }
      podmanVolumePath = input.docker.containerVolumePath;
      finalPodmanInput = podmanPortInput + (input?.docker.raw ?? '');
  
      if (podmanVolumePath) {
        const volumePostFix = '';
        // if (process.platform === 'linux') {
          // SELinux fix: ":z" post-fix tells podman to mark the volume as shared
          // not required for all Linux distros, but for simplicity we include
          // cannot set this on Mac (and probably windows)
        //   volumePostFix = ':z';
        // }
        // We really do not want to have conditionals for specific nodes, however,
        //  this is justified as we iterate quickly for funding and prove NN work
        if (specId === 'hubble') {
          finalPodmanInput = `-v "${node.runtime.dataDir}/hub":${podmanVolumePath}/.hub${volumePostFix} -v "${node.runtime.dataDir}/rocks":${podmanVolumePath}/.rocks${volumePostFix} ${finalPodmanInput}`;
        } else {
          finalPodmanInput = `-v "${node.runtime.dataDir}":${podmanVolumePath}${volumePostFix} ${finalPodmanInput}`;
        }
      }
    }
    console.info(
      `finalPodmanInput ${JSON.stringify(node.config.configValuesMap)}`,
    );
    let nodeInput = '';
    if (input?.docker?.forcedRawNodeInput) {
      nodeInput = input?.docker?.forcedRawNodeInput;
    }
  
    // Exclue keys with initCommandConfig=true
    let initCommandConfigKeys: string[] = [];
    if (node?.spec?.configTranslation !== undefined) {
      initCommandConfigKeys = Object.keys(node?.spec?.configTranslation).filter(
        (configKey) => {
          const configTranslation = node?.spec?.configTranslation?.[configKey];
          return configTranslation?.initCommandConfig === true;
        },
      );
    }
  
    // Special case: "chainId" takes priority over "network"
    // chainId is disambiguous and allows a client like Nethermind) to
    // easily work for many chains and testnets. network="mainnet" is very ambiguous.
    // Only exclude node specification includes chainId
    const excludeConfigKeys = [
      'dataDir',
      'serviceVersion',
      ...initCommandConfigKeys,
    ];
    if (
      node.config.configValuesMap.chainId &&
      node.spec.configTranslation?.chainId
    ) {
      excludeConfigKeys.push('network');
    }
  
    const cliConfigInput = buildCliConfig({
      configValuesMap: node.config.configValuesMap,
      configTranslationMap: node.spec.configTranslation,
      excludeConfigKeys,
    });
    nodeInput += ` ${cliConfigInput}`;
  
    const imageTag = getImageTag(node);
    // if imageTage is empty, use then imageTag is already included in the imageName (backwards compatability)
    const imageNameWithTag =
      imageTag !== '' ? `${imageName}:${imageTag}` : imageName;
  
    const containerName = getContainerName(node);
    // -q quiets podman logs (pulling new image logs) so we can parse the containerId
    const podmanCommand = `run -q -d --name ${containerName} ${finalPodmanInput} ${imageNameWithTag} ${nodeInput}`;
    console.info(`podman run command ${podmanCommand}`);
    return podmanCommand;
  };
  
  export const createInitCommand = (node: Node): string => {
    const { specId, execution, configTranslation } = node.spec;
    const { imageName, input } = execution as PodmanExecution;
  
    let podmanPortInput = '';
    let podmanVolumePath = '';
    let finalPodmanInput = '';
    if (input?.docker) {
      if (configTranslation) {
        podmanPortInput = createPodmanPortInput(
          configTranslation,
          node.config.configValuesMap,
        );
      }
      podmanVolumePath = input.docker.containerVolumePath;
      finalPodmanInput = podmanPortInput + (input?.docker.raw ?? '');
  
      if (podmanVolumePath) {
        const volumePostFix = '';
        // if (process.platform === 'linux') {
        //   // SELinux fix: ":z" post-fix tells podman to mark the volume as shared
        //   // not required for all Linux distros, but for simplicity we include
        //   // cannot set this on Mac (and probably windows)
        //   volumePostFix = ':z';
        // }
        // We really do not want to have conditionals for specific nodes, however,
        //  this is justified as we iterate quickly for funding and prove NN works
        if (specId === 'hubble') {
          finalPodmanInput = `-v "${node.runtime.dataDir}/hub":${podmanVolumePath}/.hub${volumePostFix} -v "${node.runtime.dataDir}/rocks":${podmanVolumePath}/.rocks${volumePostFix} ${finalPodmanInput}`;
        } else {
          finalPodmanInput = `-v "${node.runtime.dataDir}":${podmanVolumePath}${volumePostFix} ${finalPodmanInput}`;
        }
      }
    }
    console.info(
      `createInitCommand: finalPodmanInput ${JSON.stringify(
        node.config.configValuesMap,
      )}`,
    );
    let nodeInput = '';
    if (input?.docker?.initNodeCommand) {
      nodeInput = input?.docker?.initNodeCommand;
    }
    // Might need to call buildCliConfig() here once we add more features to initCommand
    // Exclue keys without initCommandConfig=true
    let nonInitCommandConfigKeys: string[] = [];
    if (node?.spec?.configTranslation !== undefined) {
      nonInitCommandConfigKeys = Object.keys(
        node?.spec?.configTranslation,
      ).filter((configKey) => {
        const configTranslation = node?.spec?.configTranslation?.[configKey];
        return configTranslation?.initCommandConfig !== true;
      });
    }
    const excludeInitConfigKeys = [
      'dataDir',
      'serviceVersion',
      ...nonInitCommandConfigKeys,
    ];
    const cliConfigInput = buildCliConfig({
      configValuesMap: node.config.configValuesMap,
      configTranslationMap: node.spec.configTranslation,
      excludeConfigKeys: excludeInitConfigKeys,
    });
    nodeInput += ` ${cliConfigInput}`;
  
    const imageTag = getImageTag(node);
    // if imageTage is empty, use then imageTag is already included in the imageName (backwards compatability)
    const imageNameWithTag =
      imageTag !== '' ? `${imageName}:${imageTag}` : imageName;
  
    // -q quiets podman logs (pulling new image logs) so we can parse the containerId
    // -d is not used here as this should be short-lived and we want to be blocked
    //  so that we know when to start the node
    const containerName = getContainerName(node);
    const podmanCommand = `run -q --name ${containerName} ${finalPodmanInput} ${imageNameWithTag} ${nodeInput}`;
    console.info(`createInitCommand: podman run command ${podmanCommand}`);
    return podmanCommand;
  };
  