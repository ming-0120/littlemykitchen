const params = new URLSearchParams(window.location.search);
var menu_nm = params.get('menu_nm').replaceAll(' ', '');
var api_key = '3271e593e3a2420ab665'
url = `http://openapi.foodsafetykorea.go.kr/api/${api_key}/COOKRCP01/json/1/1/RCP_NM=${menu_nm}`

window.onload = function () {

  $("#header").load('partialPage/_header.html', function () {
    $(".menu").css('display', 'none');
    $(".logo").css("margin", "auto");
  });
  $("#footer").load('partialPage/_footer.html');
  $.ajax({
    url: url,
    type: "get",
    cache: false,
    success: function (data, status) {
      (status == "success") && showMenu(data);
    },
  });
}
var cart = [];
function showMenu(data) {
  const menuRecipe = data.COOKRCP01.row;
  let recipeData = "";
  let ingredients = menuRecipe[0].RCP_PARTS_DTLS.slice(3);
  $("#recipeName").text(menuRecipe[0].RCP_NM);
  const ingredientArray = ingredients.split(','); 
  let html = '';
  ingredientArray.forEach(item => {
    html += `
        <div class="ingredient-item">
          <span class="ingredient-name">${item.trim()}</span>
          <button class="add-to-cart-btn">🛒 담기</button>
        </div>
      `;
  });
  
  $("#recipeIngredients").html(html);
  $("#recipeImg").attr("src", menuRecipe[0].ATT_FILE_NO_MK);

  menuRecipe.forEach(item => {
    Object.keys(item)
      .filter(key => key.startsWith("MANUAL") && !key.startsWith("MANUAL_"))
      .sort((a, b) => {
        const numA = parseInt(a.replace("MANUAL", ""));
        const numB = parseInt(b.replace("MANUAL", ""));
        return numA - numB;
      })
      .forEach(key => {
        if (item[key].trim() !== '') {
          recipeData += item[key].trim() + '<br><br>';
        }
      });
  });
  $("#recipeSteps").html(recipeData);
  $(".loading__container").css('display', 'none');

  const buttons = document.querySelectorAll('.add-to-cart-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const ingredientName = btn.previousElementSibling.textContent;
      if (!cart.includes(ingredientName)) {
        cart.push(ingredientName);
        $(".shop-btn").css('display', 'inline');
      }
      const alertBox = $("#cartAlert");
      alertBox.css('opacity', '1');

      setTimeout(() => {
        alertBox.css('opacity', '0');
      }, 1500);
    });
  });
}
  

$(".shop-btn").click(function () {
    const query = cart.map(encodeURIComponent).join(',');
    location.href = `cart.html?items=${query}`;  
})