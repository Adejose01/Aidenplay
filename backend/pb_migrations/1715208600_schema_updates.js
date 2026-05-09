migrate((db) => {
  const dao = new Dao(db);

  // 1. Actualizar colección 'products' para incluir la categoría 'NINTENDO'
  try {
    const products = dao.findCollectionByNameOrId("products");
    const categoryField = products.schema.getFieldByName("category");
    
    if (categoryField && !categoryField.options.values.includes("NINTENDO")) {
      categoryField.options.values = [...categoryField.options.values, "NINTENDO"];
      dao.saveCollection(products);
    }
  } catch (err) {
    // Si la colección no existe aún, se creará mediante el import de pb_schema.json o manualmente
  }

  // 2. Actualizar colección 'site_settings' con los nuevos campos regionales
  try {
    const settings = dao.findCollectionByNameOrId("site_settings");
    
    // Campo whatsapp_ar
    if (!settings.schema.getFieldByName("whatsapp_ar")) {
      settings.schema.addField(new SchemaField({
        name: "whatsapp_ar",
        type: "text",
      }));
    }

    // Campo whatsapp_rd
    if (!settings.schema.getFieldByName("whatsapp_rd")) {
      settings.schema.addField(new SchemaField({
        name: "whatsapp_rd",
        type: "text",
      }));
    }

    // Campo primary_region
    if (!settings.schema.getFieldByName("primary_region")) {
      settings.schema.addField(new SchemaField({
        name: "primary_region",
        type: "select",
        options: {
          maxSelect: 1,
          values: ["AR", "RD"]
        }
      }));
    }

    dao.saveCollection(settings);

    // Crear registro por defecto si no hay ninguno
    const total = dao.findRecordsByFilter("site_settings", "1=1", "", 1);
    if (total.length === 0) {
      const record = new Record(settings);
      record.set("hero_title_line1", "EL MEJOR CATÁLOGO");
      record.set("hero_title_line2", "DIGITAL PS4 & PS5");
      record.set("hero_subtitle", "Servicio rápido y confiable para tus juegos favoritos.");
      record.set("exchange_rate_ars", 1415);
      record.set("exchange_rate_rd", 58);
      record.set("primary_region", "RD");
      dao.saveRecord(record);
    }
  } catch (err) {
    // Silenciar error si la colección no existe
  }
}, (db) => {
  // Revertir cambios no es estrictamente necesario para este despliegue
})
