<?php
//require_once('header.php');
?>

<html ng-app>
	<head>
		<!-- include Angular.js -->
		<script type="text/javascript" src="/js/angular.min.js"></script>
		<!-- include the app controllers -->
		<script type="text/javascript" src="/js/app.js"></script>
		<title>RepoGrams</title>
	</head>
	<body>
		<div ng-controller="RepogramsConfig">
			<!-- Dropdown Menu for Metric Selection -->
			{{MetricTitle}}:
			<select  ng-model="metricId" 
			ng-options="metric.metricId as metric.name for metric in metrics">
			</select>
			<!-- TODO: Add slider maybe: https://prajwalkman.github.io/angular-slider/ -->
		</div>
	
		<!-- TODO: New div needed for next block?? -->
		<div ng-controller="RepogramsRender">
			<ul>
				<li ng-repeat="repo in repos ">{{repo.name}} {{repo.metric}}</li>
			</ul>
			<!-- TODO: Add every single repo -->
			<!-- TODO: Add the legend aligned right -->
		</div>
		<!-- TODO: New div needed for next block?? -->
		<div ng-controller="RepogramsImporter">
			<input type="text" ng-model="importURL"/>
			<button ng-click="importRepo()">{{ImportButtonText}}</button>
		</div>

</body>
</html>
