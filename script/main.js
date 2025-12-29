$(document).ready(function(){
  $("#header").load('./partialPage/_header.html');  
  $("#footer").load('./partialPage/_footer.html');
});

$(document).on("click", "#searchRecipe", function() {
$("#searchModalBody").load('./searchRecipe.html' ,function(){
    $("#searchModal").fadeIn(200).css('display','flex');
  });
  $(document).on("click", ".close_btn", function() {
  $("#searchModal").fadeOut(200);
});
  $(document).on("click", "#searchModal", function(e) {
    if ($(e.target).is("#searchModal")) {
      $("#searchModal").fadeOut(200);
    }
  });
});

// 레시피 ai 검색
$("#chatbot_icon").click(function(e){
      $("#callAiModalBody").load('./chatbot.html' ,function(){
        $("#callAiModal").fadeIn(200).css('display','flex');
     });
    $(document).on("click", ".close_btn", function() {
    $("#callAiModal").fadeOut(200);
 });

    // ✅ 레시피 ai 검색 모달 바깥 클릭 시 닫기
    $(document).on("click", "#callAiModal", function(e) {
      if ($(e.target).is("#callAiModal")) {
        $("#callAiModal").fadeOut(200);
      }
    });
  })
$(".logo").click(function(){
  location.href = './index.html';
})

window.addEventListener('scroll',function(){
    if (window.scrollY > 0) {
          document.getElementById('top').classList.add('scroll_top');
    } else {
      document.getElementById('top').classList.remove('scroll_top');
    }           
})
