# Implementation:

### Q) What libraries did you add to the frontend? What are they used for?

I used create-react-app to setup the skeleton for the project, and subsequently removed any unused dependencies. Those remaining from the skeleton are:

1. react
2. react-dom
3. react-scripts

All of which are needed to support the React application.

Additionally, I used the third party 'react-select' component to enable the dropdown boxes which facilitate filter selection.

### Q) What's the command to start the frontend application locally?

`npm install`
followed by
`npm start`

### Q) What libraries did you add to the backend? What are they used for?

1. Fastify - Web Server framework; used to implement the server.

2. Axios - used to make the web requests to the RESTful order book endpoints.

3. Big.js - Used to represent the large numbers; Vanilla JS struggles with precision here.

4. dotenv - Used to pull in the environment variables from the .env file.

5. Typescript - Enable TS

6. WS - Used for facilitating the websocket communication with the orderbooks.

7. rimraf - Used in the build script; removes the previously build output.

(Further dev dependencies):

8. nodemon - Allows the server to automatically restart when the files are changed; beneficial for efficient development.

9. ts-node - Allows the execution of typescript files without needing to compile to JS manually every time a change is made.

### Q) What's the command to start the backend application locally?

(Wherever `yarn` is used to run a script (build / start), `npm run` can be used in its place)

For development purposes (using nodemon to capture changes and restart automatically) - `yarn dev`

Otherwise, `yarn start`.

Because this is a typescript codebase, an initial `yarn build` must be completed prior to running `yarn start`.

### Q) Any other comments we should read before evaluating your solution?

I elected to maintain an internal state of the OrderBook such that this model for the service would scale to higher volumes of requests more easily - No worries about rate-limiting.

To prevent the normalization and filtering process from taking too long, there is a limit to the number of ASK orders that service caches from snapshots. This can be adjusted via the environment variable SNAPSHOT_SIZE.

In the case that there is an incoming routing request for which the amount is larger than the total cached amount for an OrderBook, a request is made for the entire OrderBook via a RESTful API. I believe it is an edge case that a user would be looking to purchase 30+ BTC (this is generally the amount at which the cached amount hovers)

A quick overview of the different cached orderbooks can be viewed via the /status endpoint - In a production environment this would only be exposed internally.

---

# General:

### Q) If you had more time, what further improvements or new features would you add?

Given additional time, I would consider dynamically adjusting the sizes of the snapshots to try and make sure there is a healthy amount available in each cached OrderBook.

I would also like to explore and experiment with more efficient data structures for the orders; this could enable us to maintain the entire set of asks. I think a binary search tree - potentially a self balancing one would be a good fit for this problem; if this was implemented then it is possible that we could process a larger volume of incoming WS messages into the data structure.

### Q) Which parts are you most proud of? And why?

I am definitely most proud of the backend; in particular the way in which the OrderBook class enables the service to be very modular - the addition of different exchanges should not require a massive overhaul.
I also believe that the model I have implemented is scalable and suitably configurable in other regards; the service should be able to efficiently respond to higher volumes of requests.

### Q) Which parts did you spend the most time with? What did you find most difficult?

Initially, I was caching the entire state of each OrderBook - this was hugely inefficient, resulting in the iteration over the entire array of length ~5000 elements every time a new websocket message came in - for Coinbase this is every 50ms... Of course, this would have a blocking effect on the application, and requests to the API would take upwards of 20 seconds. I tried reducing this computation by only updating the OrderBook once every second, but this would mean the server would provide stale data, and make the use of WebSockets pointless. I could have simply hit the RESTful API every second if this is what was desired. Ultimately, the solution of maintaining a "pruned" state of the OrderBook, whilst keeping track of the maximum supported amount available seems logical to me as the service can cater to the bulk of requests from the cache, and quickly decide when it needs to handle edge cases.

### Q) How did you find the test overall? Did you have any issues or have difficulties completing? If you have any suggestions on how we can improve the test, we'd love to hear them.

It was a really enjoyable test - my first time working with OrderBooks so I had fun, the only difficulties were logistical due to my personal circumstances as the bulk of the work was completed on public transport / flights in Portugal / Spain whilst traveling!
