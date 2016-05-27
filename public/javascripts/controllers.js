var app = angular.module('app', []);

app.filter('trust', ['$sce', function ($sce) {
    return function (text) {
        return $sce.trustAsHtml(text);
    };
}]);

app.controller('blog', function ($scope, $http) {

    $scope.com = {};
    $scope.use = {};

    $scope.amount = 3;

    $scope.limit = {};

    $scope.FixDate = function (date_in) {
        var date = new Date(date_in),
            temp = "";

        var month = {
            0: 'January',
            1: 'February',
            2: 'March',
            3: 'April',
            4: 'May',
            5: 'June',
            6: 'July',
            7: 'August',
            8: 'September',
            9: 'October',
            10: 'November',
            11: 'December'
        };

        temp += month[date.getMonth()];
        temp += " ";
        temp += date.getDate();
        temp += ", ";
        temp += date.getFullYear();
        return temp;
    }

    $scope.Uneditable = function (text) {
        return text.replace(/contenteditable="true"/g, '');
    }

    $scope.More = function ($index) {
        $scope.limit[$index] += $scope.amount;
    }

    $scope.SaveComment = function ($index) {

        var data = {
            user: $scope.use[$index],
            text: $scope.com[$index]
        }

        $http.post('/blog/' + $scope.data[$index].type + '/addcomment/' + $scope.data[$index]._id, data).then(function (response) {
            $scope.com[$index] = '';
            $scope.Collapse();
            $scope.data[$index].comments.push(data);
        }, function (err) {
            alert('Please fill out both comment and name.')
        });
    }

    $scope.CancelComment = function ($index) {
        $scope.com[$index] = '';
        $scope.Collapse();
    }

    $scope.Collapse = function () {
        var textarea = $('textarea[view="expanded"]');

        textarea.next('.comment-btn').slideUp('fast', function () {
            textarea.animate({
                height: '22px'
            }, 'fast', function () {
                $(this).animate({
                    width: '140px'
                }, 'fast');
            })
        });
    }



    //Yeah I know I put jQuery in Angular, sorry!
    $(function () {
        $('.comment-input').click(function () {
            $(this).animate({
                width: '350px'
            }, 'fast', function () {
                $(this).animate({
                    height: '66px'
                }, '', function () {
                    $(this).next('.comment-btn').slideDown();
                }).attr('view', 'expanded');
            });
        });
    });

});

app.controller('header', function ($scope, $http, $rootScope) {

    $rootScope.data = {};

    $http.post('/view').success(function (data) {
        $rootScope.data = data;
        console.log(data);
        $scope.blogs = data.types;
    });
});


app.controller('login', function ($scope, $http) {
    $scope.pass = "";
    $scope.hide = true;

    $scope.Authenticate = function () {
        $http.post('/login/try', {
            pass: $scope.pass
        }).success(function (data) {
            window.location.href = '/blog/create';
        });
    }
});




app.controller('create', function ($scope, $http, $rootScope) {



    $rootScope.$watch('data', function () {
        $scope.data = $rootScope.data;
    });


    $scope.post = {};
    $scope.hide = {
        title: false,
        select: false,
        custom: true
    }

    $scope.HideTitle = function () {
        $scope.hide.title = true;
    }

    $scope.HideSelect = function () {
        if ($scope.post.type == 'custom') {
            $scope.hide.select = true;
            $scope.hide.custom = false;
            $scope.post.type = '';
        }
    }

    $scope.Post = function () {
        var obj = {
            title: $scope.post.title,
            body: $scope.quill.getHTML()
        };
        console.log(obj);
        console.log($scope);

        $http.post('/blog/' + $scope.post.type + '/new', obj).then(function (data) {
            window.location.href = $scope.post.type;
        });;
    }


    angular.element(document).ready(function () {
        $scope.quill = new Quill('#editor', {
            modules: {
                'toolbar': {
                    container: '#toolbar'
                }
            },
            theme: 'snow'
        });
    });


});