"use strict";

(function (angular) {
	var app = angular.module('app');

    function controller($scope, $http) {
        this.deleteQuery = function(index) {
            if (!window.confirm('Do you really want to delete the query "' 
            + this.shared.db.inventory.queries[index].name + '"?')) return;
            
            this.shared.db.inventory.queries.splice(index, 1);
            this.shared.selectQuery(Math.min(this.shared.db.inventory.queries.length - 1, this.shared.db.selectedQueryIndex));
            this.shared.db.modified = true;
        };
        
        this.addQuery = function() {
            this.shared.db.inventory.queries.push(
                {
                    name: 'New Query', 
                    code: '{}', 
                    operation: 'find',
                    collection: this.shared.db.inventory.collections[0].name
                }
            );
            this.shared.selectQuery(Math.max(0, this.shared.db.selectedQueryIndex));
            this.shared.db.modified = true;
            this.shared.sortQueries();
        };

        this.save = function() {
            var scope = this;
            
            var queries = JSON.parse(JSON.stringify(this.shared.db.inventory.queries));
            
            for (var i in queries) {
                delete queries[i]["_id"];
                delete queries[i]["$$hashKey"];
            }
                       
            function couldNotSave() {
                alert("Could not write to the database.\n" +
                      "You may want to update the collection 'mongo-explorer.com' manually:\n" +
                      JSON.stringify(queries, null, 4)
                );
            }

            scope.shared.saveProgress = true;
			scope.error = 0;

            $http({url: "../api/saveQueries", method: "GET", params: { conn: scope.shared.db.connectionString, queries: JSON.stringify(queries) }})
            .then(
				function (response) {
                    scope.shared.saveProgress = false;

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
                    scope.shared.saveProgress = false;
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