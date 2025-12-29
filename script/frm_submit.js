$(document).ready(function(){    
    $("#header").load('./partialPage/_header.html',function(){
        $(".menu").css('display','none');
        $(".logo").css("margin", "auto");  
  });
    const params = new URLSearchParams(window.location.search);
    const order_name = params.get('name'); 
    const phone_num = params.get('num');   
    const id = params.get('mail_id');
    const domain = params.get('mail_addr');   
    const addr_num = params.get('addr_num'); 
    const addr = params.get('addr');    
    const addr_detail = params.get('addr_detail'); 
    const request = params.get('request');  
    
    $("#name").html(order_name);
    $("#phone").html(phone_num);
    $("#email").html(`${id}@${domain}`);
    $("#postcode").html(addr_num);
    $("#address").html(addr);
    $("#address_detail").html(addr_detail);
    $("#notes").html(request);
})

window.addEventListener('popstate', function (event) {
    const leave = confirm('이전페이지로 돌아갈 수 없습니다. 홈 화면으로 이동하시겠습니까?');
    if (leave) {
        this.location.href='./index.html';
    }
});

document.getElementById('printBtn').addEventListener('click', function(){
     location.href = './index.html'
});
