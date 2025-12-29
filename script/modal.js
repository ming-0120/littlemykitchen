var dataSource = []; // 전체 데이터
let currentPage = 1;
const pageSize = 9; // 한 페이지당 9개
var api_key = '3271e593e3a2420ab665';

function searchMenu() {
  var search_val = $("#searchInput")[0].value.trim();
  if (search_val == '') {
    alert("조회하실 식재료를 입력해 주세요.");
    $("#searchInput").focus();
    return;
  }
  url = `http://openapi.foodsafetykorea.go.kr/api/${api_key}/COOKRCP01/json/1/30/RCP_NM=${search_val}&RCP_PARTS_DTLS=${search_val}`
  $.ajax({
    url: url,
    type: "GET",
    cache: false,
    success: function (data, status) {
      (status == "success") && parseRecipe(data);
    },
  });
}

function parseRecipe(data) {
  dataCnt = data.COOKRCP01.total_count;
  dataSource = data.COOKRCP01.row; // 전체 데이터 저장
  currentPage = 1; // 페이지 초기화
  renderTable();
}
// 테이블 렌더링
function renderTable() {
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  let table = [];
  if (dataCnt > 0) {
    const pageData = dataSource.slice(start, end);
    for (let i = 0; i < pageData.length; i += 3) {
      table.push('<tr>');
      for (let j = i; j < i + 3 && j < pageData.length; j++) {
        const item = pageData[j];
        table.push(`
          <td class="recipe-cell">
            <div class="img-wrap">
              <img src="${item.ATT_FILE_NO_MK}" alt="이미지" onclick="openPage('${item.RCP_NM}')"/>
            </div>
            <div class="recipe-name">${item.RCP_NM}</div>
          </td>
        `);
      }
      table.push('</tr>');
    }
    $('#recipeList').html('<table>' + table.join('') + '</table>');
    renderPager();
  } else {
    table.push(`
          <td class="recipe-cell">
            레시피가 조회되지 않습니다. 다시 검색해 주세요 🍳        
          </td>
        `);
    $('#recipeList').html('<table>' + table.join('') + '</table>');
  }
}
// 페이지 버튼 렌더링
function renderPager() {
  const totalPage = Math.ceil(dataSource.length / pageSize);
  let html = '';
  for (let i = 1; i <= totalPage; i++) {
    html += `<button class="page-btn" ${i === currentPage ? 'disabled' : ''} onclick="gotoPage(${i})">${i}</button>`;
  }
  $('#pager').html(html);
}
// 페이지 이동
function gotoPage(page) {
  currentPage = page;
  renderTable();
  renderPager();
}
function openPage(menu_nm) {
  location.href = `detail.html?menu_nm=${menu_nm}`;
}
$(document).ready(function () {
  $("#header").load('./partialPage/_header.html');
  $("#footer").load('./partialPage/_footer.html');
  $('#searchBtn').click(searchMenu);
  $("#searchInput")[0].addEventListener("keypress", (e) => {
    if (e.key === "Enter") searchMenu();
  });
  window.addEventListener('scroll', function () {
    if (window.scrollY > 0) document.getElementById('top').classList.add('scroll_top');
    else document.getElementById('top').classList.remove('scroll_top');
  });
});