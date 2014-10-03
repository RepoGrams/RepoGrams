import cherrypy

import git_graph
import githelpers as gh

class Repograms(object):
    @cherrypy.expose
    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    def getGitData(self):
        data = cherrypy.request.json
        repourl = data["repourl"]
        try:
            gh.get_repo(repourl)
        except gh.GitException as e:
            return {"emessage": e.message}
        g = git_graph.GitGraph()
        return g.export()

cherrypy.quickstart(Repograms())
