/**
 * Created by Administrator on 12/16/2015.
 */
angular.module('shopAdvisor.controllers')
    .controller('FindYourShopCtrl', [ '$scope', '$state', '$stateParams',
        '$http', function ($scope, $state, $stateParams, $http) {
            $scope.init = function () {
                $('[data-toggle="tooltip"]').tooltip();

                $('#fullscreen').on('click', function(event) {
                    event.preventDefault();
                    window.parent.location = "http://bootsnipp.com/iframe/4l0k2";
                });
                $('a[href="#cant-do-all-the-work-for-you"]').on('click', function(event) {
                    event.preventDefault();
                    $('#cant-do-all-the-work-for-you').modal('show');
                })

                $('[data-command="toggle-search"]').on('click', function(event) {
                    event.preventDefault();
                    $(this).toggleClass('hide-search');

                    if ($(this).hasClass('hide-search')) {
                        $('.c-search').closest('.row').slideUp(100);
                    }else{
                        $('.c-search').closest('.row').slideDown(100);
                    }
                })

                $('#contact-list').searchable({
                    searchField: '#contact-list-search',
                    selector: 'li',
                    childSelector: '.col-xs-12',
                    show: function( elem ) {
                        elem.slideDown(100);
                    },
                    hide: function( elem ) {
                        elem.slideUp( 100 );
                    }
                })
            }

    } ]);


