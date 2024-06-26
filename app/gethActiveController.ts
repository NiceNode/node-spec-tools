export const gethActiveControllerV1 = {
  "id": "5762d2ed-66a9-4ac7-944f-e3baff22835b",
  "spec": {
  "specId": "geth",
  "version": "1.0.0",
  "displayName": "Geth",
  "execution": {
    "executionTypes": [
      "binary",
      "docker"
    ],
    "defaultExecutionType": "docker",
    "execPath": "geth",
    "input": {
      "defaultConfig": {
        "http": "Enabled",
        "httpCorsDomains": "http://localhost",
        "webSockets": "Enabled",
        "httpVirtualHosts": "localhost,host.containers.internal",
        "authVirtualHosts": "localhost,host.containers.internal",
        "httpAddress": "0.0.0.0",
        "webSocketAddress": "0.0.0.0",
        "syncMode": "snap"
      },
      "docker": {
        "containerVolumePath": "/root/.ethereum",
        "raw": "",
        "forcedRawNodeInput": "--authrpc.addr 0.0.0.0 --authrpc.jwtsecret /root/.ethereum/jwtsecret --ipcdisable"
      }
    },
    "imageName": "docker.io/ethereum/client-go",
    "defaultImageTag": "stable",
    "binaryDownload": {
      "type": "static",
      "darwin": {
        "amd64": "https://gethstore.blob.core.windows.net/builds/geth-darwin-amd64-1.10.23-d901d853.tar.gz"
      },
      "linux": {
        "amd64": "https://gethstore.blob.core.windows.net/builds/geth-linux-amd64-1.10.23-d901d853.tar.gz",
        "amd32": "https://gethstore.blob.core.windows.net/builds/geth-linux-386-1.10.23-d901d853.tar.gz",
        "arm64": "https://gethstore.blob.core.windows.net/builds/geth-linux-arm64-1.10.23-d901d853.tar.gz",
        "arm7": "https://gethstore.blob.core.windows.net/builds/geth-linux-arm7-1.10.23-d901d853.tar.gz"
      },
      "windows": {
        "amd64": "https://gethstore.blob.core.windows.net/builds/geth-windows-amd64-1.10.23-d901d853.zip",
        "amd32": "https://gethstore.blob.core.windows.net/builds/geth-windows-386-1.10.23-d901d853.zip"
      }
    }
  },
  "category": "L1/ExecutionClient",
  "rpcTranslation": "eth-l1",
  "systemRequirements": {
    "documentationUrl": "https://geth.ethereum.org/docs/interface/hardware",
    "cpu": {
      "cores": 4
    },
    "memory": {
      "minSizeGBs": 16
    },
    "storage": {
      "minSizeGBs": 1600,
      "ssdRequired": true
    },
    "internet": {
      "minDownloadSpeedMbps": 25,
      "minUploadSpeedMbps": 10
    },
    "docker": {
      "required": true
    }
  },
  "configTranslation": {
    "dataDir": {
      "displayName": "Data location",
      "cliConfigPrefix": "--datadir ",
      "defaultValue": "~/.ethereum",
      "uiControl": {
        "type": "filePath"
      },
      "infoDescription": "Data directory for the databases and keystore (default: \"~/.ethereum\")"
    },
    "network": {
      "displayName": "Network",
      "defaultValue": "Mainnet",
      "hideFromUserAfterStart": true,
      "uiControl": {
        "type": "select/single",
        "controlTranslations": [
          {
            "value": "Mainnet",
            "config": "--mainnet"
          },
          {
            "value": "Holesky",
            "config": "--holesky"
          },
          {
            "value": "Sepolia",
            "config": "--sepolia"
          }
        ]
      }
    },
    "http": {
      "displayName": "RPC HTTP connections",
      "uiControl": {
        "type": "select/single",
        "controlTranslations": [
          {
            "value": "Enabled",
            "config": "--http"
          },
          {
            "value": "Disabled"
          }
        ]
      },
      "defaultValue": "Disabled",
      "infoDescription": "NiceNode requires http connections",
      "documentation": "https://geth.ethereum.org/docs/rpc/server"
    },
    "webSockets": {
      "displayName": "WebSocket JSON-RPC connections",
      "uiControl": {
        "type": "select/single",
        "controlTranslations": [
          {
            "value": "Enabled",
            "config": "--ws"
          },
          {
            "value": "Disabled"
          }
        ]
      },
      "defaultValue": "Disabled",
      "infoDescription": "Enables or disables the WebSocket JSON-RPC service. Beacon nodes may require websockets. The default is false.",
      "documentation": "https://geth.ethereum.org/docs/rpc/server#websocket-server"
    },
    "webSocketsPort": {
      "displayName": "WebSockets JSON-RPC port",
      "cliConfigPrefix": "--ws.port ",
      "defaultValue": "8546",
      "uiControl": {
        "type": "text"
      },
      "infoDescription": "The port (TCP) on which WebSocket JSON-RPC listens. The default is 8546. You must expose ports appropriately.",
      "documentation": "https://geth.ethereum.org/docs/rpc/server#websocket-server"
    },
    "webSocketAddress": {
      "displayName": "WebSocket-RPC server listening interface",
      "cliConfigPrefix": "--ws.addr ",
      "defaultValue": "0.0.0.0",
      "uiControl": {
        "type": "text"
      },
      "documentation": "https://geth.ethereum.org/docs/interacting-with-geth/rpc#websockets-server"
    },
    "webSocketAllowedOrigins": {
      "displayName": "WebSocket-RPC allowed origins",
      "defaultValue": "http://localhost",
      "cliConfigPrefix": "--ws.origins ",
      "uiControl": {
        "type": "text"
      },
      "infoDescription": "Change where the node accepts web socket connections (use comma separated urls) or \"*\" for all"
    },
    "webSocketApis": {
      "displayName": "Enabled WebSocket APIs",
      "cliConfigPrefix": "--ws.api ",
      "defaultValue": [
        "eth",
        "net",
        "web3"
      ],
      "valuesJoinStr": ",",
      "uiControl": {
        "type": "select/multiple",
        "controlTranslations": [
          {
            "value": "eth",
            "config": "eth"
          },
          {
            "value": "net",
            "config": "net"
          },
          {
            "value": "web3",
            "config": "web3"
          },
          {
            "value": "debug",
            "config": "debug"
          },
          {
            "value": "personal",
            "config": "personal"
          },
          {
            "value": "admin",
            "config": "admin"
          }
        ]
      }
    },
    "httpApis": {
      "displayName": "Enabled HTTP APIs",
      "cliConfigPrefix": "--http.api ",
      "defaultValue": [
        "eth",
        "net",
        "web3"
      ],
      "valuesJoinStr": ",",
      "uiControl": {
        "type": "select/multiple",
        "controlTranslations": [
          {
            "value": "eth",
            "config": "eth"
          },
          {
            "value": "net",
            "config": "net"
          },
          {
            "value": "web3",
            "config": "web3"
          },
          {
            "value": "debug",
            "config": "debug"
          },
          {
            "value": "personal",
            "config": "personal"
          },
          {
            "value": "admin",
            "config": "admin"
          }
        ]
      }
    },
    "httpCorsDomains": {
      "displayName": "HTTP-RPC CORS domains",
      "cliConfigPrefix": "--http.corsdomain ",
      "uiControl": {
        "type": "text"
      },
      "infoDescription": "Change where the node accepts http connections (use comma separated urls)"
    },
    "syncMode": {
      "displayName": "Execution Client Sync Mode",
      "category": "Syncronization",
      "uiControl": {
        "type": "select/single",
        "controlTranslations": [
          {
            "value": "snap",
            "config": "--syncmode snap",
            "info": ""
          },
          {
            "value": "full",
            "config": "--syncmode full",
            "info": "~800GB / ~2d"
          },
          {
            "value": "archive",
            "config": "--syncmode full --gcmode archive",
            "info": "~16TB"
          }
        ]
      },
      "addNodeFlow": "required",
      "defaultValue": "snap",
      "hideFromUserAfterStart": true,
      "documentation": "https://geth.ethereum.org/docs/faq#how-does-ethereum-syncing-work"
    },
    "p2pPorts": {
      "displayName": "P2P port (UDP and TCP)",
      "cliConfigPrefix": "--discovery.port ",
      "uiControl": {
        "type": "text"
      },
      "infoDescription": "Example value: 30303",
      "defaultValue": "30303"
    },
    "enginePort": {
      "displayName": "Engine JSON-RPC listening port",
      "cliConfigPrefix": "--authrpc.port ",
      "defaultValue": "8551",
      "uiControl": {
        "type": "text"
      },
      "infoDescription": "The listening port for the Engine API calls for JSON-RPC over HTTP and WebSocket."
    },
    "httpVirtualHosts": {
      "displayName": "Virtual hostnames list",
      "cliConfigPrefix": "--http.vhosts ",
      "uiControl": {
        "type": "text"
      },
      "infoDescription": "Comma separated list of virtual hostnames from which to accept requests (server enforced). Accepts '*' wildcard. Default value (localhost)",
      "defaultValue": "localhost,host.containers.internal"
    },
    "httpAddress": {
      "displayName": "HTTP-RPC server listening interface",
      "cliConfigPrefix": "--http.addr ",
      "defaultValue": "0.0.0.0",
      "uiControl": {
        "type": "text"
      },
      "documentation": "https://geth.ethereum.org/docs/rpc/server#http-server"
    },
    "httpPort": {
      "displayName": "HTTP-RPC server listening port",
      "cliConfigPrefix": "--http.port ",
      "defaultValue": "8545",
      "uiControl": {
        "type": "text"
      },
      "documentation": "https://geth.ethereum.org/docs/rpc/server#http-server"
    },
    "maxPeerCount": {
      "displayName": "Max Peer Count",
      "cliConfigPrefix": "--maxpeers ",
      "defaultValue": "50",
      "uiControl": {
        "type": "text"
      },
      "infoDescription": "Set to lower number to use less bandwidth",
      "documentation": "https://geth.ethereum.org/docs/interface/peer-to-peer#peer-limit"
    },
    "authVirtualHosts": {
      "displayName": "Engine RPC virtual hostnames list",
      "cliConfigPrefix": "--authrpc.vhosts ",
      "uiControl": {
        "type": "text"
      },
      "infoDescription": "Comma separated list of virtual hostnames from which to accept authentication requests for engine api's (server enforced). Accepts '*' wildcard. Default value (localhost)",
      "defaultValue": "localhost,host.containers.internal"
    },
    "cliInput": {
      "displayName": "Geth CLI input",
      "uiControl": {
        "type": "text"
      },
      "defaultValue": "",
      "addNodeFlow": "advanced",
      "infoDescription": "Additional CLI input"
    },
    "serviceVersion": {
      "displayName": "Geth version",
      "uiControl": {
        "type": "text"
      },
      "defaultValue": "stable",
      "addNodeFlow": "advanced",
      "infoDescription": "Caution Advised! Example value: latest, v1.0.0, stable. Consult service documentation for available versions."
    }
  },
  "iconUrl": "https://clientdiversity.org/assets/img/execution-clients/geth-logo.png"
},
"config": {
  "configValuesMap": {
    "http": "Enabled",
    "httpCorsDomains": "http://localhost",
    "webSockets": "Enabled",
    "httpVirtualHosts": "localhost,host.containers.internal",
    "authVirtualHosts": "localhost,host.containers.internal",
    "httpAddress": "0.0.0.0",
    "webSocketAddress": "0.0.0.0",
    "syncMode": "snap",
    "network": "Mainnet",
    "dataDir": "/Users/johns/Library/Application Support/NiceNode/nodes/geth-1719433586",
    "httpPort": "8547",
    "p2pPorts": "30304",
    "enginePort": "8552",
    "webSocketsPort": "8548"
  }
},
"runtime": {
  "dataDir": "/Users/johns/Library/Application Support/NiceNode/nodes/geth-1719433586",
  "usage": {
    "diskGBs": [
      {
        "x": 1719433616866,
        "y": 0
      },
      {
        "x": 1719433601780,
        "y": 0
      }
    ],
    "memoryBytes": [
      {
        "x": 1719433616862,
        "y": 0
      },
      {
        "x": 1719433601778,
        "y": 0.2
      }
    ],
    "cpuPercent": [
      {
        "x": 1719433616862,
        "y": 0
      },
      {
        "x": 1719433601778,
        "y": 17.45
      }
    ],
    "syncedBlock": 0
  },
  "initialized": true,
  "processIds": [
    "4a5052c374e535acfe8570f53640e3fe7854680324bdb4a31ea2978d7be9bc0c"
  ]
},
"status": "stopped",
"createdTimestampMs": 1719433586231,
"lastStartedTimestampMs": 1719433586396,
"lastStoppedTimestampMs": 1719433611016,
"stoppedBy": "user"
};