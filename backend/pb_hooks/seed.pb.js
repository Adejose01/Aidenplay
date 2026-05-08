// ============================================================
// AIDEN PLAY - Script de Inicialización Robusto
// ============================================================

onAfterBootstrap((e) => {
    console.log("🎮 [Aiden Play] Verificando base de datos...");

    // 1. ASEGURAR ADMINISTRADOR (Solo si no existe)
    try {
        const adminEmail = "admin@aidenplay.com";
        try {
            // Intentar buscar si ya existe
            $app.dao().findAdminByEmail(adminEmail);
            console.log("✅ Admin ya existe, omitiendo creación.");
        } catch (err) {
            // Si no existe, lo creamos con la contraseña por defecto
            const admin = new Admin();
            admin.email = adminEmail;
            admin.setPassword("AidenPlay2026!");
            $app.dao().saveAdmin(admin);
            console.log("👤 Admin creado exitosamente: " + adminEmail);
        }
    } catch (err) {
        console.log("❌ Error en admin setup: " + err);
    }

    // 2. MIGRACIÓN DE PRODUCTOS (Asegurar que tengan USD)
    try {
        const products = $app.dao().findRecordsByFilter("products", "price_usd = 0 || price_usd = null", "", 100);
        for (const p of products) {
            const priceAr = p.getFloat("price_ar") || 0;
            if (priceAr > 0) {
                p.set("price_usd", Math.round((priceAr / 1415) * 100) / 100);
                $app.dao().saveRecord(p);
            }
        }
    } catch (err) {}

    console.log("🎮 [Aiden Play] Sistema listo.");
});
