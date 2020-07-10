; function MSG(O) {
	var $elm = $('.alert-rolpo').first();
	if (O != undefined) {
		if ($('#' + O.elm).length == 1) {
			$elm = $('#' + O.elm);
		}
	} else { O = {}; }

	//Types of MSG functions

	//MSG({ 'MsgType': 'OK', 'MsgText': 'Hell everything is right!'});
	//MSG({ 'MsgType': 'ERROR', 'MsgText': 'An error has occured while updating staff!'});
	//MSG({ 'MsgType': 'ERROR', 'MsgText': 'An error has occured while updating staff!', 'MsgAsModel': error.data });
	//MSG({'elm':'div-id', 'MsgType': 'ERROR', 'MsgText': 'An error has occured while updating staff!', 'MsgAsModel': error.data });

	$('.alert').removeClass('alert-success alert-error').hide();
	if (O.MsgType != '' && O.MsgType != undefined) {

		var css = (O.MsgType == 'ERROR') ? 'alert-error' : 'alert-success';
		O.MsgType = (O.MsgType == 'ERROR') ? 'Error' : 'Success';

		var html = '<button type=\'button\' class=\'close\' aria-hidden=\'true\'>x</button>';
		html += '<h4>' + O.MsgType + '!</h4>';

		var listItm = '';

		if (O.MsgAsModel != null && O.MsgAsModel != undefined) {

			html += '<b>' + O.MsgAsModel.Message + '</b><br/>';
			for (var key in O.MsgAsModel.ModelState) {
				for (var i = 0; i < O.MsgAsModel.ModelState[key].length; i++) {
					listItm += '<li class=\'error\'>' + O.MsgAsModel.ModelState[key][i] + '</li>';
					//errors.push(response.ModelState[key][i]);
				}
			}
			listItm = '<ul>' + listItm + '</ul>';
		} else { listItm = '<ul><li class=\'error\'>' + O.MsgText + '</li></ul>'; }
		html += listItm;
		$elm.empty().append(html).addClass(css).show();
		$elm.find('button').click(function () {
			$elm.hide();
			return false;
		});
		//if ($("element").data('bs.modal') && $("element").data('bs.modal').isShown) {
		//	alert(1);
		//}
		if ($elm.offset() == undefined) return;
		$('html, body').animate({ scrollTop: $elm.offset().top }, 'slow');


	}
}

/* Get the documentElement (<html>) to display the page in fullscreen */
function toggleFullScreen() {
    if ((document.fullScreenElement && document.fullScreenElement !== null) ||
        (!document.mozFullScreen && !document.webkitIsFullScreen)) {
        if (document.documentElement.requestFullScreen) {
            document.documentElement.requestFullScreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullScreen) {
            document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else {
        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
    }
}

// Javascript to enable link to tab
var url = document.location.toString();
if (url.match('#')) {
    $('.nav-tabs a[href="#' + url.split('#')[1] + '"]').tab('show');
}

// Change hash for page-reload
//$('.nav-tabs a').on('shown.bs.tab', function (e) {
//    window.location.hash = e.target.hash;
//})

function GETJ(str, isobj) {
	var json = isobj ? {} : [];
	try {
		json = angular.fromJson(str);
	} catch (e) {
		console.log("Errorin JSON: " + str);
		return isobj ? {} : [];
	}
	return json;
}

//Logout User
function Logout() {
	document.getElementById('logoutForm').submit();
};

var rolpo_app = angular.module('RolpoApp', ['ngSanitize', 'ui.bootstrap', 'ui.bootstrap.modal']);

rolpo_app.service('modalService', ['$uibModal',

	function ($uibModal) {
		var modalDefaults = {
			backdrop: true,
			keyboard: true,
			modalFade: true,
			size: 'sm',
			templateUrl: 'customModalPopup'
		};

		var modalOptions = {
			closeButtonText: 'Close',
			actionButtonText: 'OK',
			headerText: 'Proceed?',
			bodyText: 'Perform this action?'
		};

		this.showModal = function (customModalDefaults, customModalOptions) {
			if (!customModalDefaults) customModalDefaults = {};
			customModalDefaults.backdrop = 'static';
			return this.show(customModalDefaults, customModalOptions);
		};

		this.show = function (customModalDefaults, customModalOptions) {
			//Create temp objects to work with since we're in a singleton service
			var tempModalDefaults = {};
			var tempModalOptions = {};

			//Map angular-ui modal custom defaults to modal defaults defined in service
			angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

			//Map modal.html $scope custom properties to defaults defined in service
			angular.extend(tempModalOptions, modalOptions, customModalOptions);

			if (!tempModalDefaults.controller) {
				tempModalDefaults.controller = function ($scope, $uibModalInstance) {
					$scope.modalOptions = tempModalOptions;
					$scope.modalOptions.ok = function (result) {
						$uibModalInstance.close(result);
					};
					$scope.modalOptions.close = function (result) {
						$uibModalInstance.dismiss('cancel');
					};
				}
			}

			return $uibModal.open(tempModalDefaults).result;
		};

	}]);

(function () {
	'use strict';

	rolpo_app.filter('unsafe', function ($sce) { return $sce.trustAsHtml; });

	rolpo_app
		.filter('utcToLocal', Filter);

	function Filter($filter) {
		return function (utcDateString, format) {
			// return if input date is null or undefined
			if (!utcDateString) {
				return;
			}

			// append 'Z' to the date string to indicate UTC time if the timezone isn't already specified
			if (utcDateString.indexOf('Z') === -1 && utcDateString.indexOf('+') === -1) {
				utcDateString += 'Z';
			}

			// convert and format date using the built in angularjs date filter
			return $filter('date')(utcDateString, format);
		};
	}
})();

(function () {
	'use strict';

	rolpo_app
		.filter('utcToLocal', Filter);

	function Filter($filter) {
		return function (utcDateString, format) {
			// return if input date is null or undefined
			if (!utcDateString) {
				return;
			}

			// append 'Z' to the date string to indicate UTC time if the timezone isn't already specified
			if (utcDateString.indexOf('Z') === -1 && utcDateString.indexOf('+') === -1) {
				utcDateString += 'Z';
			}

			// convert and format date using the built in angularjs date filter
			return $filter('date')(utcDateString, format);
		};
	}
})();

rolpo_app.directive('icheck', ['$timeout', function ($timeout) {
	return {
		require: 'ngModel',
		link: function ($scope, element, $attrs, ngModel) {
			return $timeout(function () {
				var value = $attrs['value'];

				$scope.$watch($attrs['ngModel'], function (newValue) {
					$(element).iCheck('update');
				})

				return $(element).iCheck({
					checkboxClass: 'icheckbox_minimal-blue',
				}).on('ifChanged', function (event) {
					if ($(element).attr('type') === 'checkbox' && $attrs['ngModel']) {
						$scope.$apply(function () {
							return ngModel.$setViewValue(event.target.checked);
						});
					}
					if ($(element).attr('type') === 'radio' && $attrs['ngModel']) {
						return $scope.$apply(function () {
							return ngModel.$setViewValue(value);
						});
					}
				});
			});
		}
	};
}]);


//var GET_CODE_PING = function () {
//	$.get(serviceBase + "api/Home/__Garbage_Collection_CHECK_PING", function (data) {
//		//alert('success');
//	}).fail(function () {
//		//alert("error");
//	});
//};
//setInterval(GET_CODE_PING, 240000);


//window.onload = function () {
//	var url = document.location.toString();
//	if (url.match('#')) {
//		$('.nav-tabs a[href=#' + url.split('#')[1] + ']').tab('show');
//	}

//	//Change hash for page-reload
//	$('.nav-tabs a[href=#' + url.split('#')[1] + ']').on('shown', function (e) {
//		window.location.hash = e.target.hash;
//	});
//};


rolpo_app.directive('ngEnter', function () {
	return function (scope, element, attrs) {
		element.bind("keydown keypress", function (event) {
			if (event.which === 13) {
				scope.$apply(function () {
					scope.$eval(attrs.ngEnter, { 'event': event });
				});

				event.preventDefault();
			}
		});
	};
});

rolpo_app.directive('strToNum', function () {
	return {
		require: 'ngModel',
		link: function (scope, element, attrs, ngModel) {
			ngModel.$parsers.push(function (value) {
				return '' + value;
			});
			ngModel.$formatters.push(function (value) {
				return parseFloat(value);
			});
		}
	};
});

(function () {
	'use strict';
	rolpo_app.directive('ckeditor', Directive);

	function Directive($rootScope) {
		return {
			require: 'ngModel',
			link: function (scope, element, attr, ngModel) {
				var editorOptions = {
					height: 100,
					toolbar: [
						{ name: 'basic', items: ['Bold', 'Italic', 'Underline'] },
						{ name: 'links', items: ['Link', 'Unlink'] },
						{ name: 'tools', items: ['Maximize'] },
						{ name: 'basicstyles', items: ['Font', 'FontSize', 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript'] }

					],
					removePlugins: 'elementspath',
					resize_enabled: false
				};


				// enable ckeditor
				var ckeditor = element.ckeditor(editorOptions);

				// update ngModel on change
				ckeditor.editor.on('change', function () {
					ngModel.$setViewValue(this.getData());
				});
			}
		};
	}
})();
