angular.module('planner', [])
    .controller('PlannerCtrl', function(Plan, Hour) {

        var vm = {};

        vm.init = function () {
            vm.leftPositions = {};
            vm.hours = Hour.getHours();
            vm.plans = Plan.getPlans();
            vm.hours.map(function (hour) {
                vm.leftPositions[hour] = 0;
            });
            vm.calculateWidth();
        };

        vm.addPlan = function() {
            Plan.addPlan(this.newPlan).then(vm.init).catch(function(e) {
                alert(e);
            });
        };

        vm.removePlan = function(id) {
            Plan.removePlan(id).then(vm.init).catch(function(e) {
                alert(e);
            });
        };

        vm.hourText = function(hour) {
            if (+hour > 9) {
                return hour + ':00';
            } else if (+hour >= 0) {
                return '0' + hour + ':00';
            }
        };

        vm.getPlanStyle = function (plan) {
            var top = plan.start * 80;
            var height = (plan.finish - plan.start) * 80;
            return "top:" + (top + 5) + "px;" + 
                "height:" + (height - 10) + "px;" +
                "left:" + plan.left * vm.width + "%;" +
                "width:" + (vm.width - 2) + "%;";
        };

        vm.calculateWidth = function () {
            var columns;

            function iter(hour, col) {
                var unvisited = vm.plans.filter(function (plan) {
                    return !plan.visited;
                });

                if (unvisited.length === 0) {
                    return col;
                }
                else {
                    vm.plans.map(function (plan) {
                        if (plan.visited || plan.start < hour) {
                            return;
                        }
                        plan.left = col;
                        plan.visited = true;
                        hour = plan.finish;
                    });

                    return iter(0, col + 1);
                }
            }

            vm.plans.map(function (plan) {
                plan.visited = false;
            });

            vm.plans.sort(function (a, b) {
                if (a.start > b.start) {
                    return 1;
                }
                else if (a.start < b.start) {
                    return -1;
                }
                else {
                    return 0;
                }
            });

            columns = iter(0, 0);
            vm.width = 100 / columns;
        };

        vm.init();
        angular.extend(this, vm);
    })
    .service('Hour', function() {
        var hours = [];
        for (i = 0; i < 24; i++) {
            hours.push(i);
        }
        return {
            getHours: function () {
                return hours;
            }
        };
    })
    .service('Plan', function($q) {
        var plans = [{
            id: 0,
            start: 1,
            finish: 4,
            activity: "first"
        }];
        var i;

        return {
            getPlans: function() {
                return plans;
            },

            addPlan: function(newPlan) {
                var defer = $q.defer();
                var id = 0;
                if (+newPlan.finish <= +newPlan.start) {
                    defer.reject('Finish time is before start time');
                    return;
                }
                else {
                    plans.map(function (plan) {
                        id = Math.max(plan.id, id);
                    });
                    plans.push({
                        id: id + 1,
                        start: +newPlan.start,
                        finish: +newPlan.finish,
                        activity: newPlan.activity
                    });
                    defer.resolve();
                }
                return defer.promise;
            },

            removePlan: function(id) {
                var defer = $q.defer();
                plans.map(function(plan, i) {
                    if (plan.id === id) {
                        this.splice(i, 1);
                        defer.resolve();
                    }
                }, plans);
                defer.reject('invalid id');
                return defer.promise;
            }
        };
    });