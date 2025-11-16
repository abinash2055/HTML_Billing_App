const categoryContainer = document.querySelector(".category-container");
const toggleMenu = document.querySelector(".toggle-menu");

function toggleCategorySidebar() {
  categoryContainer.classList.toggle("show");
}

document.addEventListener("click", (e) => {
  if (!categoryContainer.contains(e.target) && !toggleMenu.contains(e.target)) {
    categoryContainer.classList.remove("show");
  }
});

function initBilling() {
  getAllCategory();
  getProducts("all");
  localStorage.clear();
}

window.onload = () => {
  initBilling();
};

async function getAllCategory() {
  let req = await fetch("https://dummyjson.com/products/categories");
  let response = await req.json();

  let categoryBtn = `<button type="button" class='active' onclick="getProductByCategory('all',event)">All Categories</button>`;

  response.forEach((category) => {
    categoryBtn += `<button type="button" onclick="getProductByCategory('${category.slug}',event)">${category.name}</button>`;
  });

  document.querySelector(".categories").innerHTML = categoryBtn;
}

async function getProducts(category) {
  let req, response, products;

  if (category === "all") {
    req = await fetch("https://dummyjson.com/products?limit=0");
  } else {
    req = await fetch(
      `https://dummyjson.com/products/category/${category}?limit=0`
    );
  }

  response = await req.json();
  products = response.products;
  createProductBox(products);
}

function createProductBox(products) {
  let productsWrapper = document.querySelector(".product-wrapper");
  let productBoxHtmlStr = "";

  products.forEach((singleProduct) => {
    productBoxHtmlStr += `<div class="product" data-product="${singleProduct.id}" onclick="selectProduct(${singleProduct.id}, this)">
            <div class="product-img">
              <img src="${singleProduct.thumbnail}" alt="" />
            </div>
            <div class="product-details">
              <p class="product-name">${singleProduct.title}</p>
              <span>Price: ₹${singleProduct.price}</span>
            </div>
          </div>`;
  });
  productsWrapper.innerHTML = productBoxHtmlStr;
}

function getProductByCategory(categorySlug, event) {
  getProducts(categorySlug);

  let activeCategoryBtn = document.querySelector(".categories button.active");
  activeCategoryBtn.classList.remove("active");
  event.target.classList.add("active");
}

async function searchProduct(searchQuery) {
  let req = await fetch(
    `https://dummyjson.com/products/search?q=${searchQuery}`
  );
  let response = await req.json();

  let products = response.products;
  createProductBox(products);
}

async function selectProduct(productId, productBox) {
  let req = await fetch(`https://dummyjson.com/products/${productId}`);
  let response = await req.json();

  const { id, title, price } = response;

  let selectedProducts = localStorage.getItem(`selectedProducts`);

  if (selectedProducts) {
    selectedProducts = JSON.parse(selectedProducts);
  } else {
    selectedProducts = [];
  }

  let checkData = selectedProducts.find((product) => product.id === id);

  if (!checkData) {
    selectedProducts.push({
      id,
      title,
      price,
      qty: 1,
    });
  }

  localStorage.setItem("selectedProducts", JSON.stringify(selectedProducts));
  productBox.classList.add("active");

  // Creating Billing Section

  let selectedItems = document.getElementById("selected-items");
  let tr = document.createElement("tr");

  tr.innerHTML = `
  <td>
    <p class="product-name">${title}</p>
    <span>Price: ₹${price}</span>
  </td>
  <td>
    <div class="qty-box">
      <button type="button">
        <i class="ri-subtract-line"></i>
      </button>
      <input type="text" value="1" readonly />
      <button type="button">
        <i class="ri-add-line"></i>
      </button>
    </div>
  </td>
  <td>₹${price}</td>
  <td>
    <button type="button" class="trash-bin" onclick="removeSelectedItem(${id},this)">
      <i class="ri-delete-bin-line"></i>
    </button>
  </td>
`;
  selectedItems.append(tr);
}

function removeSelectedItem(productId, deleteBtn) {
  let selectedProducts = localStorage.getItem(`selectedProducts`);
  selectedProducts = JSON.parse(selectedProducts);

  let newProductList = selectedProducts.filter(
    (product) => product.id != productId
  );
  localStorage.setItem("selectedProducts", JSON.stringify(newProductList));
  deleteBtn.closest("tr").remove();

  let productBox = document.querySelector(
    `.product[data-product="${productId}"]`
  );
  productBox.classList.remove("active");
}
