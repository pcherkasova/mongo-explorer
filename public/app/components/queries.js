"use strict";

(function (angular) {
	var app = angular.module('app');

    function controller($scope, $http) {

        this.deleteQuery = function(index) {
            if (!window.confirm('Do you really want to delete the query "' 
            + this.shared.db.inventory.queries[index].name + '"?')) return;
            
            this.shared.db.inventory.queries.splice(index, 1);
            this.shared.selectedQuery = Math.min(this.shared.db.inventory.queries.length - 1, this.shared.selectedQuery);
            this.shared.db.modified = true;
        };

        this.addQuery = function() {
            this.shared.db.inventory.queries.push({name: 'New Query', code: ''});
            this.shared.selectedQuery = Math.max(0, this.shared.selectedQuery);
            this.shared.db.modified = true;
        };

        this.save = function() {
            var scope = this;
            
            var queries = new Array(this.shared.db.inventory.queries.length);
            
            for (var i = 0; i < queries.length; i++) {
                queries[i] = {
                    name: this.shared.db.inventory.queries[i].name,
                    code: this.shared.db.inventory.queries[i].code,
                    dashboards: this.shared.db.inventory.queries[i].dashboards
                }
            }
                       
            function couldNotSave() {
                console.log(JSON.stringify(queries, null, 4));
                alert("Not enough permissions to save queries to the database.\n" +
                      "You may want to update the collection 'mongo-explorer.com' manually:\n" +
                      JSON.stringify(queries, null, 4)
                );
            }

            scope.saveProgress = true;
			scope.error = 0;

            $http({url: "../api/saveQueries", method: "GET", params: { conn: scope.shared.db.connectionString, queries: JSON.stringify(queries) }})
            .then(
				function (response) {
                    scope.saveProgress = false;

					if (response.data.res) {
                        if (response.data.res ) scope.shared.db.modified = false
                        else couldNotSave();
					} else if (response.data.err) { 
						couldNotSave();
                    } else {
                        couldNotSave();
                    };
				}, 
				function (err) {
                    scope.saveProgress = false;
                    couldNotSave();
				}
			);
        }

    }

    app.component('myQueries', {
        templateUrl: 'app/components/queries.html',
        controller: controller,
        bindings: {
            shared: '='
        }
    });

})(window.angular);