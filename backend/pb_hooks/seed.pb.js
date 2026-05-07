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

    // 0. ASEGURAR ADMINISTRADOR
    try {
        const admin = new Admin();
        admin.email = "admin@aidenplay.com";
        admin.setPassword("admin12345678"); // 10 chars is better
        $app.dao().saveAdmin(admin);
    } catch (err) {}

    // 1. MIGRACIÓN DE PRODUCTOS (Fijar price_usd si es 0)
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

    // 2. FIJAR TASAS (solo si están vacías — NO sobreescribir valores del admin)
    try {
        const records = $app.dao().findRecordsByFilter("site_settings", "id != ''", "", 1);
        if (records.length > 0) {
            const rec = records[0];
            const currentArs = rec.getFloat("exchange_rate_ars");
            const currentRd = rec.getFloat("exchange_rate_rd");
            if (!currentArs || currentArs === 0) rec.set("exchange_rate_ars", 1451);
            if (!currentRd || currentRd === 0) rec.set("exchange_rate_rd", 62);
            $app.dao().saveRecord(rec);
        }
    } catch (err) {}

    console.log("🎮 [Aiden Play] Inicialización completada.");
});
