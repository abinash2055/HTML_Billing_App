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
    productBoxHtmlStr += `<div class="product">
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
