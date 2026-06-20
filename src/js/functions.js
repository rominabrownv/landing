'use strict';

let fetchCategories = async (url) => {

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        let text = await response.text()

        const parser = new DOMParser();
        const data = parser.parseFromString(text, "application/xml");

        return {
            success: true,
            body: data
        };

    } catch (error) {

        return {
            success: false,
            body: error.message
        };

    }
}

let fetchProducts =  (url) => {

    return fetch(url)
        .then(response => {

            // Verificar si la respuesta no es exitosa
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            return response.json();

        })
        .then(data => {

            // Respuesta exitosa
            return {
                "success": true,
                "body": data
            };

        })
        .catch(error => {

            // Error en la solicitud
            return {
                "success": false,
                "body": error.message
            };

        });
}

// POST genérico para suscribirse al newsletter
let subscribeNewsletter = async (email) => {
    try {
        const response = await fetch(
            "https://landing-6e41f-default-rtdb.firebaseio.com/newsletter-subscribers.json",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    fecha_suscripcion: new Date().toISOString(),
                    estado: "activo"
                })
            }
        );

        if (!response.ok) {
            throw new Error("No se pudo suscribir al newsletter.");
        }

        const data = await response.json();

        return {
            success: true,
            message: "¡Gracias por suscribirte! Recibirás nuestras ofertas especiales.",
            id: data.name
        };

    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

export { fetchCategories, fetchProducts, subscribeNewsletter }
