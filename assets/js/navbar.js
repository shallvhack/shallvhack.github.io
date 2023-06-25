"use strict";

console.log("Yeah!!!!!!!");
(function ($) {
  jQuery(document).ready(function () {

    // change navbar style on scroll
    // ==================================================
    // When the user scrolls down 80px from the top of the document, resize the navbar's padding and the logo's font size
    // $.onscroll = function() {scrollFunction()};
    $(document).scroll(function () {
      if ($(document).scrollTop() > 40) {
        $('#top-navbar').removeClass('initial-navbar');
        $('#top-navbar').addClass('final-navbar');
        document.getElementById("logo").src = "./logo_ShallvHack_final_v1-02.png";
        document.getElementById("logo-anchor").href = "./logo_ShallvHack_final_v1-02.png";
      }
      else{
        $('#top-navbar').removeClass('final-navbar');
        $('#top-navbar').addClass('initial-navbar');
        document.getElementById("logo").src = "./logo_ShallvHack_final_v1-01.png";
        document.getElementById("logo-anchor").href = "./logo_ShallvHack_final_v1-01.png";
      }
    });
  });

})(jQuery);


// (function ($) {
//     jQuery(document).ready(function () {
  
//       // change navbar style on scroll
//       // ==================================================
//       // When the user scrolls down 80px from the top of the document, resize the navbar's padding and the logo's font size
//       // $.onscroll = function() {scrollFunction()};
//       $(document).scroll(function () {
//         if ($(document).scrollTop() > 90) {
//             console.log("working");
//             document.getElementById("about-header").style.animationPlayState = "running";
//         }
//         else{
//             document.getElementById("about-header").style.animationPlayState = "paused";
//         }
//       });
//     });
  
//   })(jQuery);
  
  
  







