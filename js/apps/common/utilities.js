// xoces/apps/common/utilities.js

define(["jquery", "underscore", "cookies"],
    function ($, _, Cookies) {

        var utils = {};

        utils.activeBankId = function () {
            return utils.cookie('bankId');
        };

        utils.activeUser = $('span.active-user').text().trim();

        utils.api = function () {
            if (window.location.protocol === 'http:') {
                return '/api/v1/';
            } else if (window.location.href.indexOf('touchstone') >= 0) {
                return '/xoces/touchstone/api/v1/';
            } else {
                return '/xoces/api/v1/';
            }
        };

        utils.bindDialogCloseEvents = function () {
            $('div[role="dialog"] button.ui-dialog-titlebar-close').text('x');

            $(document).on('click', '.ui-widget-overlay', function(){
                $(".ui-dialog-titlebar-close").trigger('click');
            });
        };

        utils.cleanUp = function (text) {
            return text;
        };

        utils.cookie = function (name) {
            var cookieValue = typeof Cookies.get(name) === 'undefined' ? '-1' : Cookies.get(name);

            if (cookieValue.indexOf('@') >= 0) {
                return encodeURIComponent(cookieValue);
            } else {
                return cookieValue;
            }
        };

        utils.domainGenus = function () {
            return 'repository-genus-type%3Adomain-repo%40ODL.MIT.EDU';
        };

        utils.doneProcessing = function () {
            $('.processing-spinner').addClass('hidden');
            $('body').removeClass('processing');
        };

        utils.genusType = function (identifier) {
            return utils.id('edx-composition',
                identifier,
                'EDX.ORG');
        };

        utils.getMatchingDomainOption = function (path) {
            var domainRepoOptions = $('.repositories-menu li a'),
                domainMatch;

            domainMatch = _.filter(domainRepoOptions, function (opt) {
                return $(opt).attr('href') === path;
            })[0];

            return domainMatch;
        };

        utils.fixDomainSelector = function (expectedPath) {
            var domainMatch = utils.getMatchingDomainOption(expectedPath),
                $repoBtn = $('.dropdown-toggle');

            $repoBtn.find('span.repository-placeholder').text($(domainMatch).text());
            $('.repositories-menu').data('id', $(domainMatch).data('id'));
            $("ul.repository-navbar li").removeClass('hidden');
            $('#notifications-region').html('');
        };

        utils.id = function (namespace, identifier, authority) {
            return namespace + '%3A' + identifier + '%40' + authority;
        };

        utils.learning = function () {
            return utils.api() + 'learning/objectivebanks/' + utils.cookie('bankId') + '/'
        };

        utils.log = function (type, identifier) {
            var data = {};

            if (type === 'objective') {
                data['learningObjectiveId'] = identifier;
            } else {
                data['itemId'] = identifier;
                data['itemPart'] = type;
            }

            $.ajax({
                url: '/api/v1/subjects/' + utils.activeSubjectId() + '/log/',
                type: 'POST',
                data: data
            }).error(function (xhr, status, msg) {
                alert(xhr.responseTest);
            }).success(function (response) {
                console.log(response);
            });
        };

        utils.parseGenusType = function (genusTypeStr) {
            try {
                var genusType;
                if (genusTypeStr.type === 'Asset') {
                    genusType = genusTypeStr.assetContents[0].genusTypeId;
                } else {
                    genusType = genusTypeStr.genusTypeId;
                }
                return genusType.slice(genusType.indexOf('%3A') + 3,
                    genusType.indexOf('%40'));
            } catch (e) {
                return genusTypeStr.slice(genusTypeStr.indexOf('%3A') + 3,
                    genusTypeStr.indexOf('%40'));
            }
        };

        utils.processing = function () {
            $('.processing-spinner').removeClass('hidden');
            $('body').addClass('processing');
        };

        utils.runId = function () {
            return $('select.run-selector').val();
        };

        utils.selectedDomainId = function (path) {
            if ($("#search-components-menu").hasClass('open')) {
                return $('#search-components-menu select.domain-selector').val();
            } else {
                return $('.ui-dialog select.domain-selector').val();
            }
        };

        utils.showX = function (x) {
            var bankId = utils.cookie('bankId'),
                $banks = $('li.bank-selector'),
                attr = 'has' + utils.toTitle(x),
                bankObj, bankMap;

            bankObj = _.find($banks, function (bank) {
                return $(bank).data('obj').id === bankId;
            });

            bankMap = $(bankObj).data('obj');

            if (bankMap == null) {
                bankMap = JSON.parse(Cookies.get('bankMap'));
            }

            if (bankMap.hasOwnProperty(attr)) {
                return bankMap[attr];
            } else {
                return false;
            }
        };

        utils.slugify = function (str) {
            // From
            // http://dense13.com/blog/2009/05/03/converting-string-to-slug-javascript/
            str = str.replace(/^\s+|\s+$/g, ''); // trim
            str = str.toLowerCase();

            // remove accents, swap ñ for n, etc
            var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
            var to   = "aaaaeeeeiiiioooouuuunc------";
            for (var i=0, l=from.length ; i<l ; i++) {
                str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
            }

            str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
                .replace(/\s+/g, '-') // collapse whitespace and replace by -
                .replace(/-+/g, '-'); // collapse dashes

            return str;
        };

        utils.toTitle = function (str) {
            // http://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript
            return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        };

        utils.updateStatus = function (msg) {
            alert(msg);
        };

        utils.userRepoId = function () {
            return $('span.active-user').data('repo-id');
        };

        utils.wrapText = function (textBlob) {
            var mathjaxScript = $('<script type="text/javascript" src="https://cdn.mathjax.org/mathjax/2.4-latest/MathJax.js?config=TeX-MML-AM_HTMLorMML-full">' +
                    '</script>'),
                configMathjax = $('<script type="text/x-mathjax-config">' +
                    'MathJax.Hub.Config({' +
                    'tex2jax: {' +
                      'inlineMath: [' +
                        "['\\(','\\)']," +
                        "['[mathjaxinline]','[/mathjaxinline]']" +
                      '],' +
                      'displayMath: [' +
                        '["\\[","\\]"],' +
                        "['[mathjax]','[/mathjax]']" +
                      ']' +
                    '}' +
                  '});' +
                  'MathJax.Hub.Configured();</script>');

            try {
                if (textBlob.indexOf('<html') >= 0 && (textBlob.indexOf('<video') === -1)) {
                    try {
                        var wrapper = $(textBlob);
                        if (typeof wrapper.attr('outerHTML') === 'undefined') {
                            throw 'InvalidText';
                        }
                    } catch (e) {
                        var wrapper = $($.parseXML(textBlob));
                    }

                    if (wrapper.find('head').length > 0) {
                        if (textBlob.indexOf('[mathjax') >= 0) {
                            wrapper.find('head').append(configMathjax);
                        }
                        wrapper.find('head').append(mathjaxScript);
                    } else {
                        var head = $('<head></head>');
                        if (textBlob.indexOf('[mathjax') >= 0) {
                            head.append(configMathjax);
                        }
                        head.append(mathjaxScript);
                        if (textBlob.indexOf('<body') < 0 && textBlob.indexOf('<html') < 0) {
                            wrapper = $('<html></html>').append(head)
                                .append('<body>' + textBlob + '</body>');
                        } else if (textBlob.indexOf('<body') < 0) {
                            wrapper = $('<html></html>').append(head)
                                .append('<body>' + wrapper.find('html').html() + '</body>');
                        } else {
                            wrapper.find('html').prepend(head);
                        }
                    }
                } else if (textBlob.indexOf('<problem') >= 0) {
                    var wrapper = $('<html></html>'),
                        head = $('<head></head>'),
                        body = $('<body></body>');
                    body.append(textBlob);
                    if (textBlob.indexOf('[mathjax') >= 0) {
                        head.append(configMathjax);
                    }
                    head.append(mathjaxScript);
                    wrapper.append(head);
                    wrapper.append(body);
                } else if (textBlob.indexOf('<video') >= 0) {
                    wrapper = $(textBlob);
                } else {
                    var wrapper = $('<html></html>'),
                        head = $('<head></head>'),
                        body = $('<body></body>');
                    body.append(textBlob);
                    if (textBlob.indexOf('[mathjax') >= 0) {
                        head.append(configMathjax);
                    }
                    head.append(mathjaxScript);
                    wrapper.append(head);
                    wrapper.append(body);
                }

                if ($.isXMLDoc(wrapper[0])) {
                    return utils.cleanUp(wrapper.contents().prop('outerHTML'));
                } else {
                    return utils.cleanUp(wrapper.prop('outerHTML'));
                }
            } catch (e) {
                // return the textBlob if all else fails
                return $('<html></html>').append(textBlob)[0].outerHTML;
            }
        };

        return utils;
 });