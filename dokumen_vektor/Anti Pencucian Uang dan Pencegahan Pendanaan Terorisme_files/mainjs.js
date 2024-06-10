// more menu minisite 1
var autocollapse = function (menu, maxHeight) {
	var nav = $(menu);
	var navHeight = nav.innerHeight();
	
	if (navHeight >= maxHeight) {
		$(menu + ' .dropdown--more').removeClass('d-none');
		$(".navbar--minisite-1 .navbar-nav").removeClass('w-auto').addClass("w-100");
		while (navHeight > maxHeight) {
			//  add child to dropdown
			var children = nav.children(menu + ' li:not(:last-child)');
			var count = children.length;
			$(children[count - 1]).prependTo(menu + ' .dropdown-menu--more');
			navHeight = nav.innerHeight();
		}
		$(".navbar-nav").addClass("w-auto").removeClass('w-100');
	} else {
		var collapsed = $(menu + ' .dropdown-menu--more').children(menu + ' li');
		if (collapsed.length === 0) {
			$(menu + ' .dropdown--more').addClass('d-none');
		}
		while (navHeight < maxHeight && (nav.children(menu + ' li').length > 0) && collapsed.length > 0) {
			//  remove child from dropdown
			collapsed = $(menu + ' .dropdown-menu--more').children('li');
			$(collapsed[0]).insertBefore(nav.children(menu + ' li:last-child'));
			navHeight = nav.innerHeight();
		}
		
		if (navHeight > maxHeight) {
			autocollapse(menu, maxHeight);
		}
	}
};
// end of menu more minisite 1
/* menghapus menu atas */
var checkSignInExist = setInterval(function () {
	if ($('#O365_TopMenu').length) {
		clearInterval(checkSignInExist);
		if ($('#O365_MainLink_SignIn').length > 0) {
			$('#suiteBarDelta').hide();
			$('#s4-ribbonrow').hide();
			
			$("#s4-workspace").height($(window).height());
		} else {
			$('#O365_MainLink_NavMenu').hide();
			$('.o365cs-nav-brandingText').text('Bank Indonesia');
			$('.o365cs-nav-brandingText').parent().attr('href', '/id');
			
			$("html, body").css("-ms-overflow-style", "auto");
		}
	}
}, 300);

/* menghapus local storage */
var checkLocalStorageExist = setInterval(function () {
	if (localStorage.length>0) {
			clearInterval(checkLocalStorageExist);
			if (localStorage.length>0) {
				localStorage.clear();
			} 	
		}
}, 3000);

$(document).ready(function () {
	$('#SearchBox input[type=text]').keydown(function (e) {
	   
	   if(event.keyCode == 9){
	   		$('#SearchBox a').click();
	   }
	 });
	
	// Add target blank di lampiran
	$('#layout-lampiran a').attr('target', '_blank');
	
	// Add target blank di Quick link
	$('.content__quick-links-list a').attr('target', '_blank');
	/*
	// Remove Character changes Setelah Migrasi
	$('#s4-bodyContainer').html($('layout-lampiran').html().replace(/\u200B/g,''));
		
	//html entity decode
	var titlePages = $('<textarea />').html($(".page-subtitle").text()).text();
	$(".page-subtitle").text(titlePages);
	*/
	
	var cnt = $('#ctl00_g_ecc2559e_4a60_437f_ba58_80eaeea6b4aa').contents();
	$('#ctl00_g_ecc2559e_4a60_437f_ba58_80eaeea6b4aa').replaceWith(cnt);
	var toggleDropdownInitiated = false;
	var dropDownMobileInitiated = false;
	if ($('#O365_MainLink_SignIn').length > 0) {
		$('#suiteBarDelta').hide();
		$('#s4-ribbonrow').hide();
	} else {
		$('#O365_MainLink_NavMenu').hide();
		$('.o365cs-nav-brandingText').text('Bank Indonesia');
		$('.o365cs-nav-brandingText').parent().attr('href', '/id');
	}
	
	$('.top-banner__arrow').on('click', function () {
		$('#s4-workspace').animate({
			scrollTop: $('#backtocontent').offset().top
		}, 1000)
	})
	var btnbackontop = $("#button-back-to-top");
	$('#s4-workspace').scroll(function () {
		if ($('#s4-workspace').scrollTop() > 300) {
			btnbackontop.addClass("show");
		} else {
			btnbackontop.removeClass("show");
		}
	});
	btnbackontop.on("click", function (e) {
		e.preventDefault();
		$('#s4-workspace').animate({
			scrollTop: 0
		}, "300");
	});
	
	$(window).resize(function (e) {
		if (($(window).width()) > 768) {
			//to prevent the listener toggle the object everytime the window is resized
			if (!toggleDropdownInitiated) {
				toggleDropdownInitiated = true;
				$('.dropdown-menu.dropdown-megamenu').each(function (e) {
					$(this).removeAttr("style"); //remove hrs stlh style-nya muncul
				})
				$('body').on('mouseenter mouseleave', '.dropdown', toggleDropdown);
			}
		} else {
			toggleDropdownInitiated = false;
			$('body').off('mouseenter mouseleave', '.dropdown', toggleDropdown);
			$('.dropdown-menu.dropdown-megamenu').each(function (e) {
				$(this).removeAttr("style"); //remove hrs stlh style-nya muncul
			})
			if (!dropDownMobileInitiated) {
				dropDownMobileInitiated = true;
				dropDownMobile();
			}
		}
	});
	
	$('.top-menu .nav-item').each(function () {
		var sumLi = $(this).find('li').length;
		var level2Parent = $(this).find('.dropdown-megamenu__menu');
		var level2 = $(this).find('.dropdown-megamenu__menu').children('li');
		var level3;
		var sumLiHalf = sumLi / 2;
		var arrLv2 = [];
		var arrFib = [];
		var arrMenuLv2 = [];
		level2Parent.each(function () {
			level2.each(function () {
				level3 = $(this).find('li');
				arrLv2.push(level3.length + 1);
				arrMenuLv2.push($(this));
			});
			$(this).parents('.dropdown-megamenu').find('.dropdown-megamenu__column:nth-child(2)').children('.dropdown-megamenu__column--wrapper').prepend('<ul class="dropdown-megamenu__menu"></ul>');
			var startCount = 0;
			var fib = 0;
			for (var i = 0; i < level2.length; i++) {
				var nextCount = arrLv2[i];
				fib = startCount + nextCount;
				arrFib.push(fib);
				if (sumLi >= 7) {
					if (fib > sumLiHalf) {
						$($(this).parents('.dropdown-megamenu').find('.dropdown-megamenu__column:nth-child(2)').children('.dropdown-megamenu__column--wrapper').children('.dropdown-megamenu__menu')).append(arrMenuLv2[i + 1]);
					}
				}
				startCount = fib;
			}
		});
	})
	
	var url = window.location.href;
	if (url.indexOf("/WrkSetng.aspx") > 1) {
		$('footer.ms-dialogHidden').css('position', 'relative');
	}
	
	if (url.indexOf("/wrksetng.aspx") > 1) {
		$('footer.ms-dialogHidden').css('position', 'relative');
	}
	
	if (url.indexOf("/RemWrkfl.aspx") > 1) {
		$('footer.ms-dialogHidden').css('position', 'relative');
	}	
	
	if (url.indexOf("/remwrkfl.aspx") > 1) {
		$('footer.ms-dialogHidden').css('position', 'relative');
	}

	if (url.indexOf("/rupiah/") > 1) {
		$('.ms-rtestate-field h2').css('padding-top', 'unset');
	}

	if (url.indexOf("/sdds/") > 1) {
		$('.m1, .m2, .m3, .m4').css('display', 'inline-block');
		$('.table tbody tr > th').css('vertical-align', 'middle');
	}
		
	if (url.indexOf("/iru/") > 1) {
		//$('.dua-bahasa').css('display', 'none');
		$('#IDLang img').css('display', 'none');		
	}
	
	if (url.indexOf("/umkm/") > 1) {
		//$('.dua-bahasa').css('display', 'none');
		$('#ENLang img').css('display', 'none');
	}

	if (url.indexOf("/user.aspx") > 1) {
		$(function () {
			$('.dropdown-megamenu__submenu .caret').on('click', function (e) {
				if (!$(this).parents('div.clearfix').next().hasClass('show')) { 
					$(this).parents('.dropdown-menu').first().find('.show').removeClass('show'); 
				}
				var subMenu = $(this).parents('div.clearfix').next('.dropdown-megamenu__submenu-list'); 
				subMenu.toggleClass('show');				
				$(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function (e) { 
					$('.dropdown-megamenu__submenu .show').removeClass('show');
				});
				return false;
			});	
		});
	}
	
	//add ID for Search Page
	if (url.indexOf("/search.aspx") > 1) {
		$('.content-text.row').attr('id', 'page-search-result');
	}

	
	//Check Bilingual Icon Bahasa and change placeholder search
	if (url.indexOf("/id/") > 1) {
		$('#bahasa-indon').css('display', 'block');
		$("#SearchBox input.ms-textSmall").prop('value','');
		$("#SearchBox input.ms-textSmall").prop('placeholder','Masukkan Kata Pencarian');
		$("#SearchBox input.ms-textSmall").prop('title','Masukkan Kata Pencarian');

	} else if (url.indexOf("/en/") > 1) {
		$('#bahasa-english').css('display', 'block');
	}
	//Menu Flag Bahasa 
	$(".english").hide();
	$(".englishnya").hide();
	$(".navbar-language").mouseenter(function () {
		$(".englishnya").slideDown("fast");
	});
	$(".navbar-language").mouseleave(function () {
		$(".englishnya").slideUp("fast");
		$(".englishnya").hide();
	});
	
	var urlSource = window.location.href.split('/');
    if (urlSource[4]==='tentang-bi'){
    	$('.nav-item.dropdown:first-child').addClass('active-page');
    }
    else if (urlSource[4]==='fungsi-utama'){
    	$('.nav-item.dropdown:nth-child(2)').addClass('active-page');
    }
    else if (urlSource[4]==='rupiah'){
    	$('.nav-item.dropdown:nth-child(3)').addClass('active-page');
    }
    else if (urlSource[4]==='publikasi'){
    	$('.nav-item.dropdown:nth-child(4)').addClass('active-page');
    }
    else if (urlSource[4]==='statistik'){
    	$('.nav-item.dropdown:nth-child(5)').addClass('active-page');
    }
    else if (urlSource[4]==='layanan'){
    	$('.nav-item.dropdown:nth-child(6)').addClass('active-page');
    }
    else if (urlSource[4]==='informasi-publik'){
    	$('.nav-item.dropdown:last-child').addClass('active-page');
    }

	//Responsive Menu Highlight Minisite
	var str = location.href.toLowerCase();
	$(".header-menu--minisite-1 .nav-item a").each(function () {
		if (str.indexOf(this.href.toLowerCase()) > -1) {
			//$(".header-menu--minisite-1 .nav-item a.current").removeClass("current"); 
			$(this).addClass("current");
		}
	});
	$(".navbar-nav#navMore .nav-item a").each(function () {
		if (str.indexOf(this.href.toLowerCase()) > -1) {
			$(this).addClass("active");
		}
	});
	//Mastrepage Menu Highlight Minisite
	$(".carousel-item:nth-child(1) .menu-slider__item--non-padding a").each(function () {
		if (str.indexOf(this.href.toLowerCase()) > -1) {
			$(this).parent().addClass("active-umkm");
		}
	});
	$(".carousel-item:eq(1) .menu-slider__item--non-padding a").each(function () {
		if (str.indexOf(this.href.toLowerCase()) > -1) {
			$(this).parent().addClass("active-umkm");
			$(function () {
				$('.carousel').carousel(1);
			});
		}
	});
	$(".carousel-item:eq(2) .menu-slider__item--non-padding a").each(function () {
		if (str.indexOf(this.href.toLowerCase()) > -1) {
			$(this).parent().addClass("active-umkm");
			$(function () {
				$('.carousel').carousel(2);
			});
		}
	});
	
	//Mastrepage Menu Highlight Aktif
	/*
	$(".nav-item.dropdown a").each(function () {
		if (str.indexOf(this.href.toLowerCase()) > -1) {
			$(this).closest('.nav-item.dropdown').addClass("active-page");
		}
	});
	*/
	//Mastrepage Footer Menu Highlight Aktif
	$(".top-footer .ml-4 a").each(function () {
		if (str.indexOf(this.href.toLowerCase()) > -1) {
			$(this).addClass("current");
		}
	});
	
	//Mastrepage Top Menu Highlight Aktif
	$(".header-menu .nav-item a").each(function () {
		if (str.indexOf(this.href.toLowerCase()) > -1) {
			$(this).addClass("active");
		}
	});
	
	/* navigasi di site setting dan permission */
	var placeHolderTop = $('#DeltaPlaceHolderTop');
	var htmlNavBreadCrumbSettings = '<div class="container"><nav aria-label="breadcrumb" class="nav-breadcrumb-cms"><ol class="breadcrumb breadcrumb-cms"></ol></nav></div>'
	var hrefSitePermission = '<a href="' + _spPageContextInfo.siteAbsoluteUrl + '/_layouts/15/user.aspx">Site Permissions</a>';
	var htmlNavSitePermission = '<li class="breadcrumb-item">' + hrefSitePermission + '</li>'
	if (url.indexOf("/_layouts/15/user.aspx") > 1) {
		var htmlNavSitePermission = '<li class="breadcrumb-item" aria-current="page">Site Permissions</li>'
		placeHolderTop.append(htmlNavBreadCrumbSettings);
		$('.breadcrumb-cms').append(htmlNavSitePermission);
	} else if (url.indexOf("/_layouts/15/people.aspx") > 1) {
		var currentGroup = $('#DeltaPlaceHolderPageTitleInTitleArea > span:last').text().trim();
		var htmlNavCurrentGroup = '<li class="breadcrumb-item" aria-current="page">' + currentGroup + '</li>'
		placeHolderTop.append(htmlNavBreadCrumbSettings);
		$('.breadcrumb-cms').append(htmlNavSitePermission);
		$('.breadcrumb-cms').append(htmlNavCurrentGroup);
	} else if (url.indexOf("/_layouts/15/groups.aspx") > 1) {
		var htmlNav = '<li class="breadcrumb-item" aria-current="page">Groups</li>'
		placeHolderTop.append(htmlNavBreadCrumbSettings);
		$('.breadcrumb-cms').append(htmlNavSitePermission);
		$('.breadcrumb-cms').append(htmlNav);
	} else if (url.indexOf("/_layouts/15/newgrp.aspx") > 1) {
		var htmlNav = '<li class="breadcrumb-item" aria-current="page">New Group</li>'
		placeHolderTop.append(htmlNavBreadCrumbSettings);
		$('.breadcrumb-cms').append(htmlNavSitePermission);
		$('.breadcrumb-cms').append(htmlNav);
	} else if (url.indexOf("/_layouts/15/editgrp.aspx") > 1) {
		var htmlNav = '<li class="breadcrumb-item" aria-current="page">Edit Group</li>'
		placeHolderTop.append(htmlNavBreadCrumbSettings);
		$('.breadcrumb-cms').append(htmlNavSitePermission);
		$('.breadcrumb-cms').append(htmlNav);
	}

	$("a.thumb").click(function (event) {
		event.preventDefault();
		var content = $(".modal-body");
		content.empty();
		var title = $(this).attr("title");
		$(".modal-title").html(title);
		content.html($(this).html());
		$(".modal-profile").modal({
			show: true
		});
	});
	// Pagination Script
	var CLASS_DISABLED = "disabled",
		CLASS_ACTIVE = "active",
		CLASS_SIBLING_ACTIVE = "active-sibling",
		DATA_KEY = "pagination-custom";
	$(".pagination-custom").each(initPagination);

	function initPagination() {
		var $this = $(this);
		$this.data(DATA_KEY, $this.find(".pagination-list").index(".active"));
		$this.find(".prev").on("click", navigateSinglePage);
		$this.find(".next").on("click", navigateSinglePage);
		$this.find(".pagination-list").on("click", function () {
			var $parent = $(this).closest(".pagination-custom");
			$parent.data(DATA_KEY, $parent.find(".pagination-list").index(this));
			changePage.apply($parent);
		});
	}

	function navigateSinglePage() {
		if (!$(this).hasClass(CLASS_DISABLED)) {
			var $parent = $(this).closest(".pagination-custom"),
				currActive = parseInt($parent.data("pagination-custom"), 10);
			currActive += 1 * ($(this).hasClass("prev") ? -1 : 1);
			$parent.data(DATA_KEY, currActive);
			changePage.apply($parent);
		}
	}

	function changePage(currActive) {
		var $list = $(this).find(".pagination-list"),
			currActive = parseInt($(this).data(DATA_KEY), 10);
		$list.filter("." + CLASS_ACTIVE).removeClass(CLASS_ACTIVE);
		$list.filter("." + CLASS_SIBLING_ACTIVE).removeClass(CLASS_SIBLING_ACTIVE);
		$list.eq(currActive).addClass(CLASS_ACTIVE);
		if (currActive === 0) {
			$(this).find(".prev").addClass(CLASS_DISABLED);
		} else {
			$list.eq(currActive - 1).addClass(CLASS_SIBLING_ACTIVE);
			$(this).find(".prev").removeClass(CLASS_DISABLED);
		}
		if (currActive == ($list.length - 1)) {
			$(this).find(".next").addClass(CLASS_DISABLED);
		} else {
			$(this).find(".next").removeClass(CLASS_DISABLED);
		}
	}
	// End of Pagination Script
	// === cms e-magz ===
	// add class active on menu cms
	$('.nav-cms .nav .nav-item .dropdown-menu > a').click(function () {
		$('.nav-cms .nav li a').removeClass('active');
		$(this).addClass('active');
		$('.nav-cms .nav li').removeClass('active');
		$(this).parents(".nav-cms li").addClass('active');
	});
	// tooltip ellipsis
	$(".text-truncate , .ellipsis--one-line , .ellipsis--two-line , .ellipsis--three-line").each(function () {
		var titleName = $(this).text();
		$(this).attr('title', titleName);
		$(this).css('transition', 'all 24ms ease-in-out');
	});
	// hide show password
	$(".toggle-password").click(function () {
		$(this).find("i").toggleClass("fa-eye fa-eye-slash");
		var input = $($(this).attr("toggle"));
		if (input.attr("type") == "password") {
			input.attr("type", "text");
		} else {
			input.attr("type", "password");
		}
	});
	// === end of cms e-magz ===
	// === start of bilingual ===
	$("#IDLang").click(function () {
		var url = window.location.toString();
		window.location = url.replace(/en/, 'id');
	});
	$("#ENLang").click(function () {
		//var url = window.location.toString();
		var url = window.location.pathname;
		window.location = url.replace(/id/, 'en');
	});
	//if (window.location.href.indexOf("/en/") > -1) {	
	//	$(".karir").attr("href", "/en/karier/");
	//	$('.karir').text("Career")
	//	$('.glosarium').attr("href", "/en/glosarium.aspx");
	//	$(".edukasi").attr("href", "");
	//	$(".edukasi").text("Education");
	//	$('.peta').attr("href", "/en/peta-situs.aspx");
	//	$('.peta').text("Sites Map");
	//};
	// === end of bilingual ===
	// === more menu minisite 1 ===
	// when the page loads
	//autocollapse('#navMore', 50);
	// when the window is resized
	$(window).on('resize', function () {
		autocollapse('#navMore', 80);
	});
	$(".dropdown--more .nav-link").click(function () {
		$(this).siblings().toggle();
	})
	// === end of more menu minisite 1 ===
	// enable click direct header menu
	$(window).resize(function () {
		if ($(window).width() > 768) {
			$('#test-menu > li > .dropdown-toggle').click(function () {
				window.location = $(this).attr('href');
			});
		}
	});
	$('[id$="_UpdatePanelSurvey"] .pagination-custom .prev, [id$="_UpdatePanelSurvey"] .pagination-custom .next').css({
		"width": "40px",
		"height": "40px"
	});
	// hide breadcrumb item ID/EN
	let breadcrumbItem = $(".breadcrumb-item > a");
	for (let x = 0; x < breadcrumbItem.length; x++) {
		let divItem = breadcrumbItem[x];
		let content = divItem.innerHTML.trim();
		if (content == 'ID' || content == 'EN' || content == 'Bank Indonesia') {
			divItem.parentElement.style.display = 'none';
		}
	}
	
	// accordion scroll on the title head when show up
	$('#heading1').addClass('warna-biru');
	$('.accordion-head > a').one('click',function (event) {
		//window.location = $(this).attr('href');	
		$('.card-header.warna-biru').removeClass('warna-biru');
		$(this).closest('.card-header').toggleClass("warna-biru");
		if (this.hash !== "") {
			event.preventDefault();
			var hash = this.hash;
			$('#s4-workspace').animate({
				scrollTop: $(hash).offset().top
			}, 100, function(){
				window.location.hash = hash;
			});
	    }
	});
	
	//mengaktifkan enter key di IE
    $("#TextBoxSearch").keypress(function(e) {
	    if(e.which == 13) {
	        $(this).parent().siblings().find("[id$='ButtonFilter']").click();
	    }
	});
	
	// Get saved data from sessionStorage
	let selectedCollapse = sessionStorage.getItem("selectedCollapse");
	if (selectedCollapse != null) {
		$("#accordion .collapse").removeClass("show");
		$(selectedCollapse).addClass("show");
	}
	//To set, which one will be opened
	$(".state-accordion").on("click", function () {
		let target = $(this).data("target");
		//Save data to sessionStorage
		sessionStorage.setItem("selectedCollapse", target);
	});
	
	//add ID and class floating header for content preview
	var countFloatingMenu = 1; 
	$('.content-preview-title').each(function() {
		$(this).addClass('floating-menu');
		$(this).attr('id', 'floating-'+countFloatingMenu);
		countFloatingMenu++;
	});
	
	// Floating header

	var navFloating = "<nav id='nav-floating'><div class='container'><ul id='ul-floating' class='nav nav-tabs'>";
	$('h2.floating-menu').each(function () {
		navFloating += "<li class='nav-item'><a class='nav-link' href='#" + $(this).attr('id') + "'>" + $(this).text().trim() + "</a></li>";
	});
	navFloating += "</ul></div></nav>";

	$('#DeltaPlaceHolderMain').prepend(navFloating);

	var floatingHeader = $("#nav-floating");
	$('#s4-workspace').scroll(function () {
		if ($('#s4-workspace').scrollTop() > 350) {
			floatingHeader.addClass("sticky");
		} else {
			floatingHeader.removeClass("sticky");
		}

		var scrollDistance = $('#s4-workspace').scrollTop();
		// Assign active class to nav links while scolling
		$('.floating-menu').each(function (i) {
			if ($(this).position().top - 100 <= scrollDistance) {
				$('#ul-floating li a.active').removeClass('active');
				$('#ul-floating li a').eq(i).addClass('active');
				setTimeout(function () {
					$('#ul-floating').scrollingTabs('scrollToActiveTab');						  		
				}, 200);
				
			}
		});
		
	});

	$('#ul-floating').scrollingTabs({
	  bootstrapVersion: 4,
      scrollToTabEdge: true,
      enableSwiping: true,
      disableScrollArrowsOnFullyScrolled: true,
      leftArrowContent: '<div class="scrtabs-tab-scroll-arrow scrtabs-tab-scroll-arrow-left"><button class="scrtabs-arrow-btn scrtabs-click-target" type="button"><i class="fa fa-chevron-left"></i></button></div>',
	  rightArrowContent: '<div class="scrtabs-tab-scroll-arrow scrtabs-tab-scroll-arrow-right"><button class="scrtabs-arrow-btn scrtabs-click-target" type="button"><i class="fa fa-chevron-right"></i></button></div>'
	});

	/// hide #nav-floating that doesn't have li (list menu)
    $('#nav-floating:not(:has(li))').hide();

	// end of Floating header
	
	// Content Preview
	$(".content-preview-wrapper").each(function(){
		var wrapper = $(this);
		var contentSummaryChild = $(this).find(".content-preview-summary span, .content-preview-summary div, .content-preview-summary p");
		
		var contentSummary = $(this).find(".content-preview-summary");
		var linkSummary = $(this).find(".content-preview-more");
		
		contentSummaryChild.contents().unwrap();
		contentSummary.find('br').replaceWith('<p></p>');								
		contentSummary.find('span').nextAll('p').css('display', 'none');			
		$(linkSummary).appendTo(contentSummary);
	});
	// end of Content Preview
	
	//hide empty pagination
	$(".about__content-pagination > nav:not(:has(span))").each(function() {
	  $(this).closest(".about__content-pagination").hide();
	});
	
	//sticky header minisite 1
	var floatingHeaderMinisite = $("#carousel-menu-minisite");
	$('#s4-workspace').scroll(function () {
		if ($('#s4-workspace').scrollTop() > 350) {
			floatingHeaderMinisite.addClass("sticky");
		} else {
			floatingHeaderMinisite.removeClass("sticky");
		}
	});
	


}); //tutupnya document.ready

function toggleDropdown(e) {
	    const _d = $(e.target).closest('.dropdown'),
	        _m = $('.dropdown-menu', _d);
	    setTimeout(function () {
	        const shouldOpen = e.type !== 'click' && _d.is(':hover');
	        
		    if (shouldOpen) {
				_m.stop(true, true).slideDown(300);
			} else {
				_m.stop(true, true).hide();
			}
	
	        _m.toggleClass('show', shouldOpen);
	        _d.toggleClass('show', shouldOpen);
	        $('[data-toggle="dropdown"]', _d).attr('aria-expanded', shouldOpen);
	    }, 200 );//e.type === 'mouseleave' ? 200 : 0);
	}
	
	$('body')
	    .on('mouseenter mouseleave', '.dropdown', toggleDropdown)
	    .on('click', '.dropdown-menu a', toggleDropdown);


function dropDownMobile() {
	//submenu dropdown on mobile;
	//$('.dropdown-menu a.dropdown-toggle').on('click', function (e) {
	$('.dropdown-megamenu__submenu .caret').on('click', function (e) {
		//to remove class show from other menu-level-3 yg lagi kebuka
		if (!$(this).parents('div.clearfix').next().hasClass('show')) { //$(this).next() = dropdown-megamenu__submenu-list
			$(this).parents('.dropdown-menu').first().find('.show').removeClass('show'); //.dropdown-menu
		}
		//show menu level 3
		var subMenu = $(this).parents('div.clearfix').next('.dropdown-megamenu__submenu-list'); //.dropdown-megamenu__submenu-list
		subMenu.toggleClass('show');
		//remove class show from dropdown-megamenu__submenu-list after dropdown is hidden
		$(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function (e) { //li.nav-item.dropdown.show
			$('.dropdown-megamenu__submenu .show').removeClass('show');
		});
		return false;
	});
	// Add slideDown animation to Bootstrap dropdown when expanding.
	// Add slideUp animation to Bootstrap dropdown when collapsing.
	/*
	$('.dropdown a').on('click', function () {
	    $(this).parent().toggleClass('show');
	    console.log('test Click');
	});	
	*/
	
	$('.dropdown').on('show.bs.dropdown', function(){
	    $(this).find('.dropdown-menu').first().stop(true, true).slideDown();
	});
	
	$('.dropdown').on('hide.bs.dropdown', function(){
		$(this).find('.dropdown-menu').first().stop(true, true).slideUp(1, function(){
			$('.dropdown').removeClass('show');
		  	$('.dropdown').find('.dropdown-toggle').attr('aria-expanded','false');
		});	
	});
}

$("#carouselExample").on("slide.bs.carousel", function (e) {
	var $e = $(e.relatedTarget);
	var idx = $e.index();
	var itemsPerSlide = 3;
	var totalItems = $(".carousel-item").length;
	if (idx >= totalItems - (itemsPerSlide - 1)) {
		var it = itemsPerSlide - (totalItems - idx);
		for (var i = 0; i < it; i++) {
			// append slides to end
			if (e.direction == "left") {
				$(".carousel-item").eq(i).appendTo(".carousel-inner");
			} else {
				$(".carousel-item").eq(0).appendTo(".carousel-inner");
			}
		}
	}
});
//redirect search id en
var isOsssearchresults = (window.location.href.indexOf('/osssearchresults.aspx') > -1);
var isEN = (window.location.href.indexOf('/en/') > -1);
var isID = (window.location.href.indexOf('/id/') > -1);
var param = 'k';
var searchParameter = GetParameterValues(param);

function GetParameterValues(param) {
	var url = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	for (var i = 0; i < url.length; i++) {
		var urlparam = url[i].split('=');
		if (urlparam[0] == param) {
			return urlparam[1];
		}
	}
}
if (isOsssearchresults && isEN) {
	window.location = '/en/search.aspx#k=' + searchParameter;
} else if (isOsssearchresults && isID) {
	window.location = '/id/search.aspx#k=' + searchParameter;
}
// end of redirect search id en


function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('#');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

window.onload = function() {
/* modified search result count */

    if (window.location.href.toLowerCase().indexOf("search.aspx") > -1) {
var startItem = getUrlVars()["s"];
var lastItem = $("#ResultCount").text().match(/\d+/);
if((typeof startItem === "undefined") )
{
	if((parseInt(lastItem)-(1))>9)
	{
	var range = 1 + " - " + ((1)+(9)) + " of ";
	}else
	{
	var range = 1 + " - " + lastItem + " of ";
	}
}
else
{
	if((parseInt(lastItem)-parseInt(startItem))>9)
	{
	var range = startItem + " - " + (parseInt(startItem)+(9)) + " of ";
	}else
	{
	var range = startItem + " - " + lastItem + " of";
	}

}
$("#ResultCount").text(range + $("#ResultCount").text().toLowerCase());
}

/* end of modified search result count*/


/* menambah menu workflow */
	if ($('#O365_SubLink_ShellSignout').length > 0) {
		var linkApproval = '<a class="o365button o365cs-contextMenuItem ms-fcl-b ms-fcl-b-h ms-fcl-b-f" role="link" id="O365_SubLink_Approval" aria-label="Workflow" href="/approval.aspx" style="text-decoration: none;">Workflow Approval</a>';
		$(linkApproval).insertBefore($('#O365_SubLink_ShellSignout'));
		var linkApproval = $('#O365_SubLink_Approval');
		$(linkApproval).mouseover(function () {
			$(linkApproval).addClass("o365cs-contextMenuItemHover").addClass("ms-bgc-nl");
		});
		$(linkApproval).mouseout(function () {
			$(linkApproval).removeClass("o365cs-contextMenuItemHover").removeClass("ms-bgc-nl");;
		});
	}
	
	/* menambah menu workflow */

  };
  
  /* modified search result count*/

    if (window.location.href.toLowerCase().indexOf("search.aspx") > -1) {
    $(window).on('hashchange', function(e){
    setTimeout(function(){ 
    var startItem = getUrlVars()["s"];
var lastItem = $("#ResultCount").text().match(/\d+/);
if((typeof startItem === "undefined") )
{
	if((parseInt(lastItem)-(1))>9)
	{
	var range = 1 + " - " + ((1)+(9)) + " of ";
	}else
	{
	var range = 1 + " - " + lastItem + " of ";
	}
}
else
{
	if((parseInt(lastItem)-parseInt(startItem))>9)
	{
	var range = startItem + " - " + (parseInt(startItem)+(9)) + " of ";
	}else
	{
	var range = startItem + " - " + lastItem + " of";
	}

}
$("#ResultCount").text(range + $("#ResultCount").text().toLowerCase());
 }, 1000);
    
});
}

/* end of modified search result count */

