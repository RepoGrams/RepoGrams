<?php
require_once('header.php');
?>

<html ng-app="repogramsModule">
	<head>
		<!-- include Angular.js -->
		<script type="text/javascript" src="/js/angular.min.js"></script>
		<!-- include the app controllers -->
		<script type="text/javascript" src="/js/app.js"></script>
		<title>RepoGrams</title>
	</head>
	<body>
		<!-- First block for the selection box and zoom slider -->
		<div ng-controller="RepogramsConfig">
			<!-- Dropdown Menu for Metric Selection -->
			{{MetricTitle}}:
			<select  ng-model="metricId" 
			ng-options="metric.metricId as metric.name for metric in metrics">
			</select>
			<!-- TODO: Add slider maybe: https://prajwalkman.github.io/angular-slider/ -->
		</div>
	
		<!-- Main Block with the Repo name and Metric render -->
		<div ng-controller="RepogramsRender">
			<ul>
				<li ng-repeat="repo in repos ">{{repo.name}}</li><span ng-rendermetric></span>
			</ul>
			<span ng-legend></span>
		</div>

		<!-- last block for import box -->
		<div ng-controller="RepogramsImporter">
			<input type="text" ng-model="importURL"/>
			<button ng-click="importRepo()">{{ImportButtonText}}</button>
		</div>

</body>
</html>
