import dbConnect from './db';
import Contact from '../models/Contact';
import Order from '../models/Order';
import Product from '../models/Product';
import Quote from '../models/Quote';
import Service from '../models/Service';

export async function initDatabase() {
  await dbConnect();
  const models = [
    { name: 'Contact', model: Contact },
    { name: 'Order', model: Order },
    { name: 'Product', model: Product },
    { name: 'Quote', model: Quote },
    { name: 'Service', model: Service },
  ];

  console.log('Initializing database collections...');

  for (const { name, model } of models) {
    try {
      // Check if collection exists
      const db = model.db.db;
      if (db) {
        const collections = await db.listCollections({ name: model.collection.name }).toArray();
        if (collections.length === 0) {
          console.log(`Creating collection for ${name}...`);
          await model.createCollection();
          console.log(`Collection for ${name} created successfully.`);
        } else {
          console.log(`Collection for ${name} already exists.`);
        }
      }
    } catch (error) {
      console.error(`Error initializing collection for ${name}:`, error);
    }
  }

  console.log('Database initialization complete.');
}
