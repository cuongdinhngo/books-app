import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { faker } from '@faker-js/faker';

console.log("Seeding database...");
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Truncate tables if --truncate flag is provided
const shouldTruncate = process.argv.includes('--truncate');

const tables = [
  "books_reviews",
  "book_copies",
  "books_authors",
  "books_categories",
  "books_publishers",
  "books",
  "authors",
  "categories",
  "publishers",
  "users"
];

if (shouldTruncate) {
  await truncateAllTables(tables);
}
seedDatabase();

async function truncateAllTables(tables) {
  console.log("Truncating all tables...");
  
  try {
    const sqlStatement = `TRUNCATE TABLE ${tables.join(', ')} CASCADE;`;
    const { error } = await supabase.rpc('execute_sql', { sql: sqlStatement });
    if (error) throw error;

    console.log("All tables truncated successfully");
  } catch (err) {
    console.error("Failed to truncate tables:", err);
  }
}

async function seedDatabase() {
  console.log("Seeding database...");
  
  try {    
    // AUTHORS
    console.log("Seeding authors...");
    const mockAuthors = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      full_name: faker.person.fullName(),
    }));
    const { error: authorError } = await supabase.from("authors").upsert(mockAuthors);
    if (authorError) {
      console.error("[ERROR] inserting AUTHORS:", authorError);
    }

    // CATEGORIES (realistic genres)
    console.log("Seeding categories...");
    const realCategories = [
      "Fiction", "Non-Fiction", "Science Fiction", "Fantasy", "Mystery", "Thriller", "Romance",
      "Historical", "Biography", "Self-Help", "Health & Wellness", "Travel", "Children's",
      "Young Adult", "Horror", "Comics & Graphic Novels", "Poetry", "Cookbooks", "Art & Photography", "Science & Technology"
    ];
    const categoryCount = faker.number.int({ min: 15, max: 20 });
    const selectedCategories = faker.helpers.arrayElements(realCategories, categoryCount);
    const mockCategories = selectedCategories.map((name, i) => ({
      id: i + 1,
      name,
    }));
    const { error: categoryError } = await supabase.from("categories").upsert(mockCategories);
    if (categoryError) {
      console.error("[ERROR] inserting CATEGORIES:", categoryError);
    }

    // PUBLISHERS
    console.log("Seeding publishers...");
    const mockPublishers = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      name: faker.company.name(),
    }));
    const { error: publisherError } = await supabase.from("publishers").upsert(mockPublishers);
    if (publisherError) { 
      console.error("[ERROR] inserting PUBLISHERS:", publisherError);
    }

    // BOOKS
    console.log("Seeding books...");
    const quantity = 1000;
    const bookCovers = [
      'https://feizrojtanowvxiiashl.supabase.co/storage/v1/object/public/books/books/10.jpg',
      'https://feizrojtanowvxiiashl.supabase.co/storage/v1/object/public/books/books/11.jpg',
      'https://feizrojtanowvxiiashl.supabase.co/storage/v1/object/public/books/books/12.jpg',
      'https://feizrojtanowvxiiashl.supabase.co/storage/v1/object/public/books/books/13.jpg',
      'https://feizrojtanowvxiiashl.supabase.co/storage/v1/object/public/books/books/14.jpg',
      'https://feizrojtanowvxiiashl.supabase.co/storage/v1/object/public/books/books/15.jpg',
      'https://feizrojtanowvxiiashl.supabase.co/storage/v1/object/public/books/books/16.jpg',
      'https://feizrojtanowvxiiashl.supabase.co/storage/v1/object/public/books/books/17.jpg',
      'https://feizrojtanowvxiiashl.supabase.co/storage/v1/object/public/books/books/18.jpg',
      'https://feizrojtanowvxiiashl.supabase.co/storage/v1/object/public/books/books/19.jpg',
      'https://feizrojtanowvxiiashl.supabase.co/storage/v1/object/public/books/books/1.jpg',
      'https://feizrojtanowvxiiashl.supabase.co/storage/v1/object/public/books/books/20.jpg',
      'https://feizrojtanowvxiiashl.supabase.co/storage/v1/object/public/books/books/21.jpg',
      'https://feizrojtanowvxiiashl.supabase.co/storage/v1/object/public/books/books/2.jpg',
      'https://feizrojtanowvxiiashl.supabase.co/storage/v1/object/public/books/books/02369adf-166d-4aa7-9c84-e766ca3b61e8.jpg',
      'https://feizrojtanowvxiiashl.supabase.co/storage/v1/object/public/books/books/106007e5-5365-4b6a-9878-adaaa923132b.jpg',
      'https://feizrojtanowvxiiashl.supabase.co/storage/v1/object/public/books/books/18079fd9-5074-463c-a445-853e9dae4fc6.jpg',
      'https://feizrojtanowvxiiashl.supabase.co/storage/v1/object/public/books/books/18b62dc2-0634-4ac8-8d5c-791d1b88e6b7.jpg',
      'https://feizrojtanowvxiiashl.supabase.co/storage/v1/object/public/books/books/1daef48d-0310-4dd8-ab5f-29a22a297ee4.jpg',
      'https://feizrojtanowvxiiashl.supabase.co/storage/v1/object/public/books/books/1e608bac-3c5d-4b8d-88c5-6c724affcec0.png',
      'https://feizrojtanowvxiiashl.supabase.co/storage/v1/object/public/books/books/2ad39815-e09a-4d1a-ae35-b532e27a1f7c.jpg',
      'https://feizrojtanowvxiiashl.supabase.co/storage/v1/object/public/books/books/31cee5f3-dd52-48b4-ad66-0e96c3eab250.jpg',
      'https://feizrojtanowvxiiashl.supabase.co/storage/v1/object/public/books/books/33766a01-24aa-4693-aced-0da9aafde2ab.jpg',
      'https://feizrojtanowvxiiashl.supabase.co/storage/v1/object/public/books/books/41e51127-ea8d-4a2b-bfb8-2354d8809ec9.jpg',
      'https://feizrojtanowvxiiashl.supabase.co/storage/v1/object/public/books/books/d810e426-6053-4494-ae32-38e74831df8c.webp',
      'https://feizrojtanowvxiiashl.supabase.co/storage/v1/object/public/books/books/ddd8952b-5050-4c77-9f23-9a69d9c93a2b.jpg',
      'https://feizrojtanowvxiiashl.supabase.co/storage/v1/object/public/books/books/f06a2a73-f4f5-4a42-aa04-ea711d9302d9.webp'
    ];
    let bookIds = [];
    const mockBooks = Array.from({ length: quantity }, (_, index) => {
      const bookId = index + 1;
      bookIds.push(bookId);
      return {
        id: bookId,
        title: faker.lorem.words({ min: 2, max: 5 }).replace(/^\w/, c => c.toUpperCase()),
        description: faker.lorem.paragraphs(faker.number.int({ min: 10, max: 30 }), '\n\n'),
        cover_image: bookCovers.length ? bookCovers[index % bookCovers.length] : faker.image.urlPicsumPhotos(),
      }
    });
    const { error: bookError } = await supabase.from("books").upsert(mockBooks);
    if (bookError) {
      console.error("[ERROR] inserting BOOKS:", bookError);
    }

    // BOOK COPIES (2-5 per book, random status)
    console.log("Seeding book copies...");
    const statuses = ['pending', 'opening', 'lost', 'retired'];
    const mockBookCopies = bookIds.flatMap((bookId) => {
      const copyCount = faker.number.int({ min: 2, max: 5 });
      return Array.from({ length: copyCount }, () => ({
        book_id: bookId,
        status: faker.helpers.arrayElement(statuses),
      }));
    });
    const { error: bookCopyError } = await supabase.from("book_copies").upsert(mockBookCopies);
    if (bookCopyError) {
      console.error("[ERROR] inserting BOOKS_COPPIES:", bookCopyError);
    }

    // BOOK AUTHORS (1-3 per book)
    console.log("Seeding book authors...");
    const mockBookAuthors = [];
    for (const bookId of bookIds) {
      const authorCount = faker.number.int({ min: 1, max: 3 });
      const authorIds = faker.helpers.arrayElements(mockAuthors.map(a => a.id), authorCount);
      for (const author_id of authorIds) {
        mockBookAuthors.push({ book_id: bookId, author_id });
      }
    }
    const { error: bookAuthorError } = await supabase.from("books_authors").upsert(mockBookAuthors);
    if (bookAuthorError) {
      console.error("[ERROR] inserting BOOKS_AUTHORS:", bookAuthorError);
    }

    // BOOK CATEGORIES (1-3 per book)
    console.log("Seeding book categories...");
    const mockBookCategories = [];
    for (const bookId of bookIds) {
      const catCount = faker.number.int({ min: 1, max: 3 });
      const catIds = faker.helpers.arrayElements(mockCategories.map(c => c.id), catCount);
      for (const category_id of catIds) {
        mockBookCategories.push({ book_id: bookId, category_id });
      }
    }
    const { error: bookCategoryError } = await supabase.from("books_categories").upsert(mockBookCategories);
    if (bookCategoryError) {
      console.error("[ERROR] inserting BOOKS_CATEGORIES:", bookCategoryError);
    }

    // BOOK PUBLISHERS (1-3 per book)
    console.log("Seeding book publishers...");
    const mockBookPublishers = [];
    for (const bookId of bookIds) {
      const pubCount = faker.number.int({ min: 1, max: 3 });
      const pubIds = faker.helpers.arrayElements(mockPublishers.map(p => p.id), pubCount);
      for (const publisher_id of pubIds) {
        mockBookPublishers.push({ book_id: bookId, publisher_id });
      }
    }
    const { error: bookPublisherError } = await supabase.from("books_publishers").upsert(mockBookPublishers);
    if (bookPublisherError) {
      console.error("[ERROR] inserting BOOKS_PUBLISHERS:", bookPublisherError);
    }

    // READERS
    console.log("Seeding readers...");
    const readerCount = 300;
    const mockReaders = Array.from({ length: readerCount }, () => ({
      id: faker.string.uuid(), // Use faker's UUID generator instead of generateUUID
      name: faker.person.fullName(),
      email: faker.internet.email(),
      role: "reader",
    }));
    const { error: readerError } = await supabase.from("users").upsert(mockReaders);
    if (readerError) {
      console.error("[ERROR] inserting READERS:", readerError);
    }

    // REVIEWS (2-20 per book, unique (book, reader))
    console.log("Seeding reviews...");
    const readerIds = mockReaders.map(r => r.id);
    const mockBookReviews = [];
    for (const bookId of bookIds) {
      const reviewCount = faker.number.int({ min: 2, max: 20 });
      const reviewers = faker.helpers.arrayElements(readerIds, reviewCount);
      for (const reader_id of reviewers) {
        mockBookReviews.push({
          book_id: bookId,
          reader_id,
          rating: faker.number.int({ min: 1, max: 5 }),
          content: faker.lorem.sentences({ min: 1, max: 3 }),
          created_at: faker.date.past().toISOString(),
        });
      }
    }
    const { error: bookReviewError } = await supabase.from("books_reviews").upsert(mockBookReviews);
    if (bookReviewError) {
      console.error("[ERROR] inserting BOOKS_REVIEWS:", bookReviewError);
    }

    console.log("DONE");
  } catch (err) {
    console.error("Failed to seed database:", err);
  }
}


