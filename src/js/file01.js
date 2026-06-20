"use strict";
import { fetchProducts } from "./functions.js";
import { fetchCategories } from "./functions.js";
import { saveVote } from "./firebase.js";

const renderCategories = async () => {
    try {
        const result = await fetchCategories(
            'https://gist.githubusercontent.com/Christian777-Ing/da5029ca64e6d3a803005d78d0a0aa1e/raw/e7121fcdd36064f4d15e7fcc7da49bb9617dd1cd/categorias.xml'
        );

        if (result.success) {
            const container = document.getElementById("categories");

            container.innerHTML = `
                <option value="" selected>
                    Todas las categorías
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

            /* === SOLUCIÓN: Escuchar el cambio de categoría === */
            container.addEventListener("change", (e) => {
                const categoriaSeleccionada = e.target.value;
                renderProducts(categoriaSeleccionada);
            });

        } else {
            alert(result.message);
        }
    } catch (error) {
        alert(error.message || error);
    }
};

let renderProducts = (idCategoria = "") => {
    fetchProducts('https://gist.githubusercontent.com/Christian777-Ing/d7c3ff807b067a73e2f0fd5dba99820d/raw/5dfe463d49f9086f9dccdbf70797ee7a64418c75/menu.json')
        .then(result => {
            if (result.success) {
                let container = document.getElementById("products-container");
                let selectProduct = document.getElementById("select_product");
                
                container.innerHTML = '';
                
                // Solo reiniciamos las opciones del formulario la primera vez (cuando no estamos filtrando)
                if (selectProduct && idCategoria === "") {
                    selectProduct.innerHTML = `
                        <option value="" disabled selected>Selecciona tu producto favorito</option>
                    `;
                }

                let allProducts = result.body;
                let productsToDisplay = allProducts;

                // 1. Lógica de Filtrado para la pantalla
                if (idCategoria !== "") {
                    productsToDisplay = allProducts.filter(product => product.category_id === parseInt(idCategoria));
                } else {
                    productsToDisplay = allProducts.slice(0, 6);
                }

                // 2. Llenar el Select de Votación 
                if (selectProduct && idCategoria === "") {
                    allProducts.forEach(product => {
                        let option = document.createElement("option");
                        option.value = product.item_id; // Guardamos el ID único (ej: HAM-001)
                        option.textContent = product.title; // Mostramos el nombre (ej: La Clásica)
                        selectProduct.appendChild(option);
                    });
                }

                if (productsToDisplay.length === 0) {
                    container.innerHTML = `<p class="text-gray-500 text-center col-span-full">No hay productos disponibles en esta categoría.</p>`;
                    return;
                }

                // 3. Renderizar Tarjetas
                productsToDisplay.forEach(product => {
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
                });
            }
        });
};

const showToast = () => {
    const toast = document.getElementById("toast-interactive");
    if (toast) {
        toast.classList.remove("hidden");
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

const enableForm = () => {
    const form = document.getElementById("form_voting");
    if (!form) return;

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const selectProduct = document.getElementById("select_product");
        const productID = selectProduct.value;

        // Capturamos el valor del INPUT del nombre
        const inputName = document.getElementById("voter_name");
        const voterName = inputName ? inputName.value.trim() : "Anónimo";

        if (!productID) {
            alert("Por favor, selecciona un producto antes de votar.");
            return;
        }

        if (voterName === "") {
            alert("Por favor, ingresa tu nombre para votar.");
            return;
        }
        saveVote(productID, voterName)
            .then((result) => {
                alert(result.message);
                if (result.success) {
                    form.reset(); 
                }
            });
    });
};

(() => {
    // Funcionalidad del menú hamburguesa
    const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
    const mobileMenu = document.getElementById("mobile-menu");

    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener("click", () => {
            mobileMenu.classList.toggle("hidden");
        });

        // Cerrar menú al hacer click en un enlace
        const mobileMenuLinks = mobileMenu.querySelectorAll("a");
        mobileMenuLinks.forEach(link => {
            link.addEventListener("click", () => {
                mobileMenu.classList.add("hidden");
            });
        });
    }

    // Funcionalidad para cerrar el pop-up
    const toast = document.getElementById("toast-interactive");
    if (toast) {
        // Cerrar con la X
        const dismissButton = toast.querySelector('[data-dismiss-target="#toast-interactive"]');
        if (dismissButton) {
            dismissButton.addEventListener("click", () => {
                toast.classList.add("hidden");
            });
        }

        // Cerrar con los botones de acción
        const actionButtons = toast.querySelectorAll("[data-accion]");
        actionButtons.forEach(button => {
            button.addEventListener("click", (e) => {
                e.preventDefault();
                toast.classList.add("hidden");
            });
        });
    }

    renderProducts();
    renderCategories();
    enableForm();
    showToast();
    showVideo();
})();