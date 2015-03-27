import os
import cherrypy
from scripts import git_graph, git_helpers



INSTANCE_CONFIG_DEFAULT = None
INSTANCE_CONFIG_FOR_LOCAL_DEBUGGING = {'/': {
    'tools.staticdir.on': True,
    'tools.staticdir.dir': os.path.abspath(os.path.dirname(__file__)),
    'tools.staticdir.index': 'index.html'
}}

# Choose one of the above for your instance config
INSTANCE_CONFIG = INSTANCE_CONFIG_FOR_LOCAL_DEBUGGING


class Repograms(object):
    def __init__(self):
        self.dir_manager = git_helpers.DirManager()
        self.cache = git_graph.GitGraphCache()

    @cherrypy.expose
    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    def getGitData(self):
        data = cherrypy.request.json
        repo_url = data["repourl"]
        try:
            git_helper = git_helpers.GitHelper(repo_url, self.dir_manager)
        except git_helpers.GitException as e:
            cherrypy.response.status = 300
            return {"emessage": e.message}
        if not git_helper.up2date or repo_url not in self.cache:
            g = git_graph.GitGraph(git_helper)
            self.cache[repo_url] = g.export()
        else:
            cherrypy.log("Cache hit")
        return self.cache[repo_url]


cherrypy.config.update({'server.socket_port': 8090,
                        'server.socket_host': "0.0.0.0",
                        'engine.autoreload_on': False,
                        'log.access_file': './access.log',
                        'log.error_file': './error.log'})
cherrypy.quickstart(Repograms(), '/', config=INSTANCE_CONFIG)
