export const clusterUtilization = {
    "resourceMetrics": [
      {
        "resource": {
          "attributes": [
            {
              "key": "k8s.node.name",
              "value": {
                "stringValue": "zagaocp-worker2"
              }
            }
          ]
        },
        "scopeMetrics": [
          {
            "metrics": [
              {
                "description": "Total cumulative CPU time (sum of all cores) spent by the container/pod/node since its creation",
                "name": "k8s.node.cpu.time",
                "sum": {
                  "aggregationTemporality": 2,
                  "dataPoints": [
                    {
                      "asDouble": "373779.280334",
                      "startTimeUnixNano": "1708205467000000000",
                      "timeUnixNano": "1708346694408438334"
                    }
                  ],
                  "isMonotonic": true
                },
                "unit": "s"
              },
              {
                "description": "Total CPU usage (sum of all cores per second) averaged over the sample window",
                "gauge": {
                  "dataPoints": [
                    {
                      "asDouble": "2.94851903",
                      "startTimeUnixNano": "1708205467000000000",
                      "timeUnixNano": "1708346694408438334"
                    }
                  ]
                },
                "name": "k8s.node.cpu.usage",
                "unit": "{cpu}"
              },
              {
                "description": "Node CPU utilization",
                "gauge": {
                  "dataPoints": [
                    {
                      "asDouble": "2.94851903",
                      "startTimeUnixNano": "1708205467000000000",
                      "timeUnixNano": "1708346694408438334"
                    }
                  ]
                },
                "name": "k8s.node.cpu.utilization",
                "unit": "1"
              },
              {
                "description": "Node filesystem available",
                "gauge": {
                  "dataPoints": [
                    {
                      "asInt": "170288898048",
                      "startTimeUnixNano": "1708205467000000000",
                      "timeUnixNano": "1708346694408438334"
                    }
                  ]
                },
                "name": "k8s.node.filesystem.available",
                "unit": "By"
              },
              {
                "description": "Node filesystem capacity",
                "gauge": {
                  "dataPoints": [
                    {
                      "asInt": "199110930432",
                      "startTimeUnixNano": "1708205467000000000",
                      "timeUnixNano": "1708346694408438334"
                    }
                  ]
                },
                "name": "k8s.node.filesystem.capacity",
                "unit": "By"
              },
              {
                "description": "Node filesystem usage",
                "gauge": {
                  "dataPoints": [
                    {
                      "asInt": "28822032384",
                      "startTimeUnixNano": "1708205467000000000",
                      "timeUnixNano": "1708346694408438334"
                    }
                  ]
                },
                "name": "k8s.node.filesystem.usage",
                "unit": "By"
              },
              {
                "description": "Node memory available",
                "gauge": {
                  "dataPoints": [
                    {
                      "asInt": "29207556096",
                      "startTimeUnixNano": "1708205467000000000",
                      "timeUnixNano": "1708346694408438334"
                    }
                  ]
                },
                "name": "k8s.node.memory.available",
                "unit": "By"
              },
              {
                "description": "Node memory major_page_faults",
                "gauge": {
                  "dataPoints": [
                    {
                      "asInt": "4771",
                      "startTimeUnixNano": "1708205467000000000",
                      "timeUnixNano": "1708346694408438334"
                    }
                  ]
                },
                "name": "k8s.node.memory.major_page_faults",
                "unit": "1"
              },
              {
                "description": "Node memory page_faults",
                "gauge": {
                  "dataPoints": [
                    {
                      "asInt": "1053555592",
                      "startTimeUnixNano": "1708205467000000000",
                      "timeUnixNano": "1708346694408438334"
                    }
                  ]
                },
                "name": "k8s.node.memory.page_faults",
                "unit": "1"
              },
              {
                "description": "Node memory rss",
                "gauge": {
                  "dataPoints": [
                    {
                      "asInt": "8400674816",
                      "startTimeUnixNano": "1708205467000000000",
                      "timeUnixNano": "1708346694408438334"
                    }
                  ]
                },
                "name": "k8s.node.memory.rss",
                "unit": "By"
              },
              {
                "description": "Node memory usage",
                "gauge": {
                  "dataPoints": [
                    {
                      "asInt": "31650934784",
                      "startTimeUnixNano": "1708205467000000000",
                      "timeUnixNano": "1708346694408438334"
                    }
                  ]
                },
                "name": "k8s.node.memory.usage",
                "unit": "By"
              },
              {
                "description": "Node memory working_set",
                "gauge": {
                  "dataPoints": [
                    {
                      "asInt": "9800798208",
                      "startTimeUnixNano": "1708205467000000000",
                      "timeUnixNano": "1708346694408438334"
                    }
                  ]
                },
                "name": "k8s.node.memory.working_set",
                "unit": "By"
              }
            ],
            "scope": {
              "name": "otelcol/kubeletstatsreceiver",
              "version": "0.94.0"
            }
          }
        ],
        "schemaUrl": ""
      }
    ]
  }