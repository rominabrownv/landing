"use strict";
import { fetchProducts } from "./functions.js";
import { fetchCategories } from "./functions.js";

const renderCategories = async () => {
    try {
        const result = await fetchCategories(
            'https://data-dawm.github.io/datum/reseller/categories.xml'
        );

        if (result.success) {
            const container = document.getElementById("categories");

            container.innerHTML = `
                <option value="" disabled selected>
                    Seleccione una categoría
                </option>
            `;
            const categoriesXML = result.body;
            const categories = categoriesXML.getElementsByTagName("category");
            for (let category of categories) {
                let categoryHTML = `<option value="[ID]">[NAME]</option>`;
                const id = category.getElementsByTagName("id")[0].textContent;
                const name = category.getElementsByTagName("name")[0].textContent;

                categoryHTML = categoryHTML.replace("[ID]", id);
                categoryHTML = categoryHTML.replace("[NAME]", name);

                container.innerHTML += categoryHTML;
            }
        } else {
            alert(result.message);
        }
    } catch (error) {
        alert(error.message || error);
    }
};

let renderProducts = () => {
    fetchProducts('https://gist.githubusercontent.com/Christian777-Ing/d7c3ff807b067a73e2f0fd5dba99820d/raw/7fee14248496f2964d8a10c05d7182e747463d63/menu.json')
        .then(result => {
            if (result.success) {
                let container = document.getElementById("products-container");
                container.innerHTML = '';
                let products = result.body.slice(0, 6);

                products.forEach(product => {
                    let productHTML = `
   <div class="space-y-4 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow">
       <img
           class="w-full h-40 bg-gray-300 dark:bg-gray-700 rounded-lg object-cover transition-transform duration-300 hover:scale-[1.03]"
           src="[PRODUCT.IMGURL]" alt="[PRODUCT.TITLE]">
       <h3
           class="h-6 text-xl font-semibold tracking-tight text-gray-900 dark:text-white hover:text-black-600 dark:hover:text-white-400">
           $[PRODUCT.PRICE]
       </h3>

       <div class="h-5 rounded w-full">[PRODUCT.TITLE]</div>
           <div class="space-y-2">
               <a href="[PRODUCT.PRODUCTURL]" target="_blank" rel="noopener noreferrer"
               class="text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 w-full inline-block">
                   Ordenar Ahora
               </a>
               <div class="hidden"><span class="1">[PRODUCT.CATEGORY_ID]</span></div>
           </div>
       </div>
   </div>`;

                    productHTML = productHTML.replaceAll("[PRODUCT.TITLE]", product.title.length > 20 ? product.title.substring(0, 20) + "..." : product.title);
                    productHTML = productHTML.replaceAll("[PRODUCT.IMGURL]", product.imgUrl);
                    productHTML = productHTML.replaceAll("[PRODUCT.PRICE]", product.price);
                    container.innerHTML += productHTML;
                })
            }
        })
};

const showToast = () => {
    const toast = document.getElementById("toast-interactive");
    if (toast) {
        toast.classList.add("md:block");
    }
};
const showVideo = () => {
    const demo = document.getElementById("Promociones_b");
    if (demo) {
        demo.addEventListener("click", () => {
            window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
        });
    }
};

(() => {
    renderProducts();
    renderCategories();
    showToast();
    showVideo();
})();


