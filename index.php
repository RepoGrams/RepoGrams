<html ng-app="repogramsModule">
        <head>
                <!-- include Angular.js -->
                <script type="text/javascript" src="/js/angular.min.js"></script>
                <!-- Sanitize Module for HTML injections -->
                <script type="text/javascript" src="/js/sanitize.js"></script>
                <!-- use bootstrap -->
                <link rel="stylesheet" type="text/css" href="css/bootstrap.min.css">
                <link rel="stylesheet" type="text/css" href="css/bootstrap-theme.min.css">
                <!-- include our own style sheets -->
                <link rel="stylesheet" type="text/css" href="css/metrics.css">
                <!-- include metrics code -->
                <script type="text/javascript" src="/js/bower_components/clj-fuzzy/src-js/clj-fuzzy.js"></script>
                <script type="text/javascript" src="/js/metrics/branchComp.js"></script>
                <script type="text/javascript" src="/js/metrics/branchUse.js"></script>
                <script type="text/javascript" src="/js/metrics/commitLangCompl.js"></script>
                <script type="text/javascript" src="/js/metrics/commitModul.js"></script>
                <script type="text/javascript" src="/js/metrics/commitMsgLength.js"></script>
                <script type="text/javascript" src="/js/metrics/mostEditFile.js"></script>
                <script type="text/javascript" src="/js/metrics/filenames.json"></script>
                <script type="text/javascript" src="/js/metrics/driver.js"></script>
                <!-- include the app controllers -->
                <script type="text/javascript" src="/js/app.js"></script>


                <title>RepoGrams</title>
        </head>
	<body>
	<div class="container">
		<div class="jumbotron">
		 <img class="title" src="img/title.png" title="Repograms"></img> 
		</div>
                <!-- First block for the selection box and zoom slider -->
                <div class="row">
                  <div class="form-group col-lg-3" class="configBlock" ng-controller="RepogramsConfig">
                          <!-- Dropdown Menu for Metric Selection -->
                            <label for="metricSelect">Metric:</label>
                            <select id="metricSelect" class="form-control" ng-model="currentMetric" ng-change="selectAction()"
                            ng-options="metric.label for metric in metrics">
                            </select> 
                          <!-- TODO: Add slider maybe: https://prajwalkman.github.io/angular-slider/ -->
                  </div>

                  <div class="form-group col-lg-3 class="configBlock" ng-controller="RepogramsConfig">
                        <label for="blockLengthSelect">Block length modus:</label>
                        <select id="blockLengthSelect" class="form-control" ng-model="currentBlen" ng-change="selectBlenAction()"
                        ng-options="blen.label for blen in blenMods">
                        </select>
                  </div>
                </div>

		<!-- Main Block with the Repo name and Metric render -->
                <div ng-controller="RepogramsRender" class="container-fluid">
                        <div class="row">
                          <div class="col-md-10">
                            <div class="repo" ng-repeat="repo in repos">
                              <div class="row">
				<div class="col-md-3">
				  <label for="{{'metricBox'+$index}}">
				    <button type="button" class="btn btn-sm" ng-click="removeRepo($index)"><span class="glyphicon glyphicon-remove"></span></button>
				    {{repo.name}}
				  <label> 
				</div>
                                <div class="col-md-9" id="{{'metricBox'+$index}}"><ng-rendermetric></ng-rendermetric></div>
                              </div>
                            </div>
                          </div>
                          <div class="col-md-2">
                            <ng-legend></ng-legend>
                          </div>
                        </div>
                </div>
                <br><br>
                <div class="container">
                  <!-- last block for import box -->
		  <div ng-controller="RepogramsImporter" class="row">
		    <div class="col-md-6">
                      <div class="input-group">
			<input type="text" class="form-control" ng-model="importURL"/>
			<div class="input-group-btn" >
			  <button type="button" class="btn btn-primary formbtn" ng-click="importURL = null">
			    <span class="glyphicon glyphicon-remove-circle"></span>
			  </button>
			  <button type="button" class="btn btn-primary formbtn" ng-click="importRepo()">
			    <span class="glyphicon glyphicon-ok-circle"></span>
			  </button>
			</div>
		      </div>
		  </div>
		  </div>
                </div>
        </div>

</script>
</body>
</html>
