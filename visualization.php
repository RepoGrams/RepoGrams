<?php
require_once('header.php');
?>

<html ng-app="repogramsModule">
        <head>
                <!-- include Angular.js -->
                <script type="text/javascript" src="/js/angular.min.js"></script>
                <!-- Sanitize Module for HTML injections -->
                <script type="text/javascript" src="/js/sanitize.js"></script>
                <!-- include the app controllers -->
                <script type="text/javascript" src="/js/app.js"></script>

                <title>RepoGrams</title>
        </head>
        <body>
        <h1>Repograms</h1> <!-- how about a fancy font? Or a logo? -->
        <div class="container">
                <!-- First block for the selection box and zoom slider -->
                <div class="row">
                <div ng-controller="RepogramsConfig">
                        <!-- Dropdown Menu for Metric Selection -->
                        <select  ng-model="metricId" 
                        ng-options="metric.metricId as metric.name for metric in metrics">
                        </select>
                        <!-- TODO: Add slider maybe: https://prajwalkman.github.io/angular-slider/ -->
                </div>
                </div>

                <!-- Main Block with the Repo name and Metric render -->
                <div ng-controller="RepogramsRender" class="container-fluid">
                        <div class="row">
                          <div class="col-md-8" style="outline: 1px solid red;">
                            <div class="repo" ng-repeat="repo in repos">
                              <div class="row">
                                <h3 class="col-md-3">{{repo.name}}</h3>
                                <div class="col-md-9"><ng-rendermetric></ng-rendermetric></div>
                              </div>
                            </div>
                          </div>
                          <div class="col-md-4" style="outline: 1px solid black;">
                            <ng-legend></ng-legend>
                          </div>
                        </div>
                </div>
                <br><br>
                <div class="container-fluid">
                  <!-- last block for import box -->
                  <div ng-controller="RepogramsImporter" class="row">
                    <!-- TODO: the layout is quite bad currently -->
                    <div class="col-md-6">
                          <input type="text" class="form-control" ng-model="importURL"/>
                    </div>
                    <div class="col-md-6">
                          <a class="clear" ng-click="importURL = null">
                              <span class="glyphicon glyphicon-remove"></span>
                          </a>
                          <button ng-click="importRepo()">{{ImportButtonText}}</button>
                    </div>
                  </div>
                </div>
        </div>

</body>
</html>
