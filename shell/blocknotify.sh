#!/bin/bash
data="{\"blockhash\":\"$1\"}"
curl -H "Accept: application/json" -H "Content-Type: application/json" -d $data -X POST http://localhost:3000/api/blockchain/blocknotify