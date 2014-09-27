<?php
require_once('header.php');
?>

<html ng-app="repogramsModule">
        <head>
                <!-- include Angular.js -->
                <script type="text/javascript" src="/js/angular.min.js"></script>
                <!-- Sanitize Module for HTML injections -->
                <script type="text/javascript" src="/js/sanitize.js"></script>
                <!-- include metrics code -->
                <script type="text/javascript" src="/js/bower_components/clj-fuzzy/src-js/clj-fuzzy.js"></script>
                <script type="text/javascript" src="/js/metrics/branchComp.js"></script>
                <script type="text/javascript" src="/js/metrics/branchUse.js"></script>
                <script type="text/javascript" src="/js/metrics/commitLangCompl.js"></script>
                <script type="text/javascript" src="/js/metrics/commitModul.js"></script>
                <script type="text/javascript" src="/js/metrics/commitMsgLength.js"></script>
                <script type="text/javascript" src="/js/metrics/mostEditFile.js"></script>
                <script type="text/javascript" src="/js/metrics/driver.js"></script>
                <!-- include the app controllers -->
                <script type="text/javascript" src="/js/app.js"></script>


                <title>RepoGrams</title>
        </head>
	<body>
	<div class="container">
		<div class="jumbotron">
			<h1 style="text-align: center;">Repograms</h1> <!-- how about a fancy font? Or a logo? -->
		</div>
                <!-- First block for the selection box and zoom slider -->
                <div class="row">
                <div class="configBlock" ng-controller="RepogramsConfig">
                        <!-- Dropdown Menu for Metric Selection -->
			<small>Metrics</small>
			<div class="dropdown">
			  <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown">
			    {{currentMetric.label}}
			    <span class="caret"></span>
			  </button>
			  <ul class="dropdown-menu" role="menu">
			    <li ng-repeat="metric in metrics" ng-model="selectActio()" ng-change="selectAction()">
				{{metric.label}}
			    </li>
<!--                          <select class="dropdown-menu"  ng-model="currentMetric" ng-change="selectAction()"
                          ng-options="metric.label for metric in metrics">
			  </select> -->
			  </ul>
			</div>
                        <!-- TODO: Add slider maybe: https://prajwalkman.github.io/angular-slider/ -->
                        
                        Block length modus:
                        <select  ng-model="currentBlen" ng-change="selectBlenAction()"
                        ng-options="blen.label for blen in blenMods">
                        </select>
                </div>
                </div>

		<!-- Main Block with the Repo name and Metric render -->
                <div ng-controller="RepogramsRender" class="container-fluid" style="width:100%;>
                        <div class="row">
                          <div class="col-md-10" style="outline: 1px solid red; width:80%;">
                            <div class="repo" ng-repeat="repo in repos">
                              <div class="row">
                                <div class="col-md-2"><label for="{{'metricBox'+$index}}">{{repo.name}}<label><button ng-click="removeRepo($index)"><span class="glyphicon glyphicon-remove"></span></button> </div>
                                <div class="col-md-10" id="{{'metricBox'+$index}}"><ng-rendermetric></ng-rendermetric></div>
                              </div>
                            </div>
                          </div>
                          <div class="col-md-2" style="outline: 1px solid black; width:20%;">
                            <ng-legend></ng-legend>
                          </div>
                        </div>
                </div>
                <br><br>
                <div class="container" style="width:100%;>
                  <!-- last block for import box -->
                  <div ng-controller="RepogramsImporter" class="row">
                    <div class="col-md-6">
                    <div class="input-group">
                        <input type="text" class="form-control" ng-model="importURL"/>
			<span class="input-group-btn">
				<button type="button" class="btn btn-danger" ng-click="importURL = null">
        	                <span class="glyphicon glyphicon-remove"></span>
				</button>
			  <button type="button" class="btn btn-primary" ng-click="importRepo()">{{ImportButtonText}}</button>
			</span>
		    </div>
                    </div>
                  </div>
                </div>
        </div>

</body>
</html>
