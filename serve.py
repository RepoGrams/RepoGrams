import glob
import json
import os
import cherrypy
from metrics import active_metrics
from app import git_graph, git_helpers


INSTANCE_CONFIG_DEFAULT = None
INSTANCE_CONFIG_FOR_LOCAL_DEBUGGING = {'/': {
    'tools.staticdir.on': True,
    'tools.staticdir.dir': os.path.abspath(os.path.dirname(__file__)),
    'tools.staticdir.index': 'index.html'
}}

# Choose one of the above for your instance config
INSTANCE_CONFIG = INSTANCE_CONFIG_FOR_LOCAL_DEBUGGING


class RepoGrams(object):
    def __init__(self):
        self.dir_manager = git_helpers.DirManager()
        self.credentials_manager = git_helpers.CredentialsManager('credentials')
        self.cache = git_graph.GitGraphCache()

    @cherrypy.expose(alias="getGitData")
    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    def get_git_data(self):
        data = cherrypy.request.json
        repo_url = data["repourl"]
        try:
            git_helper = git_helpers.GitHelper(repo_url, self.dir_manager, self.credentials_manager)
        except Exception as e:
            cherrypy.response.status = 300
            return {"emessage": e.message}

        if repo_url not in self.cache or not git_helper.up2date:
            g = git_graph.GitGraph(git_helper)
            self.cache[repo_url] = g.export()
        else:
            cherrypy.log("Cache hit")
        return self.cache[repo_url]

    @cherrypy.expose(alias="getMetrics")
    def get_metrics(self):
        cherrypy.response.headers['Content-Type'] = 'application/x-javascript'

        with open('metrics/base.js') as f:
            metrics = f.read()

        registered_metrics = []
        for metric in active_metrics:
            try:
                with open('metrics/%s.js' % metric.id) as f:
                    metrics += f.read()
                    registered_metrics.append(metric.id)
            except IOError:
                pass

        metrics += 'var MetricsOrder = %s' % json.dumps(registered_metrics)

        return metrics

    @cherrypy.expose(alias="getMappers")
    def get_metric_mappers(self):
        cherrypy.response.headers['Content-Type'] = 'application/x-javascript'

        with open('js/mappers/base.js') as f:
            mappers = f.read()

        for mapper_file_name in glob.glob('js/mappers/*.js'):
            if not mapper_file_name.endswith('/base.js') and not mapper_file_name.endswith('/_example.js'):
                with open(mapper_file_name) as f:
                    mappers += f.read()

        return mappers

cherrypy.config.update({'server.socket_port': 8090,
                        'server.socket_host': "0.0.0.0",
                        'engine.autoreload_on': False,
                        'log.access_file': './access.log',
                        'log.error_file': './error.log'})
cherrypy.quickstart(RepoGrams(), '/', config=INSTANCE_CONFIG)
