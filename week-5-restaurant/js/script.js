$(function () {
  $("#navbarToggle").blur(function (event) {
    var screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      $("#collapsable-nav").collapse('hide');
    }
  })
});


(function (global) {
  var sz = {};

  var homeHtml = "snippets/home-snippet.html";
  var allCategoriesUrl = "http://davids-restaurant.herokuapp.com/categories.json";
  var categoriesTitleHtml = "snippets/categories-title-snippet.html";
  var categoryHtml = "snippets/category-snippet.html";
  var menuItemUrl = "http://davids-restaurant.herokuapp.com/menu_items.json?category=";
  var menuItemsTitleHtml = "snippets/menu-items-title.html";
  var menuItemsHtml = "snippets/menu-items.html";
  
  var insertHtml = function (selector, html) {
    var targetElem = document.querySelector(selector);
    targetElem.innerHTML = html;
  }

  var showLoading = function (selector) {
    var html = "<div class = 'text-center'>";
    html += "<img src = 'images/ajax-loader.gif'></div>";
    insertHtml(selector, html);
  }
  var insertProperty = function (string, propName, propValue) {
    var propToReplace = "{{" + propName + "}}";
    string = string.replace(new RegExp(propToReplace, "g"), propValue);
    return string;
  }

  document.addEventListener("DOMContentLoaded", function (event) {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest (
      homeHtml, 
      function (responseText) {
        document.querySelector("#main-content")
        .innerHTML = responseText;
      },
      false); 
  });

  sz.loadMenuCategories = function () {
    // debugger;
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest ( 
      allCategoriesUrl,
      buildAndShowCategoriesHTML);
  }

  function buildAndShowCategoriesHTML (categories) {
    $ajaxUtils.sendGetRequest(
      categoriesTitleHtml,
      function (categoriesTitleHtml) {
        // debugger;
        $ajaxUtils.sendGetRequest (
          categoryHtml,
          function (categoryHtml) {
            var categoriesViewHtml = 
              buildCategoriesViewHtml (categories,
                                      categoriesTitleHtml, 
                                      categoryHtml);
            insertHtml("#main-content", categoriesViewHtml);
          },
          false);
      },
      false);
  }

  function buildCategoriesViewHtml (categories,       categoriesTitleHtml, categoryHtml) {
    var finalHtml = categoriesTitleHtml;
    finalHtml += '<section class = "row">';

    for (var i = 0; i < categories.length; i++) {
      // Insert category values
      var html = categoryHtml;
      var name = "" + categories[i].name;
      var short_name = "" +categories[i].short_name;
      html = insertProperty(html, "name", name);
      html = insertProperty(html, "short_name", short_name);
      finalHtml += html;
    }
    finalHtml += "</section>";
    return finalHtml;
  }

  sz.loadMenuItems = function (catShortName) {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest( 
      menuItemUrl+catShortName,
      buildAndShowItemsHTML);
  }

  function buildAndShowItemsHTML(menuItems) {
    $ajaxUtils.sendGetRequest( 
      menuItemsTitleHtml,
      function (menuItemsTitleHtml) {
        $ajaxUtils.sendGetRequest(
          menuItemsHtml,
          function (menuItemsHtml) {
            var menuItemsViewHtml = 
            buildMenuItemsViewHtml(menuItems,       
                                  menuItemsTitleHtml,
                                  menuItemsHtml);
            insertHtml("#main-content", menuItemsViewHtml);
            },
          false);
      },
      false);
  }

  function buildMenuItemsViewHtml (menuItems, menuItemsTitleHtml,menuItemsHtml) {
    menuItemsTitleHtml = insertProperty(menuItemsTitleHtml, "name", menuItems.category.name);
    menuItemsTitleHtml = insertProperty(menuItemsTitleHtml, "special_instructions", menuItems.category.special_instructions);

    var finalHtml = menuItemsTitleHtml;
    finalHtml += "<section class = 'row'>";
    
    var singleMenuItems = menuItems.menu_items;
    var catShortName = menuItems.category.short_name;
    
    for (var i = 0; i < singleMenuItems.length; i++) {
      var html = menuItemsHtml;

      html = insertProperty(html, "catShortName", catShortName);
      html = insertProperty(html, "short_name", singleMenuItems[i].short_name);
      html = insertItemPrice(html, "price_small", singleMenuItems[i].price_small);
      html = insertItemPrice(html, "price_large", singleMenuItems[i].price_large);
      html = insertItemPortionName(html, "small_portion_name", singleMenuItems[i].small_portion_name);
      html = insertItemPortionName(html, "large_portion_name", singleMenuItems[i].large_portion_name);
      html = insertProperty(html, "name", singleMenuItems[i].name);
      html = insertProperty(html, "description", singleMenuItems[i].description);

      finalHtml += html;
    }
    finalHtml += "</section>";
    return finalHtml;
  }

  function insertItemPrice (html, pricePropName, priceValue) {
    if (!priceValue) {
      return insertProperty(html, pricePropName, "");
    } else {
      priceValue = "$" + priceValue.toFixed(2);
      html = insertProperty(html, pricePropName, priceValue);
      return html;
    }
  }

  function insertItemPortionName (html, portionPropName, portionValue) {
    if (!portionValue) {
      return insertProperty(html, portionPropName, "");
    } else {
      portionValue = "(" + portionValue + ")";
      html = insertProperty(html, portionPropName, portionValue);
      return html;
    }
  }

  global.$sz = sz;


})(window);