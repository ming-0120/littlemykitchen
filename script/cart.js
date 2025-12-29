const params = new URLSearchParams(window.location.search);
const items = params.get('items');
const cartArray = items ? items.split(',').map(decodeURIComponent) : [];

$(document).ready(function(){
  $("#header").load('./partialPage/_header.html',function(){
    $(".menu").css('display','none');
    $(".logo").css("margin", "auto");  
  });
  $("#footer").load('./partialPage/_footer.html'); 
});

window.onload = function(){   
    document.getElementById("orderFormData").reset();
    let recipeData = "";
        if(cartArray.length > 0){
            for(i = 0; i < cartArray.length; i ++){
                const cost = Math.floor(Math.random() * 10 + 1) * 1000;    
                recipeData += `
                <div class="product">
                    <label style="display: flex; cursor:pointer; gap:8px;">
                        <input type="checkbox" value="${cartArray[i]}" data-cost="${cost}">
                        <span>${cartArray[i]} - ${cost.toLocaleString()}원</span>
                    </label>
                </div>
                `
            }
        } else{
            recipeData += `
            <div class="product">
            <div><p>장바구니가 비어있습니다. 장 보러 떠나볼까요 ? 🛫</p>       
            </div>
            `
            $("#addToCartBtn").text("홈으로");
        }        
        $("#productList").html(recipeData);
}
function calcSelectedTotal() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
  let total = 0;

  checkboxes.forEach(cb => {
    total += Number(cb.dataset.cost);  
  });
  return total;
}

document.addEventListener('change', e => {
  if (e.target.type === 'checkbox') {
    const total = calcSelectedTotal();
    allCost = total.toLocaleString() + '원';
  }
});

$("#addToCartBtn").click(function(){
    let cartItems = [];  
    $(".product input[type='checkbox']:checked").each(function(){
        cartItems.push($(this).val());
    });
    if(cartItems.length > 0){
        let formHTML = "";
        $(".cart").css('display','block');
        cartItems.forEach((item, i)=>{
            formHTML += `<div>${item}</div>`;
        });
        $("#cartList").html(formHTML);
        $("#cartTotal").text(`총 ${cartItems.length}개 품목 | ${allCost}`);

        $("#orderForm").slideDown(400, function () {
            $(".cart-actions").css('display','none');
            $('html, body').animate({
              scrollTop: $("#orderForm").offset().top
            }, 600);
          });
    }  else if( $("#addToCartBtn").text() =='홈으로'){
        location.href = './index.html';
    }
    else{
        alert("상품을 선택하세요!");
        return;
    }
});
document.getElementById('order_phone').addEventListener('input', function(e) {
  let value = e.target.value.replace(/[^0-9]/g, '');
  let result = '';

  if (value.length < 4) {
    result = value;
  } else if (value.length < 8) {
    result = value.substr(0, 3) + '-' + value.substr(3);
  } else {
    result = value.substr(0, 3) + '-' + value.substr(3, 4) + '-' + value.substr(7);
  }
  e.target.value = result;
});

$('#mail_option').on('change', function() {
    const val = $(this)[0].value;
    if(val == ""){
        $("#mail_addr").removeAttr('readonly');
        $("#mail_addr")[0].value = '';
    } else{
        $('#mail_addr').prop('readonly', true);
        $("#mail_addr")[0].value = val;
    }
});
$("#order_ingredients").click(function(){
    var order_form = document.forms['orderFormData']
    if($("#order_name").val() == ''){
        alert("주문자 성함을 입력해 주세요.");
        $("#order_name").focus();
        return;
    }
    if($("#order_phone").val() == ''){
        alert("주문자 전화번호를 입력해 주세요.");
        $("#order_phone").focus();
        return;
    }
    let id = $("#mail_id").val();
    let domain = $("#mail_addr").val();
    let email = `${id}@${domain}`;
    const regex = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;

    if(!regex.test(email)){
        alert("유효한 이메일 형식이 아닙니다. 다시 입력해 주세요."); 
        $("#mail_id").focus();
        return;
    }
    
    if($("#addr_num").val() == ''){
        alert("주문자 우편번호를 입력해 주세요.");
        $("#addr_num").focus();
        return;
    }
    if($("#order_msg").val() == ''){
        $("#order_msg").val("빠른 배송 감사합니다.");
    }
    confirm('주문하시겠습니까?') && order_form.submit();
});

function input_addr() {
        new daum.Postcode({
            oncomplete: function(data) {
                var addr = ''; 
                var extraAddr = ''; 

                if (data.userSelectedType === 'R') {
                    addr = data.roadAddress;
                } else { 
                    addr = data.jibunAddress;
                }
                if(data.userSelectedType === 'R'){
                    if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
                        extraAddr += data.bname;
                    }
                    if(data.buildingName !== '' && data.apartment === 'Y'){
                        extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                    }                    
                }
                document.getElementById('addr_num').value = data.zonecode;
                document.getElementById("addr").value = addr;
                document.getElementById("addr_detail").focus();
            }
        }).open();
    }
