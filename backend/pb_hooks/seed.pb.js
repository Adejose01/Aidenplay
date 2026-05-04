// ============================================================
// AIDEN PLAY - Script de Inicialización de Base de Datos
// ============================================================
// Este hook se ejecuta automáticamente cuando PocketBase inicia.
// Verifica si las colecciones y datos semilla ya existen antes
// de intentar crearlos, haciéndolo idempotente (seguro de
// ejecutar múltiples veces).
// ============================================================

onAfterBootstrap((e) => {
    console.log("🎮 [Aiden Play] Verificando esquema de base de datos...");

    // ─────────────────────────────────────────────
    // 1. CREAR COLECCIÓN: products
    // ─────────────────────────────────────────────
    try {
        $app.dao().findCollectionByNameOrId("products");
        console.log("✅ Colección 'products' ya existe.");
    } catch (err) {
        console.log("📦 Creando colección 'products'...");

        const collection = new Collection({
            name: "products",
            type: "base",
            schema: [
                {
                    name: "title",
                    type: "text",
                    required: true,
                    options: { min: 1, max: 200 }
                },
                {
                    name: "description",
                    type: "text",
                    required: false,
                    options: { max: 2000 }
                },
                {
                    name: "category",
                    type: "select",
                    required: true,
                    options: {
                        maxSelect: 1,
                        values: ["PS4", "PS5", "PS_PLUS", "STREAMING"]
                    }
                },
                {
                    name: "account_type",
                    type: "select",
                    required: true,
                    options: {
                        maxSelect: 1,
                        values: ["Primaria", "Secundaria", "Suscripción"]
                    }
                },
                {
                    name: "price_ar",
                    type: "number",
                    required: true,
                    options: { min: 0 }
                },
                {
                    name: "price_rd",
                    type: "number",
                    required: true,
                    options: { min: 0 }
                },
                {
                    name: "cover_image",
                    type: "file",
                    required: false,
                    options: {
                        maxSelect: 1,
                        maxSize: 5242880,
                        mimeTypes: [
                            "image/jpeg",
                            "image/png",
                            "image/svg+xml",
                            "image/gif",
                            "image/webp"
                        ],
                        thumbs: ["200x200", "400x300", "800x600"],
                        protected: false
                    }
                },
                {
                    name: "is_featured",
                    type: "bool",
                    required: false
                },
                {
                    name: "is_active",
                    type: "bool",
                    required: false
                }
            ],
            indexes: [
                "CREATE INDEX idx_products_category ON products (category)",
                "CREATE INDEX idx_products_is_featured ON products (is_featured)",
                "CREATE INDEX idx_products_is_active ON products (is_active)"
            ],
            // Reglas de API:
            // "" (cadena vacía) = acceso público
            // null = solo administradores
            listRule: "",
            viewRule: "",
            createRule: null,
            updateRule: null,
            deleteRule: null
        });

        $app.dao().saveCollection(collection);
        console.log("✅ Colección 'products' creada exitosamente.");
    }

    // ─────────────────────────────────────────────
    // 2. CREAR COLECCIÓN: site_settings
    // ─────────────────────────────────────────────
    try {
        $app.dao().findCollectionByNameOrId("site_settings");
        console.log("✅ Colección 'site_settings' ya existe.");
    } catch (err) {
        console.log("⚙️  Creando colección 'site_settings'...");

        const collection = new Collection({
            name: "site_settings",
            type: "base",
            schema: [
                {
                    name: "hero_title_line1",
                    type: "text",
                    required: false,
                    options: { max: 100 }
                },
                {
                    name: "hero_title_line2",
                    type: "text",
                    required: false,
                    options: { max: 100 }
                },
                {
                    name: "hero_subtitle",
                    type: "text",
                    required: false,
                    options: { max: 500 }
                },
                {
                    name: "hero_badge_text",
                    type: "text",
                    required: false,
                    options: { max: 50 }
                }
            ],
            indexes: [],
            listRule: "",
            viewRule: "",
            createRule: null,
            updateRule: null,
            deleteRule: null
        });

        $app.dao().saveCollection(collection);
        console.log("✅ Colección 'site_settings' creada exitosamente.");
    }

    // ─────────────────────────────────────────────
    // 3. DATOS SEMILLA: site_settings
    // ─────────────────────────────────────────────
    try {
        const settingsCollection = $app.dao().findCollectionByNameOrId("site_settings");
        const existingRecords = $app.dao().findRecordsByFilter(
            settingsCollection.id,
            "id != ''",
            "",
            1,
            0
        );

        if (existingRecords.length === 0) {
            console.log("🌱 Insertando datos semilla en 'site_settings'...");

            const record = new Record(settingsCollection, {
                hero_title_line1: "EL MEJOR CATÁLOGO",
                hero_title_line2: "DIGITAL PS4 & PS5",
                hero_subtitle: "Servicio rápido y confiable. Encuentra los últimos lanzamientos, cuentas primarias/secundarias al mejor precio en Pesos Argentinos y Dominicanos.",
                hero_badge_text: "🔥 Ofertas Semanales"
            });

            $app.dao().saveRecord(record);
            console.log("✅ Datos semilla de 'site_settings' insertados.");
        } else {
            console.log("✅ 'site_settings' ya contiene datos.");
        }
    } catch (err) {
        console.log("⚠️  Error al insertar datos semilla de site_settings:", err);
    }

    // ─────────────────────────────────────────────
    // 4. DATOS SEMILLA: products (Catálogo inicial)
    // ─────────────────────────────────────────────
    try {
        const productsCollection = $app.dao().findCollectionByNameOrId("products");
        const existingProducts = $app.dao().findRecordsByFilter(
            productsCollection.id,
            "id != ''",
            "",
            1,
            0
        );

        if (existingProducts.length === 0) {
            console.log("🌱 Insertando catálogo de productos inicial...");

            const seedProducts = [
                // ── STREAMING ──
                {
                    title: "Netflix Premium",
                    description: "Suscripción Mensual - 4K UHD. 1 Pantalla Extra disponible.",
                    category: "STREAMING",
                    account_type: "Suscripción",
                    price_ar: 4500,
                    price_rd: 350,
                    is_featured: true,
                    is_active: true
                },
                {
                    title: "Spotify Premium",
                    description: "Música sin anuncios - Cuenta Individual. 1 Mes.",
                    category: "STREAMING",
                    account_type: "Suscripción",
                    price_ar: 3000,
                    price_rd: 250,
                    is_featured: true,
                    is_active: true
                },
                {
                    title: "Max Platino",
                    description: "Series y Películas 4K - 1 Pantalla. 1 Mes.",
                    category: "STREAMING",
                    account_type: "Suscripción",
                    price_ar: 3800,
                    price_rd: 300,
                    is_featured: true,
                    is_active: true
                },
                {
                    title: "Prime Video",
                    description: "Suscripción Mensual Total. Cuenta Completa.",
                    category: "STREAMING",
                    account_type: "Suscripción",
                    price_ar: 4000,
                    price_rd: 320,
                    is_featured: true,
                    is_active: true
                },
                // ── PS5 ──
                {
                    title: "GTA V - Grand Theft Auto V",
                    description: "Versión PS5 Enhanced. Gráficos mejorados y modo rendimiento.",
                    category: "PS5",
                    account_type: "Primaria",
                    price_ar: 8500,
                    price_rd: 700,
                    is_featured: true,
                    is_active: true
                },
                {
                    title: "God of War Ragnarök",
                    description: "La épica continuación de Kratos y Atreus. Edición Estándar.",
                    category: "PS5",
                    account_type: "Primaria",
                    price_ar: 12000,
                    price_rd: 950,
                    is_featured: true,
                    is_active: true
                },
                {
                    title: "Spider-Man 2",
                    description: "Aventura de mundo abierto con Miles y Peter. Exclusivo PS5.",
                    category: "PS5",
                    account_type: "Secundaria",
                    price_ar: 9500,
                    price_rd: 780,
                    is_featured: false,
                    is_active: true
                },
                // ── PS4 ──
                {
                    title: "The Last of Us Part II",
                    description: "Obra maestra de Naughty Dog. Edición Estándar.",
                    category: "PS4",
                    account_type: "Primaria",
                    price_ar: 5500,
                    price_rd: 450,
                    is_featured: false,
                    is_active: true
                },
                {
                    title: "FIFA 24",
                    description: "La última entrega de EA Sports FIFA. Edición Estándar.",
                    category: "PS4",
                    account_type: "Secundaria",
                    price_ar: 6000,
                    price_rd: 500,
                    is_featured: true,
                    is_active: true
                },
                // ── PS PLUS ──
                {
                    title: "PS Plus Essential - 3 Meses",
                    description: "Juega en línea, juegos gratuitos mensuales y descuentos exclusivos.",
                    category: "PS_PLUS",
                    account_type: "Suscripción",
                    price_ar: 7000,
                    price_rd: 580,
                    is_featured: true,
                    is_active: true
                },
                {
                    title: "PS Plus Extra - 1 Mes",
                    description: "Todo lo de Essential + catálogo de cientos de juegos PS4 y PS5.",
                    category: "PS_PLUS",
                    account_type: "Suscripción",
                    price_ar: 5000,
                    price_rd: 400,
                    is_featured: false,
                    is_active: true
                }
            ];

            for (const product of seedProducts) {
                const record = new Record(productsCollection, product);
                $app.dao().saveRecord(record);
            }

            console.log(`✅ ${seedProducts.length} productos insertados exitosamente.`);
        } else {
            console.log("✅ 'products' ya contiene datos.");
        }
    } catch (err) {
        console.log("⚠️  Error al insertar datos semilla de products:", err);
    }

    console.log("🎮 [Aiden Play] Inicialización completada.");
});
