// ============================================================
// AIDEN PLAY - Script de Inicialización Robusto (V2)
// ============================================================

onAfterBootstrap((e) => {
    console.log("🎮 [Aiden Play] Verificando base de datos...");

    const dao = $app.dao();

    // 1. ASEGURAR ADMINISTRADOR
    try {
        const adminEmail = "admin@aidenplay.com";
        try {
            dao.findAdminByEmail(adminEmail);
            console.log("✅ Admin ya existe.");
        } catch (err) {
            const admin = new Admin();
            admin.email = adminEmail;
            admin.setPassword("AidenPlay2026!");
            dao.saveAdmin(admin);
            console.log("👤 Admin creado: " + adminEmail);
        }
    } catch (err) {
        console.log("❌ Error Admin: " + err);
    }

    // 2. FORZAR ACTUALIZACIÓN DE ESQUEMA (Usando DAO directamente)
    try {
        // --- Productos ---
        let products;
        try {
            products = dao.findCollectionByNameOrId("products");
            let catField = products.schema.getFieldByName("category");
            if (catField && !catField.options.values.includes("NINTENDO")) {
                catField.options.values = [...catField.options.values, "NINTENDO"];
                dao.saveCollection(products);
                console.log("✅ Categoría NINTENDO sincronizada.");
            }
        } catch (err) {
            console.log("⚠️ Colección 'products' no encontrada.");
        }

        // --- Site Settings ---
        let settings;
        try {
            settings = dao.findCollectionByNameOrId("site_settings");
            let modified = false;

            if (!settings.schema.getFieldByName("whatsapp_ar")) {
                settings.schema.addField(new SchemaField({ name: "whatsapp_ar", type: "text" }));
                modified = true;
            }
            if (!settings.schema.getFieldByName("whatsapp_rd")) {
                settings.schema.addField(new SchemaField({ name: "whatsapp_rd", type: "text" }));
                modified = true;
            }
            if (!settings.schema.getFieldByName("primary_region")) {
                settings.schema.addField(new SchemaField({ 
                    name: "primary_region", 
                    type: "select", 
                    options: { maxSelect: 1, values: ["AR", "RD"] } 
                }));
                modified = true;
            }

            if (modified) {
                dao.saveCollection(settings);
                console.log("✅ Campos regionales añadidos a site_settings.");
            }

            // Asegurar Registro Inicial
            const records = dao.findRecordsByFilter("site_settings", "1=1", "", 1);
            if (records.length === 0) {
                const record = new Record(settings);
                record.set("hero_title_line1", "EL MEJOR CATÁLOGO");
                record.set("hero_title_line2", "DIGITAL PS4 & PS5");
                record.set("exchange_rate_ars", 1415);
                record.set("exchange_rate_rd", 58);
                record.set("primary_region", "RD");
                record.set("whatsapp_rd", "18090000000"); 
                record.set("whatsapp_ar", "5491100000000");
                dao.saveRecord(record);
                console.log("✅ Registro site_settings inicial creado.");
            } else {
                const r = records[0];
                let changed = false;
                if (!r.get("primary_region")) {
                    r.set("primary_region", "RD");
                    changed = true;
                }
                // Si el número es el viejo, lo limpiamos para forzar actualización
                if (r.get("whatsapp_rd") === "584241732650") {
                    r.set("whatsapp_rd", "18090000000");
                    changed = true;
                }
                if (changed) {
                    dao.saveRecord(r);
                    console.log("✅ Configuración regional actualizada en DB.");
                }
            }
        } catch (err) {
            console.log("⚠️ Colección 'site_settings' no encontrada.");
        }
    } catch (err) {
        console.log("❌ Error Crítico Schema: " + err);
    }

    console.log("🎮 [Aiden Play] Sistema listo.");
});
