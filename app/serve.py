import glob
import json
import os

import cherrypy

from metrics import active_metrics
from app import git_graph, git_helpers


APP_BASE_DIR = os.path.abspath(os.path.dirname(__file__))
REPOGRAMS_BASE_DIR = os.path.abspath(APP_BASE_DIR + '/..')

PRODUCTION_SERVER_CONFIG = {
    'server.socket_port': 8090,
    'server.socket_host': "0.0.0.0",
    'engine.autoreload.on': False
}
PRODUCTION_INSTANCE_CONFIG = {
    '/': {
        'log.access_file': '/var/log/app/access.log',
        'log.error_file': '/var/log/app/error.log'
    }
}

DEVELOPMENT_SERVER_CONFIG = {
    'server.socket_port': 8090,
    'server.socket_host': "0.0.0.0",
    'engine.autoreload.on': True
}
DEVELOPMENT_INSTANCE_CONFIG_STATIC = {
    '/': {
        'tools.staticdir.on': True,
        'tools.staticdir.dir': REPOGRAMS_BASE_DIR + '/public',
        'tools.staticdir.index': 'index.html',
        'log.access_file': REPOGRAMS_BASE_DIR + '/logs/static-access.log',
        'log.error_file': REPOGRAMS_BASE_DIR + '/logs/static-error.log'
    }
}
DEVELOPMENT_INSTANCE_CONFIG_APP = {
    '/': {
        'log.access_file': REPOGRAMS_BASE_DIR + '/logs/app-access.log',
        'log.error_file': REPOGRAMS_BASE_DIR + '/logs/app-error.log'
    }
}


class RepoGrams:
    def __init__(self):
        self.dir_manager = git_helpers.DirManager()
        self.cache = git_graph.GitGraphCache()

    @cherrypy.expose(alias="getGitData")
    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    def get_git_data(self):
        data = cherrypy.request.json
        repo_url = data["repourl"]
        try:
            git_helper = git_helpers.GitHelper(repo_url, self.dir_manager)
        except Exception as e:
            cherrypy.response.status = 400
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

        with open(APP_BASE_DIR + '/metrics/base.js') as f:
            metrics = f.read()

        registered_metrics = []
        for metric in active_metrics:
            try:
                with open(APP_BASE_DIR + '/metrics/%s.js' % metric.id) as f:
                    metrics += f.read()
                    registered_metrics.append(metric.id)
            except IOError:
                pass

        metrics += 'var MetricsOrder = %s' % json.dumps(registered_metrics)

        return metrics.encode()

    @cherrypy.expose(alias="getMappers")
    def get_metric_mappers(self):
        cherrypy.response.headers['Content-Type'] = 'application/x-javascript'

        with open(APP_BASE_DIR + '/mappers/base.js') as f:
            mappers = f.read()

        for mapper_file_name in glob.glob(APP_BASE_DIR + '/mappers/*.js'):
            if not mapper_file_name.endswith('/base.js') and not mapper_file_name.endswith('/_example.js'):
                with open(mapper_file_name) as f:
                    mappers += f.read()

        return mappers.encode()


if __name__ == '__main__':
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument('environment', type=str, help="Must be either 'production' or 'development'")
    args = parser.parse_args()

    if args.environment == 'production':
        cherrypy.config.update(PRODUCTION_SERVER_CONFIG)
        cherrypy.quickstart(RepoGrams(), config=PRODUCTION_INSTANCE_CONFIG)
    elif args.environment == 'development':
        cherrypy.config.update(DEVELOPMENT_SERVER_CONFIG)
        cherrypy.tree.mount(RepoGrams(), '/app', DEVELOPMENT_INSTANCE_CONFIG_APP)
        cherrypy.quickstart(config=DEVELOPMENT_INSTANCE_CONFIG_STATIC)
    else:
        parser.error("Unknown environment: %s" % args.environment)
