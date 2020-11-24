module.exports = {
  apps : [{
    name      : "image_archive_api",
    script    : "./server.js",
    instances : 1,
    exec_mode : "cluster",
    watch     : false,
    kill_timeout : 3000,
    wait_ready: true,
    listen_timeout : 3000,
    env: {
      NODE_ENV: "development",
      NODE_PORT: 3000,
      DB_INDEX: 0,

      API_ROOT_URL: "http://localhost:3000/",
      // "WEB_ROOT_URL": "http://localhost/image-archive-web-client/index.html"
    },
    env_production : {
      NODE_ENV: "production",
      NODE_PORT: 3000,
      DB_INDEX: 1,

      // "API_ROOT_URL": "http://ec2-34-229-15-186.compute-1.amazonaws.com:8080/",
      // "WEB_ROOT_URL": "http://d38xrfdtjpihkf.cloudfront.net/index.html"
    },
    // "env_alpha" : {
    //   "NODE_ENV": "alpha",
    //   "NODE_PORT":3000,
    //   "DB_INDEX":2,

    //   "API_ROOT_URL": "http://s3lab.zapto.org:8080/",
    //   "WEB_ROOT_URL": "http://s3lab.zapto.org:8080/wii/index.html"
    // }
  }]
};
