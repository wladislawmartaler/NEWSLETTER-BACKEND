import { faker, fakerDE } from '@faker-js/faker';
import { Newsletter, Subscriber } from '../src/types';
import { getClient } from '../src/db/db';
import { QueryConfig } from 'pg';

const NUMBER_SUBSCRIBERS = 4_000;

const CATEGORIES = [
  'Gaming',
  'Wissenschaft',
  'Business',
  'Finanzen',
  'Politic',
  'Sport',
  'E-Commerce',
  'Beauty',
  'Kultur & Allgemein',
  'Security & Datenschutz',
  'Bildung & Karriere',
  'Rabatte & Sonderangebote',
  'Technologie',
  'Wirtschaft & Finanzen',
  'Politik',
  'Gesundheit & Medizin',
  'Reisen & Tourismus',
  'Lifestyle & Mode',
  'Produkt-Updates',
  'Branchen-News',
  'Case Studies & Erfolgsgeschichten',
  'Community-News',
  'How-To & Tutorials',
];

function generateSubscriber(n: number): Subscriber[] {
  let subscribers: Subscriber[] = [];
  for (let i = 0; i < n; i++) {
    const firstName = fakerDE.person.firstName();
    const lastName = fakerDE.person.lastName();
    subscribers.push({
      name: firstName,
      last_name: lastName,
      email: fakerDE.internet.email({
        firstName: firstName.toLowerCase(),
        lastName: lastName.toLowerCase(),
      }),
      phone: fakerDE.phone.number({
        style: 'international',
      }),
    });
  }
  return subscribers;
}

function generateNewsletter() {
  let newsletter: Newsletter[] = [];
  const now = new Date().toISOString();

  CATEGORIES.forEach((category) => {
    newsletter.push({
      author: fakerDE.person.fullName(),
      category: category,
      content: faker.word.words(100),
      created_at: now,
      updated_at: now,
    });
  });

  return newsletter;
}

async function seed() {
  try {
    // Connect to the database
    const db = getClient();
    await db.connect();

    console.info('🔌 Connected to the Database.');

    // Generate subscribers
    const subs = generateSubscriber(NUMBER_SUBSCRIBERS);

    // Generate placeholders ($1, $2, ..., $N usw.)
    const values = subs.flatMap((s) => [s.name, s.last_name, s.email, s.phone]);
    const placeholders = subs
      .map(
        (_, i) => `($${i * 4 + 1}, $${i * 4 + 2}, $${i * 4 + 3}, $${i * 4 + 4})`
      )
      .join(',');
    //@ * 4 because we have 4 values per subscriber and we need to skip to the next subscriber

    // Build the bulk insert query
    const query: QueryConfig = {
      text: `INSERT INTO subscriber (name, last_name, email, phone) VALUES ${placeholders}`,
      values,
    };

    // Execute the query
    await db.query(query);

    // Now, let's seed the newsletter table
    const news = generateNewsletter();
    const newsValues = news.flatMap((n) => [
      n.author,
      n.category,
      n.content,
      n.created_at,
      n.updated_at,
    ]);
    const newsPlaceholders = news
      .map(
        (_, i) =>
          `($${i * 5 + 1}, $${i * 5 + 2}, $${i * 5 + 3}, $${i * 5 + 4}, $${
            i * 5 + 5
          })`
      )
      .join(',');

    const newsQuery: QueryConfig = {
      text: `INSERT INTO newsletter (author, category, content, created_at, updated_at) VALUES ${newsPlaceholders}`,
      values: newsValues,
    };

    await db.query(newsQuery);

    // Now connect the subscribers to the newsletters
    const subscriberNewsletter: QueryConfig = {
      text: `INSERT INTO subscriber_newsletter (newsletter, subscriber) SELECT (SELECT id FROM NEWSLETTER ORDER BY random() LIMIT 1), id FROM subscriber`,
    };

    await db.query(subscriberNewsletter);

    console.info('🌱 Seeding completed.');
  } catch (error) {
    console.error('🚨 Seeding failed.', error);
  } finally {
    // Close the connection
    getClient().end();
    console.info('🔌 Disconnected from the Database.');
  }
}

seed();
