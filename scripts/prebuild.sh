#!/bin/bash


curl -X POST http://localhost:8090/getGitData -d '{"repourl":"https://github.com/sqlitebrowser/sqlitebrowser"}' -H "Content-Type: application/json"
curl -X POST http://localhost:8090/getGitData -d '{"repourl":"https://github.com/coolwanglu/vim.js"}' -H "Content-Type: application/json"
curl -X POST http://localhost:8090/getGitData -d '{"repourl":"https://github.com/mattgallagher/AudioStreamer"}' -H "Content-Type: application/json"
curl -X POST http://localhost:8090/getGitData -d '{"repourl":"https://github.com/LightTable/LightTable"}' -H "Content-Type: application/json"
curl -X POST http://localhost:8090/getGitData -d '{"repourl":"https://github.com/jch/html-pipeline"}' -H "Content-Type: application/json"
