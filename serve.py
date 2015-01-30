import os
import cherrypy

import scripts.git_graph as git_graph
import scripts.githelpers as gh

INSTANCE_CONFIG_DEFAULT = None
INSTANCE_CONFIG_FOR_LOCAL_DEBUGGING = {'/': {
    'tools.staticdir.on': True,
    'tools.staticdir.dir': os.path.abspath(os.path.dirname(__file__)),
    'tools.staticdir.index': 'index.html'
}}

# Choose one of the above for your instance config
INSTANCE_CONFIG = INSTANCE_CONFIG_DEFAULT



class Repograms(object):

    def __init__(self):
        self.dirmanager = gh.DirManager()
        self.cache = git_graph.GitGraphCache()

    @cherrypy.expose
    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    def getGitData(self):
        data = cherrypy.request.json
        repourl = data["repourl"]
        try:
            git_helper = gh.GitHelper(repourl, self.dirmanager)
        except gh.GitException as e:
            cherrypy.response.status = 300
            return {"emessage": e.message}
        if git_helper.up2date and repourl in self.cache:
            cherrypy.log("Cache hit")
            return self.cache[repourl]
        g = git_graph.GitGraph(git_helper, self.cache, precompute = True)
        return g.export()


cherrypy.config.update({'server.socket_port': 8090,
                        'server.socket_host': "0.0.0.0",
                        'engine.autoreload_on': False,
                        'log.access_file': './access.log',
                        'log.error_file': './error.log'})
cherrypy.quickstart(Repograms(), '/', config=INSTANCE_CONFIG)
