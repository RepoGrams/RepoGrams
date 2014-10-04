import os
import cherrypy

import scripts.git_graph as git_graph
import scripts.githelpers as gh

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
        g = git_graph.GitGraph(git_helper, self.cache)
        return g.export()

if __name__ == '__main__':
    staticdir = os.path.abspath(os.getcwd())
    conf = {
        '/': {
            'tools.staticdir.on': True,
            'tools.staticdir.dir': staticdir,
            'tools.staticdir.index': 'index.html',
        }
    }
    cherrypy.tree.mount(Repograms(), '/', config=conf)
    cherrypy.engine.start()
    cherrypy.engine.block()
