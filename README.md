# bitbooks
E-commerce store with bitcoin payments


Steps
1. Download and setup bitcoin. Sync to latest. To run local, we need testnet.
2. Download and setup MongoDB
3. Create a Google Books API key
4. Configure shell scripts (included) properly based on your folder structure
5. Run rundaemon.sh. This will start bitcoin, with walletnotify and blocknotify
6. start mongo
7. start api server. cd to api and run 'nodemon'
8. start web project. cd to web and run 'npm run dev'

to test.
1. open web browser and navigate to localhost:8080
2. select a book
3. select 'pay with crypto' tab.
4. amount and payment address is shown. Send required amount of bitcoins using a testnet to the given address.
5. UI automatically updates once payment is received.
