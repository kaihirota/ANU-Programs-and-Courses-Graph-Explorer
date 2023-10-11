![Website](https://img.shields.io/website?down_color=lightgrey&down_message=Offline&up_color=green&up_message=Online&url=https%3A%2F%2Fanu-graph-vis.vercel.app)
![Uptime Robot ratio (30 days)](https://img.shields.io/uptimerobot/ratio/m790361423-54fff8072af1658729630e16)

# ANU Programs & Courses Graph Explorer

This is a React based web app with 2 features:

1. Plan / Visualize a degree
![](img/1.jpg)

2. Explore courses at ANU 
![](img/2.jpg)

Most of the data visualisation code is taken from https://github.com/jacomyal/sigma.js/tree/main/demo

## Quickstart

Install dependencies:

```
npm install
```

Start the development server:

```
npm start
```

This will serve the app on `http://localhost:3000`

---

To build with Docker,

```
docker build -t anu_graph_webapp .
docker container run --publish 3000:3000 --env-file .env anu_graph_webapp
```
