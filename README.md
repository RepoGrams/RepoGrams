#### Overview ####

Repograms is a web-tool that allows users to analyze and compare the history of multiple software projects. It computes and visualizes a variety of software metrics over time, such as the number of programming languages used in a project over time or how often developers change code across different modules (directories).

Supported metrics:
 * Commit modularity
 * Commit message length
 * Commit language complexity
 * Branch usage
 * Most edited file
 * Branch complexity

#### Installation ####

The Repograms server installation has been tested on Ubuntu. To set up Repograms you'll need to install [docker](https://www.docker.com/).

Then you can run repograms by starting build.sh.

` ./build.sh `

It accepts one parameter, which must be the hostname.


#### License  ####

Repograms is released under the [GPL](https://www.gnu.org/copyleft/gpl.html).

The contents of the lib folder are licensed under the [LGPL](http://www.gnu.org/licenses/lgpl.html).

