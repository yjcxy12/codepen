angular.module('planner', [])
    .controller('PlannerCtrl', function(Plan, Hour) {

        this.hours = Hour.getHours();
        this.plans = Plan.getPlans();

        this.addPlan = function() {
            Plan.addPlan(this.newPlan).then(Plan.getPlans).catch(function(e) {
                alert(e);
            });
        };

        this.removePlan = function(id) {
            Plan.removePlan(id).then(Plan.getPlans).catch(function(e) {
                alert(e);
            });
        };

        this.hourText = function(hour) {
            if (+hour > 9) {
                return hour + ':00';
            } else if (+hour >= 0) {
                return '0' + hour + ':00';
            }
        };

        this.getPlanStyle = function (plan) {
            var top = plan.start * 80;
            var height = (plan.finish - plan.start) * 80;
            return "top:" + top + "px;" + 
                "height:" + height + "px;";
        };
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
            start: 0,
            finish: 1,
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
                plans.map(function(plan) {
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