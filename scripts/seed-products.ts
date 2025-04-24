// scripts/seed-products.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as csv from 'csvtojson';
import { Product } from '../src/product/product.entity';
import * as dotenv from 'dotenv';
import { CartItem } from 'src/cart/cartItem.entity';
import { User } from 'src/user/user.entity';
import { Cart } from 'src/cart/cart.entity';

dotenv.config();
async function run() {
  // 1) bootstrap a DataSource (make sure it points at your dev DB)
  const ds = new DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    entities: [Product, CartItem, User, Cart],
    synchronize: false,
  });
  await ds.initialize();

  // 2) parse the CSV
  const rows = await csv({
    trim: true,
    ignoreEmpty: true,
  }).fromFile('/home/charly/varios/backend-gioia/scripts/files/products.csv');

  // 3) map/validate fields
  const products = rows.map((r) => {
    // replace single quotes with double quotes so JSON.parse will work
    const rawCat = r.category.trim();
    let categoryArr: string[];
    try {
      categoryArr = JSON.parse(rawCat);
    } catch {
      categoryArr = JSON.parse(rawCat.replace(/'/g, '"'));
    }

    return {
      name: r.name,
      sku: r.sku,
      category: categoryArr,
      description: r.description,
      presentation: r.presentation,
      aplication: r.aplication,
      imageUrl: r.imageUrl || null,
      wholeSaler: r.wholeSaler,
      stock: parseInt(r.stock, 10),
      isVisible: r.isVisible === 'true' || r.isVisible === '1',
      price: parseFloat(r.price),
    };
  });

  // 4) save them all in one shot
  await ds.getRepository(Product).save(products);

  console.log(`✅ Seeded ${products.length} products`);
  await ds.destroy();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
