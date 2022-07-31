jQuery( document ).ready(function($) {
    CookiesInit();

//---------------------------------------------------------------
//    Vars
//---------------------------------------------------------------

var box_limit = 12;
var current_cookies_selected = 0;
var popup_is_open = false;


//---------------------------------------------------------------
//    Functions
//---------------------------------------------------------------

//functions for adding cookies to box
function CookiesInit(){
  selectOneDozen();
  SetInitialCookieLimit();
   setTimeout(function () {
     selectOneDozen();
   }, 1000);
}

function SetInitialCookieLimit(){
  var limit;
  
    var check_box_limit = $('input[name=Size]:checked').val();
    if(check_box_limit == "One Dozen"){
      limit = 12;
    }else{
      limit = 6;
    }
  

  $('.total_of_cookies_limit').html(limit);
  box_limit = limit;
}

function SetCookieLimit(limit){
  $('.total_of_cookies_limit').html(limit); 
  box_limit = limit;
}


function clickOneDozen(function_this){
  let scrollable = $(function_this).data('scroll');
  selectOneDozen();
  if(scrollable){
    scrollToCookieSelection();
  }
}

function clickHalfDozen(function_this){
  let scrollable = $(function_this).data('scroll');
  selectHalfDozen();
  if(scrollable){
    scrollToCookieSelection();
  }
}


function selectOneDozen(){  
  $("input[value='One Dozen']").click();
  $(".button-variable-term-One").click();
  UpdateCookiesSelectedAmount();
}

function selectHalfDozen(){
  $("input[value='Half Dozen']").click();
  $(".button-variable-term-Half").click();
  UpdateCookiesSelectedAmount();
}


function GetTotalAmountOfCookiesInBox(){
  var amount = $(".cookies-picked-container .current_amount_of_cookies").text();
  return parseInt(amount);
}

function GetCookiesSelectedAmount(){
  var cookies_selected = 0;
  $(".choose-your-own-wrapper .choose__your__own__single__cookie_wrapper.active_cookie").each(function( index ) {
    var cookie_amount = parseInt($(this).find(".quantity__input").val());
    cookies_selected += cookie_amount;
  });
  return cookies_selected;
}

function UpdateCookiesSelectedAmount(){
  current_cookies_selected = GetCookiesSelectedAmount();
  // console.log(current_cookies_selected);
  $(".current_amount_of_cookies").text(current_cookies_selected);
  CheckCanAddToCart();
}

function CheckCanAddToCart(){
  if(current_cookies_selected == box_limit){
    $('.custom_add_to_cart_bottom_bar .single_add_to_cart_button').removeClass('disabled');
  }else{
    $('.custom_add_to_cart_bottom_bar .single_add_to_cart_button').addClass('disabled');
  }

}



function ResetSelectedCookies(){
  $(".choose-your-own-wrapper .choose__your__own__single__cookie_wrapper").each(function( index ) {
    $(this).removeClass("active_cookie");
    $(this).find(".quantity__input").attr('value', 0);
  });
  UpdateCookiesSelectedAmount();
  CheckCanAddToCart();
}

function UpdateCookiesNameCart(){
   var cookies_selected_array = [];
  $(".choose-your-own-wrapper .choose__your__own__single__cookie_wrapper.active_cookie").each(function( index ) {
    var cookie_name = $(this).find(".producttitle").text();
    var cookie_amount = parseInt($(this).find(".quantity__input").val());
    cookies_selected_array.push(cookie_name+"("+cookie_amount+")");
    //console.log(cookie_name+"("+cookie_amount+")");
  });

  $(".woocommerce-variation-add-to-cart #picked_cookies").val(cookies_selected_array);
 
}

function AddCookiesToCart(){


}



function scrollToCookieSelection(){
  var header_height = $(".elementor-location-header").height();
  $('html, body').animate({
    scrollTop: $(".custom_choose_product_list").offset().top - header_height
  }, 600);
}

function showOverlay(){
  $('.pink-overlaybg').show();
}

function hideOverlay(){
  $('.pink-overlaybg').hide();
}


//---------------------------------------------------------------
//    jQuery Events
//---------------------------------------------------------------

$('.size-dozen-button-scroll').on('click',function(event){
  event.preventDefault();
  clickOneDozen(this);
});


$('.size-half-button-scroll').on('click',function(event){
  event.preventDefault();
  clickHalfDozen(this);
});


$('.qty_changer_cookie_choose__your__own').on('click', function (evt) {
  evt.preventDefault();
  
  let button_action = $(this).data('qty_action');
  
  //let name = $(this).closest('.choose__your__own__single__cookie_wrapper').find('.producttitle').text();

  let current_value = parseInt($(this).siblings('.custom__quantity__input').val());

  if (button_action == 'increase'){
    if(current_cookies_selected >= box_limit){
      current_value = current_value;     

    }else{
      current_value++;
    }
  } 
  if (button_action == 'decrease'){
    current_value--;

    if(current_value <= 0){
      current_value = 0;
    }
  } 

 
  if(current_value >= 1){
    $(this).parent().parent().parent().addClass('active_cookie');
  }else{
    $(this).parent().parent().parent().removeClass('active_cookie'); 
  }
  $(this).siblings('.custom__quantity__input').attr('value', current_value);
  UpdateCookiesSelectedAmount();
  UpdateCookiesNameCart();
});


$('.variant-radios input[name=Size]').on('click', function (evt) {
  var value_selected = $('input[name=Size]:checked').val();
  if(value_selected == "Half Dozen"){
    SetCookieLimit(6);
  }else{
    SetCookieLimit(12);
  }

  if(box_limit == 6 && GetTotalAmountOfCookiesInBox() > 6  ){
     ResetSelectedCookies();
  }
});



$('.custom_add_to_cart_bottom_bar .single_add_to_cart_button').on('click', function (evt) {
  if(!$(this).hasClass('disabled')){
    AddCookiesToCart();
  }
});


$('.close_upsale').on('click', function (evt) {
  CloseUpsalePopup(this);
});


$('.add_more__cookes__btn_yes').on('click', function (evt) {
  evt.stopPropagation();
  evt.preventDefault();
  selectOneDozen();
  CloseUpsalePopup($(".upsale__cokies__popup"));
});




});