#!/bin/zsh
~/Workspace/ledu/bitcoin/src/bitcoind -testnet -walletnotify="~/Workspace/ledu/walletnotify.sh %s" -blocknotify="~/Workspace/ledu/blocknotify.sh %s"